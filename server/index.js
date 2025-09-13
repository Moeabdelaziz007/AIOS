const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client/dist'));

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Socket.io connection handling
const connectedUsers = new Map();
const systemRooms = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication and room joining
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    connectedUsers.set(socket.id, { userId, socketId: socket.id, connectedAt: new Date() });
    
    // Broadcast updated online users list
    const onlineUsers = Array.from(connectedUsers.values()).map(user => ({
      id: user.userId,
      socketId: user.socketId,
      connectedAt: user.connectedAt
    }));
    
    io.emit('online_users', onlineUsers);
    socket.emit('user_joined', { id: userId, socketId: socket.id });
  });

  socket.on('join_system_room', (roomName) => {
    socket.join(roomName);
    systemRooms.add(roomName);
    console.log(`User ${socket.id} joined system room: ${roomName}`);
  });

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);
  });

  socket.on('leave_room', (roomName) => {
    socket.leave(roomName);
    console.log(`User ${socket.id} left room: ${roomName}`);
  });

  // Handle notifications
  socket.on('send_notification', (data) => {
    const { to, notification } = data;
    socket.to(`user_${to}`).emit('notification', notification);
  });

  // Handle system alerts
  socket.on('broadcast_system_alert', (alert) => {
    io.emit('system_alert', alert);
    console.log('System alert broadcasted:', alert);
  });

  // Handle app status updates
  socket.on('update_app_status', async (data) => {
    const { appId, status } = data;
    
    try {
      // Update app status in Firestore
      const appRef = doc(db, 'apps', appId);
      await updateDoc(appRef, { 
        status, 
        updatedAt: new Date().toISOString() 
      });
      
      // Broadcast update to all connected clients
      io.emit('app_updated', { appId, status, updatedAt: new Date().toISOString() });
      
      console.log(`App ${appId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating app status:', error);
      socket.emit('error', { message: 'Failed to update app status' });
    }
  });

  // Handle system status requests
  socket.on('request_system_status', async () => {
    try {
      const appsSnapshot = await getDocs(collection(db, 'apps'));
      const totalApps = appsSnapshot.size;
      const activeApps = appsSnapshot.docs.filter(doc => doc.data().status === 'active').length;
      
      const systemStatus = {
        totalApps,
        activeApps,
        inactiveApps: totalApps - activeApps,
        uptime: '99.9%',
        timestamp: new Date().toISOString()
      };
      
      socket.emit('system_status_update', systemStatus);
    } catch (error) {
      console.error('Error fetching system status:', error);
      socket.emit('error', { message: 'Failed to fetch system status' });
    }
  });

  // Handle data agent updates
  socket.on('data_agent_update', (data) => {
    io.emit('data_agent_update', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      
      // Broadcast updated online users list
      const onlineUsers = Array.from(connectedUsers.values()).map(user => ({
        id: user.userId,
        socketId: user.socketId,
        connectedAt: user.connectedAt
      }));
      
      io.emit('online_users', onlineUsers);
      io.emit('user_left', user.userId);
    }
  });
});

// Periodic system status updates
setInterval(async () => {
  try {
    const appsSnapshot = await getDocs(collection(db, 'apps'));
    const totalApps = appsSnapshot.size;
    const activeApps = appsSnapshot.docs.filter(doc => doc.data().status === 'active').length;
    
    const systemStatus = {
      totalApps,
      activeApps,
      inactiveApps: totalApps - activeApps,
      uptime: '99.9%',
      timestamp: new Date().toISOString()
    };
    
    io.emit('system_status_update', systemStatus);
  } catch (error) {
    console.error('Error in periodic system status update:', error);
  }
}, 30000); // Update every 30 seconds

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AIOS Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    projectId: process.env.FIREBASE_PROJECT_ID,
    apiUrl: process.env.AIOS_API_URL,
    wsUrl: process.env.AIOS_WS_URL
  });
});

// AIOS Core API Routes

// Get all apps
app.get('/api/apps', async (req, res) => {
  try {
    const appsRef = collection(db, 'apps');
    const q = query(appsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const apps = [];
    snapshot.forEach((doc) => {
      apps.push({ id: doc.id, ...doc.data() });
    });
    res.json({ apps });
  } catch (error) {
    console.error('Error fetching apps:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single app by ID
app.get('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appRef = doc(db, 'apps', id);
    const appSnap = await getDoc(appRef);
    
    if (!appSnap.exists()) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    res.json({ id: appSnap.id, ...appSnap.data() });
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new app
app.post('/api/apps', async (req, res) => {
  try {
    const { name, description, category, config } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    const appData = {
      name,
      description,
      category: category || 'general',
      config: config || {},
      status: 'inactive',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'apps'), appData);
    res.status(201).json({ id: docRef.id, ...appData });
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update app
app.put('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const appRef = doc(db, 'apps', id);
    await updateDoc(appRef, updateData);
    
    res.json({ id, ...updateData });
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete app
app.delete('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'apps', id));
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get system status
app.get('/api/system/status', async (req, res) => {
  try {
    const appsRef = collection(db, 'apps');
    const snapshot = await getDocs(appsRef);
    const totalApps = snapshot.size;
    
    const activeApps = snapshot.docs.filter(doc => doc.data().status === 'active').length;
    
    res.json({
      status: 'online',
      totalApps,
      activeApps,
      inactiveApps: totalApps - activeApps,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching system status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get system logs
app.get('/api/system/logs', async (req, res) => {
  try {
    const logsRef = collection(db, 'system_logs');
    const q = query(logsRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const logs = [];
    snapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create system log
app.post('/api/system/logs', async (req, res) => {
  try {
    const { level, message, metadata } = req.body;
    
    if (!level || !message) {
      return res.status(400).json({ error: 'Level and message are required' });
    }
    
    const logData = {
      level,
      message,
      metadata: metadata || {},
      timestamp: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'system_logs'), logData);
    res.status(201).json({ id: docRef.id, ...logData });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 AIOS Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🔥 Firebase connected: ${process.env.FIREBASE_PROJECT_ID}`);
});
