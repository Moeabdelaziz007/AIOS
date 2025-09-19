/**
 * 🔗 MCP (Model Context Protocol) Client Implementation
 * 
 * Implements MCP client for agent communication and context sharing
 * Enables agents to connect to MCP server and collaborate
 */

const WebSocket = require('ws');
const EventEmitter = require('events');

class MCPClient extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.name = 'MCP Client';
    this.version = '1.0.0';
    this.serverUrl = options.serverUrl || 'ws://localhost:3001/mcp';
    this.agentId = options.agentId || this.generateAgentId();
    this.agentType = options.agentType || 'general';
    this.capabilities = options.capabilities || {};
    
    // Connection state
    this.ws = null;
    this.isConnected = false;
    this.isInitialized = false;
    this.sessionId = null;
    
    // Message handling
    this.messageHandlers = new Map();
    this.pendingRequests = new Map();
    this.requestId = 0;
    
    // Context management
    this.sharedContexts = new Map();
    this.contextSubscriptions = new Set();
    
    console.log(`🔗 ${this.name} v${this.version} initialized for agent ${this.agentId}`);
  }

  /**
   * Connect to MCP Server
   */
  async connect() {
    try {
      console.log(`🔗 Connecting to MCP Server: ${this.serverUrl}`);
      
      this.ws = new WebSocket(this.serverUrl);
      
      return new Promise((resolve, reject) => {
        this.ws.on('open', () => {
          console.log('✅ Connected to MCP Server');
          this.isConnected = true;
          resolve();
        });
        
        this.ws.on('message', (data) => {
          this.handleMessage(data);
        });
        
        this.ws.on('close', () => {
          console.log('🔌 Disconnected from MCP Server');
          this.isConnected = false;
          this.isInitialized = false;
          this.emit('disconnected');
        });
        
        this.ws.on('error', (error) => {
          console.error('❌ MCP Client connection error:', error.message);
          reject(error);
        });
      });
      
    } catch (error) {
      console.error('❌ Failed to connect to MCP Server:', error.message);
      throw error;
    }
  }

  /**
   * Initialize the client
   */
  async initialize() {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to MCP Server');
      }
      
      console.log('🚀 Initializing MCP Client...');
      
      // Send initialize message
      const initMessage = {
        type: 'initialize',
        data: {
          protocolVersion: '2024-11-05',
          capabilities: this.capabilities,
          clientInfo: {
            name: this.name,
            version: this.version,
            agentId: this.agentId,
            agentType: this.agentType
          }
        }
      };
      
      await this.sendMessage(initMessage);
      
      // Register agent
      await this.registerAgent();
      
      this.isInitialized = true;
      console.log('✅ MCP Client initialized successfully');
      
      return {
        status: 'initialized',
        agentId: this.agentId,
        capabilities: this.capabilities
      };
      
    } catch (error) {
      console.error('❌ Failed to initialize MCP Client:', error.message);
      throw error;
    }
  }

  /**
   * Register agent with server
   */
  async registerAgent() {
    const registerMessage = {
      type: 'agent/register',
      data: {
        agentId: this.agentId,
        agentType: this.agentType,
        capabilities: this.capabilities,
        context: {
          status: 'active',
          lastActivity: new Date().toISOString()
        }
      }
    };
    
    await this.sendMessage(registerMessage);
  }

  /**
   * Handle incoming messages
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data.toString());
      
      // Handle handshake
      if (message.type === 'handshake') {
        this.handleHandshake(message);
        return;
      }
      
      // Handle responses
      if (message.type.endsWith('_response')) {
        this.handleResponse(message);
        return;
      }
      
      // Handle context sharing
      if (message.type === 'context_shared') {
        this.handleContextShared(message);
        return;
      }
      
      // Handle agent updates
      if (message.type === 'agent_update') {
        this.handleAgentUpdate(message);
        return;
      }
      
      // Handle errors
      if (message.type === 'error') {
        this.handleError(message);
        return;
      }
      
      // Emit custom message
      this.emit('message', message);
      
    } catch (error) {
      console.error('❌ Error handling message:', error.message);
    }
  }

  /**
   * Handle handshake message
   */
  handleHandshake(message) {
    console.log('🤝 Received handshake from server');
    this.emit('handshake', message);
  }

  /**
   * Handle response messages
   */
  handleResponse(message) {
    const requestId = message.requestId;
    if (requestId && this.pendingRequests.has(requestId)) {
      const { resolve, reject } = this.pendingRequests.get(requestId);
      this.pendingRequests.delete(requestId);
      
      if (message.success !== false) {
        resolve(message);
      } else {
        reject(new Error(message.error || 'Request failed'));
      }
    }
  }

  /**
   * Handle context shared message
   */
  handleContextShared(message) {
    const { fromAgent, contextType, contextData, timestamp } = message.data;
    
    // Store shared context
    const contextKey = `${fromAgent}:${contextType}`;
    this.sharedContexts.set(contextKey, {
      fromAgent,
      contextType,
      contextData,
      timestamp,
      receivedAt: new Date().toISOString()
    });
    
    console.log(`📥 Received context from ${fromAgent}: ${contextType}`);
    this.emit('contextReceived', message.data);
  }

  /**
   * Handle agent update message
   */
  handleAgentUpdate(message) {
    const { agentId, action, timestamp } = message.data;
    console.log(`🔄 Agent update: ${agentId} ${action}`);
    this.emit('agentUpdate', message.data);
  }

  /**
   * Handle error message
   */
  handleError(message) {
    console.error('❌ Server error:', message.data.message);
    this.emit('error', message.data);
  }

  /**
   * Send message to server
   */
  async sendMessage(message, expectResponse = false) {
    if (!this.isConnected || !this.ws) {
      throw new Error('Not connected to MCP Server');
    }
    
    // Add request ID if expecting response
    if (expectResponse) {
      message.requestId = ++this.requestId;
    }
    
    return new Promise((resolve, reject) => {
      if (expectResponse) {
        this.pendingRequests.set(message.requestId, { resolve, reject });
        
        // Set timeout for response
        setTimeout(() => {
          if (this.pendingRequests.has(message.requestId)) {
            this.pendingRequests.delete(message.requestId);
            reject(new Error('Request timeout'));
          }
        }, 30000); // 30 second timeout
      }
      
      try {
        this.ws.send(JSON.stringify(message));
        
        if (!expectResponse) {
          resolve();
        }
      } catch (error) {
        if (expectResponse && this.pendingRequests.has(message.requestId)) {
          this.pendingRequests.delete(message.requestId);
        }
        reject(error);
      }
    });
  }

  /**
   * Share context with other agents
   */
  async shareContext(contextType, contextData, targetAgents = null) {
    try {
      const message = {
        type: 'context/share',
        data: {
          contextType,
          contextData,
          targetAgents,
          priority: 'normal'
        }
      };
      
      await this.sendMessage(message);
      console.log(`📤 Shared context: ${contextType}`);
      
      return {
        success: true,
        contextType,
        targetAgents: targetAgents || 'all'
      };
      
    } catch (error) {
      console.error('❌ Failed to share context:', error.message);
      throw error;
    }
  }

  /**
   * Request context from another agent
   */
  async requestContext(contextType, fromAgent) {
    try {
      const message = {
        type: 'context/request',
        data: {
          contextType,
          fromAgent,
          timeout: 10000
        }
      };
      
      const response = await this.sendMessage(message, true);
      
      if (response.data.found) {
        console.log(`📥 Received requested context: ${contextType} from ${fromAgent}`);
        return response.data.contextData;
      } else {
        console.log(`⚠️ Context not found: ${contextType} from ${fromAgent}`);
        return null;
      }
      
    } catch (error) {
      console.error('❌ Failed to request context:', error.message);
      throw error;
    }
  }

  /**
   * Call MCP tool
   */
  async callTool(toolName, args) {
    try {
      const message = {
        type: 'tools/call',
        data: {
          name: toolName,
          arguments: args
        }
      };
      
      const response = await this.sendMessage(message, true);
      
      if (response.data.success) {
        console.log(`🔧 Tool executed successfully: ${toolName}`);
        return response.data.result;
      } else {
        throw new Error(response.data.error || 'Tool execution failed');
      }
      
    } catch (error) {
      console.error(`❌ Tool execution failed: ${toolName}`, error.message);
      throw error;
    }
  }

  /**
   * Analyze error using MCP tool
   */
  async analyzeError(errorData) {
    try {
      return await this.callTool('analyze_error', { errorData });
    } catch (error) {
      console.error('❌ Error analysis failed:', error.message);
      throw error;
    }
  }

  /**
   * Generate fix using MCP tool
   */
  async generateFix(errorType, context = {}) {
    try {
      return await this.callTool('generate_fix', { errorType, context });
    } catch (error) {
      console.error('❌ Fix generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Get available tools
   */
  async getAvailableTools() {
    try {
      const message = {
        type: 'tools/list',
        data: {}
      };
      
      const response = await this.sendMessage(message, true);
      return response.data.tools;
      
    } catch (error) {
      console.error('❌ Failed to get available tools:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to context updates
   */
  subscribeToContext(contextType) {
    this.contextSubscriptions.add(contextType);
    console.log(`📡 Subscribed to context: ${contextType}`);
  }

  /**
   * Unsubscribe from context updates
   */
  unsubscribeFromContext(contextType) {
    this.contextSubscriptions.delete(contextType);
    console.log(`📡 Unsubscribed from context: ${contextType}`);
  }

  /**
   * Get shared contexts
   */
  getSharedContexts() {
    return Array.from(this.sharedContexts.values());
  }

  /**
   * Get specific shared context
   */
  getSharedContext(fromAgent, contextType) {
    const contextKey = `${fromAgent}:${contextType}`;
    return this.sharedContexts.get(contextKey);
  }

  /**
   * Update agent status
   */
  async updateStatus(status, context = {}) {
    try {
      const message = {
        type: 'agent/status',
        data: {
          agentId: this.agentId,
          status,
          context: {
            ...context,
            lastActivity: new Date().toISOString()
          }
        }
      };
      
      await this.sendMessage(message);
      console.log(`📊 Updated agent status: ${status}`);
      
    } catch (error) {
      console.error('❌ Failed to update agent status:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from server
   */
  async disconnect() {
    try {
      console.log('🔌 Disconnecting from MCP Server...');
      
      if (this.ws) {
        this.ws.close();
      }
      
      this.isConnected = false;
      this.isInitialized = false;
      
      // Clear pending requests
      for (const [requestId, { reject }] of this.pendingRequests) {
        reject(new Error('Client disconnected'));
      }
      this.pendingRequests.clear();
      
      console.log('✅ Disconnected from MCP Server');
      
    } catch (error) {
      console.error('❌ Error during disconnect:', error.message);
    }
  }

  /**
   * Utility methods
   */
  generateAgentId() {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get client status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isInitialized: this.isInitialized,
      agentId: this.agentId,
      agentType: this.agentType,
      sharedContexts: this.sharedContexts.size,
      subscriptions: this.contextSubscriptions.size,
      pendingRequests: this.pendingRequests.size
    };
  }
}

module.exports = MCPClient;
