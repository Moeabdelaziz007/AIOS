/**
 * 🔗 MCP (Model Context Protocol) Server Implementation
 * 
 * Implements MCP server for multi-agent communication and context sharing
 * Based on GitHub's MCP patterns for enhanced agent collaboration
 */

const EventEmitter = require('events');
const WebSocket = require('ws');
const http = require('http');

class MCPServer extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.name = 'MCP Server';
    this.version = '1.0.0';
    this.port = options.port || 3001;
    this.host = options.host || 'localhost';
    
    // MCP Protocol Configuration
    this.protocolVersion = '2024-11-05';
    this.capabilities = {
      tools: true,
      resources: true,
      prompts: true,
      logging: true,
      sampling: true
    };
    
    // Agent Registry
    this.agents = new Map();
    this.contexts = new Map();
    this.sessions = new Map();
    
    // Communication Channels
    this.channels = new Map();
    this.messageQueue = [];
    
    // Server Components
    this.httpServer = null;
    this.wss = null;
    this.isRunning = false;
    
    console.log(`🔗 ${this.name} v${this.version} initialized`);
  }

  /**
   * Start the MCP Server
   */
  async start() {
    try {
      console.log('🚀 Starting MCP Server...');
      
      // Create HTTP server
      this.httpServer = http.createServer();
      
      // Create WebSocket server
      this.wss = new WebSocket.Server({ 
        server: this.httpServer,
        path: '/mcp'
      });
      
      // Setup WebSocket handlers
      this.setupWebSocketHandlers();
      
      // Start server
      await new Promise((resolve, reject) => {
        this.httpServer.listen(this.port, this.host, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      
      this.isRunning = true;
      console.log(`✅ MCP Server running on ws://${this.host}:${this.port}/mcp`);
      
      // Start message processing
      this.startMessageProcessing();
      
      return {
        status: 'running',
        url: `ws://${this.host}:${this.port}/mcp`,
        capabilities: this.capabilities
      };
      
    } catch (error) {
      console.error('❌ Failed to start MCP Server:', error.message);
      throw error;
    }
  }

  /**
   * Setup WebSocket handlers
   */
  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('🔗 New MCP connection established');
      
      const sessionId = this.generateSessionId();
      const session = {
        id: sessionId,
        ws: ws,
        agentId: null,
        capabilities: {},
        context: {},
        connectedAt: new Date(),
        lastActivity: new Date()
      };
      
      this.sessions.set(sessionId, session);
      
      // Setup message handlers
      ws.on('message', (data) => {
        this.handleMessage(sessionId, data);
      });
      
      ws.on('close', () => {
        this.handleDisconnection(sessionId);
      });
      
      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for session ${sessionId}:`, error.message);
      });
      
      // Send initial handshake
      this.sendHandshake(sessionId);
    });
  }

  /**
   * Handle incoming messages
   */
  async handleMessage(sessionId, data) {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) return;
      
      session.lastActivity = new Date();
      
      const message = JSON.parse(data.toString());
      console.log(`📨 Received MCP message from session ${sessionId}:`, message.type);
      
      // Route message based on type
      switch (message.type) {
        case 'initialize':
          await this.handleInitialize(sessionId, message);
          break;
          
        case 'tools/list':
          await this.handleToolsList(sessionId, message);
          break;
          
        case 'tools/call':
          await this.handleToolsCall(sessionId, message);
          break;
          
        case 'resources/list':
          await this.handleResourcesList(sessionId, message);
          break;
          
        case 'resources/read':
          await this.handleResourcesRead(sessionId, message);
          break;
          
        case 'prompts/list':
          await this.handlePromptsList(sessionId, message);
          break;
          
        case 'prompts/get':
          await this.handlePromptsGet(sessionId, message);
          break;
          
        case 'context/share':
          await this.handleContextShare(sessionId, message);
          break;
          
        case 'context/request':
          await this.handleContextRequest(sessionId, message);
          break;
          
        case 'agent/register':
          await this.handleAgentRegister(sessionId, message);
          break;
          
        case 'agent/status':
          await this.handleAgentStatus(sessionId, message);
          break;
          
        default:
          await this.handleUnknownMessage(sessionId, message);
      }
      
    } catch (error) {
      console.error(`❌ Error handling message from session ${sessionId}:`, error.message);
      this.sendError(sessionId, error.message);
    }
  }

  /**
   * Send handshake message
   */
  sendHandshake(sessionId) {
    const handshake = {
      type: 'handshake',
      protocolVersion: this.protocolVersion,
      capabilities: this.capabilities,
      serverInfo: {
        name: this.name,
        version: this.version,
        description: 'AIOS Multi-Agent MCP Server'
      }
    };
    
    this.sendMessage(sessionId, handshake);
  }

  /**
   * Handle initialize message
   */
  async handleInitialize(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    const response = {
      type: 'initialize_response',
      protocolVersion: this.protocolVersion,
      capabilities: this.capabilities,
      serverInfo: {
        name: this.name,
        version: this.version
      }
    };
    
    this.sendMessage(sessionId, response);
    console.log(`✅ Session ${sessionId} initialized`);
  }

  /**
   * Handle agent registration
   */
  async handleAgentRegister(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    const { agentId, agentType, capabilities, context } = message.data;
    
    // Register agent
    const agent = {
      id: agentId,
      type: agentType,
      sessionId: sessionId,
      capabilities: capabilities || {},
      context: context || {},
      registeredAt: new Date(),
      status: 'active'
    };
    
    this.agents.set(agentId, agent);
    session.agentId = agentId;
    
    // Create context channel for agent
    this.createContextChannel(agentId);
    
    const response = {
      type: 'agent_registered',
      data: {
        agentId: agentId,
        status: 'success',
        contextChannel: `context:${agentId}`
      }
    };
    
    this.sendMessage(sessionId, response);
    console.log(`✅ Agent ${agentId} registered successfully`);
    
    // Notify other agents
    this.broadcastAgentUpdate(agentId, 'registered');
  }

  /**
   * Handle context sharing
   */
  async handleContextShare(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.agentId) return;
    
    const { contextType, contextData, targetAgents, priority } = message.data;
    
    const contextMessage = {
      type: 'context_shared',
      data: {
        fromAgent: session.agentId,
        contextType: contextType,
        contextData: contextData,
        timestamp: new Date().toISOString(),
        priority: priority || 'normal'
      }
    };
    
    // Store context
    const contextKey = `${session.agentId}:${contextType}`;
    this.contexts.set(contextKey, contextMessage.data);
    
    // Distribute to target agents
    if (targetAgents && targetAgents.length > 0) {
      for (const targetAgentId of targetAgents) {
        const targetAgent = this.agents.get(targetAgentId);
        if (targetAgent) {
          this.sendMessage(targetAgent.sessionId, contextMessage);
        }
      }
    } else {
      // Broadcast to all agents
      this.broadcastContext(contextMessage);
    }
    
    console.log(`📤 Context shared from ${session.agentId}: ${contextType}`);
  }

  /**
   * Handle context request
   */
  async handleContextRequest(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.agentId) return;
    
    const { contextType, fromAgent, timeout } = message.data;
    
    const contextKey = `${fromAgent}:${contextType}`;
    const context = this.contexts.get(contextKey);
    
    const response = {
      type: 'context_response',
      data: {
        contextType: contextType,
        contextData: context || null,
        found: !!context,
        timestamp: new Date().toISOString()
      }
    };
    
    this.sendMessage(sessionId, response);
    console.log(`📥 Context request fulfilled for ${session.agentId}: ${contextType}`);
  }

  /**
   * Handle tools list request
   */
  async handleToolsList(sessionId, message) {
    const tools = [
      // Core debugging tools
      {
        name: 'analyze_error',
        description: 'Analyze error patterns and provide debugging insights',
        inputSchema: {
          type: 'object',
          properties: {
            errorData: {
              type: 'object',
              description: 'Error information to analyze'
            }
          },
          required: ['errorData']
        }
      },
      {
        name: 'generate_fix',
        description: 'Generate fix suggestions for identified issues',
        inputSchema: {
          type: 'object',
          properties: {
            errorType: {
              type: 'string',
              description: 'Type of error to fix'
            },
            context: {
              type: 'object',
              description: 'Additional context for fix generation'
            }
          },
          required: ['errorType']
        }
      },
      
      // Context sharing tools
      {
        name: 'share_context',
        description: 'Share context with other agents',
        inputSchema: {
          type: 'object',
          properties: {
            contextType: {
              type: 'string',
              description: 'Type of context to share'
            },
            contextData: {
              type: 'object',
              description: 'Context data to share'
            },
            targetAgents: {
              type: 'array',
              description: 'Target agents to receive context'
            }
          },
          required: ['contextType', 'contextData']
        }
      },
      {
        name: 'request_context',
        description: 'Request context from other agents',
        inputSchema: {
          type: 'object',
          properties: {
            contextType: {
              type: 'string',
              description: 'Type of context to request'
            },
            fromAgent: {
              type: 'string',
              description: 'Agent to request context from'
            }
          },
          required: ['contextType', 'fromAgent']
        }
      },
      
      // Cursor CLI tools
      {
        name: 'cursor_analyze_workspace',
        description: 'Analyze workspace structure and code patterns using Cursor CLI',
        inputSchema: {
          type: 'object',
          properties: {
            workspacePath: {
              type: 'string',
              description: 'Path to workspace to analyze'
            },
            analysisType: {
              type: 'string',
              enum: ['structure', 'patterns', 'dependencies', 'performance'],
              description: 'Type of analysis to perform'
            }
          },
          required: ['workspacePath']
        }
      },
      {
        name: 'cursor_detect_changes',
        description: 'Detect file changes and modifications using Cursor CLI',
        inputSchema: {
          type: 'object',
          properties: {
            since: {
              type: 'string',
              description: 'Time since last check (e.g., "1h", "1d")'
            },
            fileTypes: {
              type: 'array',
              description: 'File types to monitor'
            }
          }
        }
      },
      {
        name: 'cursor_analyze_code_patterns',
        description: 'Analyze code patterns and suggest improvements using Cursor CLI',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to file to analyze'
            },
            patternType: {
              type: 'string',
              enum: ['security', 'performance', 'maintainability', 'best_practices'],
              description: 'Type of pattern analysis'
            }
          },
          required: ['filePath']
        }
      },
      
      // Gemini AI tools
      {
        name: 'gemini_analyze_code',
        description: 'Analyze code using Gemini AI for intelligent insights',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze'
            },
            analysisType: {
              type: 'string',
              enum: ['quality', 'security', 'performance', 'maintainability', 'documentation'],
              description: 'Type of analysis to perform'
            },
            context: {
              type: 'object',
              description: 'Additional context for analysis'
            }
          },
          required: ['code', 'analysisType']
        }
      },
      {
        name: 'gemini_generate_code',
        description: 'Generate code using Gemini AI based on specifications',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Description of code to generate'
            },
            language: {
              type: 'string',
              description: 'Programming language'
            },
            style: {
              type: 'string',
              enum: ['functional', 'object_oriented', 'procedural', 'declarative'],
              description: 'Code style preference'
            },
            requirements: {
              type: 'array',
              description: 'Specific requirements for the code'
            }
          },
          required: ['prompt', 'language']
        }
      },
      {
        name: 'gemini_explain_code',
        description: 'Get detailed explanation of code using Gemini AI',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to explain'
            },
            detailLevel: {
              type: 'string',
              enum: ['basic', 'detailed', 'comprehensive'],
              description: 'Level of detail in explanation'
            },
            focus: {
              type: 'string',
              enum: ['functionality', 'performance', 'security', 'maintainability'],
              description: 'Focus area for explanation'
            }
          },
          required: ['code']
        }
      },
      
      // Smart search tools
      {
        name: 'smart_search_code',
        description: 'Perform intelligent code search across the workspace',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
            },
            searchType: {
              type: 'string',
              enum: ['semantic', 'exact', 'fuzzy', 'regex'],
              description: 'Type of search to perform'
            },
            scope: {
              type: 'object',
              properties: {
                directories: { type: 'array' },
                fileTypes: { type: 'array' },
                excludePatterns: { type: 'array' }
              },
              description: 'Search scope and filters'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'smart_search_documentation',
        description: 'Search and retrieve relevant documentation',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              description: 'Documentation topic to search'
            },
            sources: {
              type: 'array',
              enum: ['mdn', 'stackoverflow', 'github', 'npm', 'official_docs'],
              description: 'Documentation sources to search'
            },
            format: {
              type: 'string',
              enum: ['summary', 'detailed', 'examples'],
              description: 'Format of documentation to return'
            }
          },
          required: ['topic']
        }
      },
      
      // Data generation tools
      {
        name: 'generate_test_data',
        description: 'Generate test data for development and testing',
        inputSchema: {
          type: 'object',
          properties: {
            dataType: {
              type: 'string',
              enum: ['user', 'product', 'transaction', 'api_response', 'database'],
              description: 'Type of data to generate'
            },
            count: {
              type: 'number',
              description: 'Number of records to generate'
            },
            schema: {
              type: 'object',
              description: 'Data schema definition'
            },
            format: {
              type: 'string',
              enum: ['json', 'csv', 'sql', 'xml'],
              description: 'Output format'
            }
          },
          required: ['dataType', 'count']
        }
      },
      {
        name: 'generate_mock_api',
        description: 'Generate mock API responses and endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'API endpoint path'
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
              description: 'HTTP method'
            },
            responseSchema: {
              type: 'object',
              description: 'Expected response schema'
            },
            statusCode: {
              type: 'number',
              description: 'HTTP status code'
            }
          },
          required: ['endpoint', 'method']
        }
      },
      
      // System improvement tools
      {
        name: 'analyze_system_performance',
        description: 'Analyze system performance and identify bottlenecks',
        inputSchema: {
          type: 'object',
          properties: {
            metrics: {
              type: 'array',
              enum: ['cpu', 'memory', 'disk', 'network', 'database', 'api'],
              description: 'Performance metrics to analyze'
            },
            timeRange: {
              type: 'string',
              description: 'Time range for analysis (e.g., "1h", "1d", "1w")'
            },
            threshold: {
              type: 'number',
              description: 'Performance threshold for alerts'
            }
          }
        }
      },
      {
        name: 'suggest_optimizations',
        description: 'Suggest system optimizations based on analysis',
        inputSchema: {
          type: 'object',
          properties: {
            analysisData: {
              type: 'object',
              description: 'Performance analysis data'
            },
            optimizationType: {
              type: 'string',
              enum: ['performance', 'security', 'maintainability', 'scalability'],
              description: 'Type of optimization to suggest'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Priority level for optimizations'
            }
          },
          required: ['analysisData']
        }
      },
      {
        name: 'auto_apply_fixes',
        description: 'Automatically apply suggested fixes and improvements',
        inputSchema: {
          type: 'object',
          properties: {
            fixes: {
              type: 'array',
              description: 'List of fixes to apply'
            },
            dryRun: {
              type: 'boolean',
              description: 'Perform dry run without applying changes'
            },
            backup: {
              type: 'boolean',
              description: 'Create backup before applying changes'
            }
          },
          required: ['fixes']
        }
      },
      
      // Learning and adaptation tools
      {
        name: 'learn_from_patterns',
        description: 'Learn from code patterns and user behavior',
        inputSchema: {
          type: 'object',
          properties: {
            patternType: {
              type: 'string',
              enum: ['error', 'success', 'usage', 'performance'],
              description: 'Type of pattern to learn from'
            },
            data: {
              type: 'object',
              description: 'Pattern data to analyze'
            },
            learningGoal: {
              type: 'string',
              description: 'Specific learning objective'
            }
          },
          required: ['patternType', 'data']
        }
      },
      {
        name: 'adapt_system_behavior',
        description: 'Adapt system behavior based on learned patterns',
        inputSchema: {
          type: 'object',
          properties: {
            adaptationType: {
              type: 'string',
              enum: ['error_handling', 'performance', 'user_experience', 'security'],
              description: 'Type of adaptation to perform'
            },
            patterns: {
              type: 'object',
              description: 'Learned patterns to apply'
            },
            confidence: {
              type: 'number',
              description: 'Confidence level for adaptation'
            }
          },
          required: ['adaptationType', 'patterns']
        }
      }
    ];
    
    const response = {
      type: 'tools_list_response',
      data: {
        tools: tools
      }
    };
    
    this.sendMessage(sessionId, response);
  }

  /**
   * Handle tools call
   */
  async handleToolsCall(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.agentId) return;
    
    const { name, arguments: args } = message.data;
    
    try {
      let result;
      
      // Core debugging tools
      if (name === 'analyze_error') {
        result = await this.executeAnalyzeError(args);
      } else if (name === 'generate_fix') {
        result = await this.executeGenerateFix(args);
      }
      
      // Context sharing tools
      else if (name === 'share_context') {
        result = await this.executeShareContext(session.agentId, args);
      } else if (name === 'request_context') {
        result = await this.executeRequestContext(session.agentId, args);
      }
      
      // Cursor CLI tools
      else if (name === 'cursor_analyze_workspace') {
        result = await this.executeCursorAnalyzeWorkspace(args);
      } else if (name === 'cursor_detect_changes') {
        result = await this.executeCursorDetectChanges(args);
      } else if (name === 'cursor_analyze_code_patterns') {
        result = await this.executeCursorAnalyzeCodePatterns(args);
      }
      
      // Gemini AI tools
      else if (name === 'gemini_analyze_code') {
        result = await this.executeGeminiAnalyzeCode(args);
      } else if (name === 'gemini_generate_code') {
        result = await this.executeGeminiGenerateCode(args);
      } else if (name === 'gemini_explain_code') {
        result = await this.executeGeminiExplainCode(args);
      }
      
      // Smart search tools
      else if (name === 'smart_search_code') {
        result = await this.executeSmartSearchCode(args);
      } else if (name === 'smart_search_documentation') {
        result = await this.executeSmartSearchDocumentation(args);
      }
      
      // Data generation tools
      else if (name === 'generate_test_data') {
        result = await this.executeGenerateTestData(args);
      } else if (name === 'generate_mock_api') {
        result = await this.executeGenerateMockAPI(args);
      }
      
      // System improvement tools
      else if (name === 'analyze_system_performance') {
        result = await this.executeAnalyzeSystemPerformance(args);
      } else if (name === 'suggest_optimizations') {
        result = await this.executeSuggestOptimizations(args);
      } else if (name === 'auto_apply_fixes') {
        result = await this.executeAutoApplyFixes(args);
      }
      
      // Learning and adaptation tools
      else if (name === 'learn_from_patterns') {
        result = await this.executeLearnFromPatterns(args);
      } else if (name === 'adapt_system_behavior') {
        result = await this.executeAdaptSystemBehavior(args);
      }
      
      else {
        throw new Error(`Unknown tool: ${name}`);
      }
      
      const response = {
        type: 'tools_call_response',
        data: {
          toolName: name,
          result: result,
          success: true
        }
      };
      
      this.sendMessage(sessionId, response);
      
    } catch (error) {
      const response = {
        type: 'tools_call_response',
        data: {
          toolName: name,
          error: error.message,
          success: false
        }
      };
      
      this.sendMessage(sessionId, response);
    }
  }

  /**
   * Execute analyze error tool
   */
  async executeAnalyzeError(args) {
    const { errorData } = args;
    
    // Simulate error analysis
    const analysis = {
      errorType: this.extractErrorType(errorData.message),
      severity: this.calculateSeverity(errorData.message),
      suggestions: this.generateSuggestions(errorData),
      confidence: 0.85
    };
    
    return analysis;
  }

  /**
   * Execute generate fix tool
   */
  async executeGenerateFix(args) {
    const { errorType, context } = args;
    
    // Simulate fix generation
    const fixes = this.generateFixesByType(errorType, context);
    
    return {
      fixes: fixes,
      confidence: 0.8
    };
  }

  /**
   * Execute share context tool
   */
  async executeShareContext(fromAgentId, args) {
    const { contextType, contextData, targetAgents } = args;
    
    const contextMessage = {
      type: 'context_shared',
      data: {
        fromAgent: fromAgentId,
        contextType: contextType,
        contextData: contextData,
        timestamp: new Date().toISOString()
      }
    };
    
    // Store context
    const contextKey = `${fromAgentId}:${contextType}`;
    this.contexts.set(contextKey, contextMessage.data);
    
    // Distribute to target agents
    if (targetAgents && targetAgents.length > 0) {
      for (const targetAgentId of targetAgents) {
        const targetAgent = this.agents.get(targetAgentId);
        if (targetAgent) {
          this.sendMessage(targetAgent.sessionId, contextMessage);
        }
      }
    }
    
    return {
      shared: true,
      recipients: targetAgents || 'all',
      contextKey: contextKey
    };
  }

  /**
   * Execute request context tool
   */
  async executeRequestContext(fromAgentId, args) {
    const { contextType, fromAgent } = args;
    
    const contextKey = `${fromAgent}:${contextType}`;
    const context = this.contexts.get(contextKey);
    
    return {
      contextType: contextType,
      contextData: context || null,
      found: !!context
    };
  }

  /**
   * Create context channel for agent
   */
  createContextChannel(agentId) {
    const channel = {
      agentId: agentId,
      contexts: new Map(),
      subscribers: new Set(),
      createdAt: new Date()
    };
    
    this.channels.set(`context:${agentId}`, channel);
  }

  /**
   * Broadcast context to all agents
   */
  broadcastContext(contextMessage) {
    for (const [agentId, agent] of this.agents) {
      if (agent.status === 'active') {
        this.sendMessage(agent.sessionId, contextMessage);
      }
    }
  }

  /**
   * Broadcast agent update
   */
  broadcastAgentUpdate(agentId, action) {
    const updateMessage = {
      type: 'agent_update',
      data: {
        agentId: agentId,
        action: action,
        timestamp: new Date().toISOString()
      }
    };
    
    this.broadcastContext(updateMessage);
  }

  /**
   * Send message to session
   */
  sendMessage(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.ws) return;
    
    try {
      session.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`❌ Failed to send message to session ${sessionId}:`, error.message);
    }
  }

  /**
   * Send error message
   */
  sendError(sessionId, errorMessage) {
    const error = {
      type: 'error',
      data: {
        message: errorMessage,
        timestamp: new Date().toISOString()
      }
    };
    
    this.sendMessage(sessionId, error);
  }

  /**
   * Handle disconnection
   */
  handleDisconnection(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    console.log(`🔌 Session ${sessionId} disconnected`);
    
    // Cleanup agent if registered
    if (session.agentId) {
      const agent = this.agents.get(session.agentId);
      if (agent) {
        agent.status = 'disconnected';
        this.broadcastAgentUpdate(session.agentId, 'disconnected');
      }
    }
    
    // Remove session
    this.sessions.delete(sessionId);
  }

  /**
   * Start message processing
   */
  startMessageProcessing() {
    setInterval(() => {
      this.processMessageQueue();
    }, 100); // Process every 100ms
  }

  /**
   * Process message queue
   */
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.handleMessage(message.sessionId, Buffer.from(JSON.stringify(message.data)));
    }
  }

  /**
   * Utility methods
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  extractErrorType(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('firebase')) return 'firebase';
    if (lowerMessage.includes('network')) return 'network';
    if (lowerMessage.includes('syntax')) return 'syntax';
    if (lowerMessage.includes('typeerror')) return 'type';
    if (lowerMessage.includes('referenceerror')) return 'reference';
    return 'general';
  }

  calculateSeverity(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('critical') || lowerMessage.includes('fatal')) return 'critical';
    if (lowerMessage.includes('error')) return 'high';
    if (lowerMessage.includes('warning')) return 'medium';
    return 'low';
  }

  generateSuggestions(errorData) {
    return [
      'Check error logs for more details',
      'Verify input parameters',
      'Check network connectivity',
      'Review recent code changes'
    ];
  }

  generateFixesByType(errorType, context) {
    const fixes = {
      firebase: [
        'Check Firebase configuration',
        'Verify authentication credentials',
        'Review Firestore rules'
      ],
      network: [
        'Implement retry logic',
        'Check network connectivity',
        'Add timeout handling'
      ],
      syntax: [
        'Check code syntax',
        'Validate JSON format',
        'Review file encoding'
      ],
      type: [
        'Check variable types',
        'Add null checks',
        'Verify object properties'
      ],
      reference: [
        'Check variable declarations',
        'Verify import statements',
        'Review scope issues'
      ]
    };
    
    return fixes[errorType] || ['General debugging approach'];
  }

  /**
   * Execute Cursor CLI workspace analysis
   */
  async executeCursorAnalyzeWorkspace(args) {
    const { workspacePath, analysisType = 'structure' } = args;
    
    try {
      const { CursorCLIIntegration } = require('./cursorCLIIntegration');
      const cursorCLI = new CursorCLIIntegration();
      
      await cursorCLI.initialize();
      
      let result;
      switch (analysisType) {
        case 'structure':
          result = await cursorCLI.analyzeWorkspace();
          break;
        case 'patterns':
          result = await cursorCLI.analyzeCodePatterns();
          break;
        default:
          result = await cursorCLI.analyzeWorkspace();
      }
      
      return {
        analysisType,
        workspacePath,
        result,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Cursor workspace analysis failed: ${error.message}`);
    }
  }

  /**
   * Execute Gemini AI code analysis
   */
  async executeGeminiAnalyzeCode(args) {
    const { code, analysisType, context = {} } = args;
    
    try {
      const geminiAPIService = require('../client/src/services/GeminiAPIService').default;
      
      const prompt = `Analyze this ${analysisType} code for quality, security, and best practices:\n\n${code}`;
      const response = await geminiAPIService.generateContent(prompt);
      
      return {
        analysisType,
        code: code.substring(0, 100) + '...',
        analysis: response.text,
        confidence: 0.8,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Gemini code analysis failed: ${error.message}`);
    }
  }

  /**
   * Execute smart code search
   */
  async executeSmartSearchCode(args) {
    const { query, searchType = 'semantic', scope = {} } = args;
    
    try {
      const { CursorCLIIntegration } = require('./cursorCLIIntegration');
      const cursorCLI = new CursorCLIIntegration();
      
      await cursorCLI.initialize();
      const results = await cursorCLI.analyzeWorkspace();
      
      // Filter results based on query
      const filteredResults = results.files?.filter(file => 
        file.name.toLowerCase().includes(query.toLowerCase()) ||
        file.path.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      return {
        query,
        searchType,
        results: filteredResults,
        totalResults: filteredResults.length,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Smart code search failed: ${error.message}`);
    }
  }

  /**
   * Execute test data generation
   */
  async executeGenerateTestData(args) {
    const { dataType, count, schema = {}, format = 'json' } = args;
    
    try {
      const testData = this.generateTestDataByType(dataType, count, schema);
      
      return {
        dataType,
        count,
        schema,
        format,
        data: testData,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Test data generation failed: ${error.message}`);
    }
  }

  /**
   * Generate test data by type
   */
  generateTestDataByType(dataType, count, schema) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      let item;
      
      switch (dataType) {
        case 'user':
          item = {
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            age: Math.floor(Math.random() * 50) + 18,
            ...schema
          };
          break;
        case 'product':
          item = {
            id: i + 1,
            name: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 1000) + 10,
            category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
            ...schema
          };
          break;
        default:
          item = { id: i + 1, data: `Test data ${i + 1}`, ...schema };
      }
      
      data.push(item);
    }
    
    return data;
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      port: this.port,
      host: this.host,
      connectedAgents: this.agents.size,
      activeSessions: this.sessions.size,
      contexts: this.contexts.size,
      channels: this.channels.size
    };
  }

  /**
   * Stop the server
   */
  async stop() {
    try {
      console.log('🛑 Stopping MCP Server...');
      
      // Close all sessions
      for (const [sessionId, session] of this.sessions) {
        if (session.ws) {
          session.ws.close();
        }
      }
      
      // Close WebSocket server
      if (this.wss) {
        this.wss.close();
      }
      
      // Close HTTP server
      if (this.httpServer) {
        await new Promise((resolve) => {
          this.httpServer.close(resolve);
        });
      }
      
      this.isRunning = false;
      console.log('✅ MCP Server stopped');
      
    } catch (error) {
      console.error('❌ Error stopping MCP Server:', error.message);
    }
  }
}

module.exports = MCPServer;
