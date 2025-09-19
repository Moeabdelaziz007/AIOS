/**
 * 🎨 AIOS Frontend Integration System
 *
 * This file creates a unified frontend integration with all backend services
 */

import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Create API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API Services
export const apiServices = {
  // System API
  system: {
    getStatus: () => api.get('/system/status'),
    getHealth: () => api.get('/health'),
    getConfig: () => api.get('/config'),
  },

  // Apps API
  apps: {
    getAll: () => api.get('/apps'),
    getById: id => api.get(`/apps/${id}`),
    create: data => api.post('/apps', data),
    update: (id, data) => api.put(`/apps/${id}`, data),
    delete: id => api.delete(`/apps/${id}`),
  },

  // Errors API
  errors: {
    getAll: () => api.get('/errors'),
    getById: id => api.get(`/errors/${id}`),
  },

  // Quantum Autopilot API
  quantum: {
    getStatus: () => api.get('/quantum/status'),
    getStats: () => api.get('/quantum/stats'),
    getRecommendations: () => api.get('/quantum/recommendations'),
  },
};

// Socket Context
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to AIOS Backend');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from AIOS Backend');
      setIsConnected(false);
    });

    newSocket.on('online_users', users => {
      setOnlineUsers(users);
    });

    newSocket.on('system_status_update', status => {
      setSystemStatus(status);
    });

    newSocket.on('notification', notification => {
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          ...notification,
          timestamp: new Date(),
        },
      ]);
    });

    newSocket.on('system_error', error => {
      console.error('🚨 System Error:', error);
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'error',
          title: 'System Error',
          message: error.message,
          timestamp: new Date(),
        },
      ]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinUserRoom = userData => {
    if (socket) {
      socket.emit('join_user_room', userData);
    }
  };

  const requestSystemStatus = () => {
    if (socket) {
      socket.emit('system_status_request');
    }
  };

  const sendNotification = notification => {
    if (socket) {
      socket.emit('notification', notification);
    }
  };

  const sendAIActivity = activity => {
    if (socket) {
      socket.emit('ai_activity', activity);
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    systemStatus,
    notifications,
    joinUserRoom,
    requestSystemStatus,
    sendNotification,
    sendAIActivity,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// System Integration Context
const SystemIntegrationContext = createContext();

export const SystemIntegrationProvider = ({ children }) => {
  const [systemData, setSystemData] = useState({
    apps: [],
    errors: [],
    quantumStatus: null,
    systemConfig: null,
    loading: true,
    error: null,
  });

  const [refreshInterval, setRefreshInterval] = useState(null);

  const fetchSystemData = async () => {
    try {
      setSystemData(prev => ({ ...prev, loading: true, error: null }));

      const [appsRes, errorsRes, quantumRes, configRes] = await Promise.all([
        apiServices.apps.getAll(),
        apiServices.errors.getAll(),
        apiServices.quantum.getStatus(),
        apiServices.system.getConfig(),
      ]);

      setSystemData({
        apps: appsRes.data.apps || [],
        errors: errorsRes.data.errors || [],
        quantumStatus: quantumRes.data || null,
        systemConfig: configRes.data || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch system data:', error);
      setSystemData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  const createApp = async appData => {
    try {
      const response = await apiServices.apps.create(appData);
      await fetchSystemData(); // Refresh data
      return response.data;
    } catch (error) {
      console.error('Failed to create app:', error);
      throw error;
    }
  };

  const updateApp = async (id, appData) => {
    try {
      const response = await apiServices.apps.update(id, appData);
      await fetchSystemData(); // Refresh data
      return response.data;
    } catch (error) {
      console.error('Failed to update app:', error);
      throw error;
    }
  };

  const deleteApp = async id => {
    try {
      await apiServices.apps.delete(id);
      await fetchSystemData(); // Refresh data
    } catch (error) {
      console.error('Failed to delete app:', error);
      throw error;
    }
  };

  const startAutoRefresh = (interval = 30000) => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const intervalId = setInterval(fetchSystemData, interval);
    setRefreshInterval(intervalId);
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  useEffect(() => {
    fetchSystemData();
    startAutoRefresh();

    return () => {
      stopAutoRefresh();
    };
  }, []);

  const value = {
    ...systemData,
    fetchSystemData,
    createApp,
    updateApp,
    deleteApp,
    startAutoRefresh,
    stopAutoRefresh,
  };

  return (
    <SystemIntegrationContext.Provider value={value}>
      {children}
    </SystemIntegrationContext.Provider>
  );
};

export const useSystemIntegration = () => {
  const context = useContext(SystemIntegrationContext);
  if (!context) {
    throw new Error(
      'useSystemIntegration must be used within a SystemIntegrationProvider'
    );
  }
  return context;
};

// Unified Hook for all integrations
export const useAIOSIntegration = () => {
  const socket = useSocket();
  const systemIntegration = useSystemIntegration();

  return {
    // Socket integration
    ...socket,

    // System integration
    ...systemIntegration,

    // Combined methods
    refreshAll: () => {
      systemIntegration.fetchSystemData();
      socket.requestSystemStatus();
    },

    // Error handling
    handleError: error => {
      console.error('AIOS Integration Error:', error);
      socket.sendNotification({
        type: 'error',
        title: 'Integration Error',
        message: error.message,
      });
    },
  };
};

// Export API services for direct use
export { api };
