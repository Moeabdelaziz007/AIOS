/**
 * 🔍 Agent Auto-Discovery System
 *
 * Automatically discovers and registers agents from configs directory
 * with dynamic loading and hot-reload capabilities
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class AgentAutoDiscovery extends EventEmitter {
  constructor() {
    super();
    this.name = 'Agent Auto-Discovery';
    this.version = '1.0.0';
    this.isActive = false;

    // Discovery configuration
    this.config = {
      configsDir: path.join(__dirname, '../agents/configs'),
      scanInterval: 30000, // 30 seconds
      hotReload: true,
      validateConfigs: true,
      autoRegister: true,
    };

    // Discovered agents
    this.discoveredAgents = new Map();
    this.agentRegistry = new Map();
    this.configWatchers = new Map();

    // Agent metadata
    this.agentMetadata = new Map();
    this.dependencyGraph = new Map();
  }

  /**
   * Initialize auto-discovery system
   */
  async initialize() {
    try {
      // Create configs directory if it doesn't exist
      await this.createConfigsDirectory();

      // Initial scan
      await this.performInitialScan();

      // Setup file watching
      if (this.config.hotReload) {
        await this.setupFileWatching();
      }

      // Setup periodic scanning
      this.setupPeriodicScanning();

      // Setup dependency resolution
      this.setupDependencyResolution();

      this.isActive = true;

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Agent Auto-Discovery:', error);
      return false;
    }
  }

  /**
   * Create configs directory
   */
  async createConfigsDirectory() {
    try {
      await fs.mkdir(this.config.configsDir, { recursive: true });

      // Create sample agent configs if directory is empty
      const files = await fs.readdir(this.config.configsDir);
      if (files.length === 0) {
        await this.createSampleConfigs();
      }
    } catch (error) {
      console.error('❌ Failed to create configs directory:', error);
      throw error;
    }
  }

  /**
   * Create sample agent configs
   */
  async createSampleConfigs() {
    const sampleConfigs = [
      {
        filename: 'smart_agent.json',
        config: {
          name: 'Smart Agent',
          type: 'ai_assistant',
          version: '1.0.0',
          description: 'AI-powered assistant with advanced capabilities',
          capabilities: [
            'chat',
            'analysis',
            'recommendations',
            'code_generation',
          ],
          dependencies: [],
          endpoints: {
            chat: '/api/chat',
            analyze: '/api/analyze',
            recommend: '/api/recommend',
          },
          settings: {
            model: 'gemini-pro',
            temperature: 0.7,
            maxTokens: 2048,
          },
          healthCheck: {
            endpoint: '/health',
            interval: 30000,
          },
          metrics: {
            enabled: true,
            interval: 60000,
          },
        },
      },
      {
        filename: 'data_agent.json',
        config: {
          name: 'Data Agent',
          type: 'data_processor',
          version: '1.0.0',
          description: 'Data collection and analytics agent',
          capabilities: [
            'data_collection',
            'analytics',
            'reporting',
            'visualization',
          ],
          dependencies: ['smart_agent'],
          endpoints: {
            collect: '/api/data/collect',
            analyze: '/api/data/analyze',
            report: '/api/data/report',
          },
          settings: {
            batchSize: 1000,
            retentionDays: 30,
            compressionEnabled: true,
          },
          healthCheck: {
            endpoint: '/health',
            interval: 30000,
          },
          metrics: {
            enabled: true,
            interval: 60000,
          },
        },
      },
      {
        filename: 'debug_agent.json',
        config: {
          name: 'Debug Agent',
          type: 'monitoring',
          version: '1.0.0',
          description: 'System monitoring and error handling agent',
          capabilities: [
            'monitoring',
            'debugging',
            'error_handling',
            'alerting',
          ],
          dependencies: [],
          endpoints: {
            monitor: '/api/monitor',
            debug: '/api/debug',
            alert: '/api/alert',
          },
          settings: {
            logLevel: 'info',
            alertThreshold: 0.8,
            autoFixEnabled: true,
          },
          healthCheck: {
            endpoint: '/health',
            interval: 15000,
          },
          metrics: {
            enabled: true,
            interval: 30000,
          },
        },
      },
      {
        filename: 'learning_agent.json',
        config: {
          name: 'Learning Agent',
          type: 'learning',
          version: '1.0.0',
          description: 'Pattern recognition and system learning agent',
          capabilities: [
            'pattern_recognition',
            'learning',
            'optimization',
            'prediction',
          ],
          dependencies: ['data_agent', 'smart_agent'],
          endpoints: {
            learn: '/api/learn',
            predict: '/api/predict',
            optimize: '/api/optimize',
          },
          settings: {
            learningRate: 0.01,
            batchSize: 32,
            epochs: 100,
          },
          healthCheck: {
            endpoint: '/health',
            interval: 30000,
          },
          metrics: {
            enabled: true,
            interval: 60000,
          },
        },
      },
    ];

    for (const { filename, config } of sampleConfigs) {
      const configPath = path.join(this.config.configsDir, filename);
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    }
  }

  /**
   * Perform initial scan
   */
  async performInitialScan() {
    try {
      const files = await fs.readdir(this.config.configsDir);
      const configFiles = files.filter(file => file.endsWith('.json'));

      for (const configFile of configFiles) {
        await this.processConfigFile(configFile);
      }

      console.log(
        `✅ Initial scan completed: ${this.discoveredAgents.size} agents discovered`
      );
    } catch (error) {
      console.error('❌ Error in initial scan:', error);
    }
  }

  /**
   * Process config file
   */
  async processConfigFile(filename) {
    try {
      const configPath = path.join(this.config.configsDir, filename);
      const configData = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configData);

      const agentId = filename.replace('.json', '');

      // Validate config
      if (this.config.validateConfigs) {
        const validation = this.validateAgentConfig(config);
        if (!validation.valid) {
          console.error(`❌ Invalid config for ${agentId}:`, validation.errors);
          return;
        }
      }

      // Create agent metadata
      const agentMetadata = {
        id: agentId,
        filename: filename,
        configPath: configPath,
        config: config,
        discoveredAt: new Date(),
        lastModified: await this.getFileModificationTime(configPath),
        status: 'discovered',
        dependencies: config.dependencies || [],
        capabilities: config.capabilities || [],
        endpoints: config.endpoints || {},
        settings: config.settings || {},
      };

      // Store agent metadata
      this.discoveredAgents.set(agentId, agentMetadata);
      this.agentMetadata.set(agentId, agentMetadata);

      // Update dependency graph
      this.updateDependencyGraph(agentId, config.dependencies || []);

      // Auto-register if enabled
      if (this.config.autoRegister) {
        await this.registerAgent(agentId, agentMetadata);
      }

      // Emit discovery event
      this.emit('agent_discovered', agentId, agentMetadata);
    } catch (error) {
      console.error(`❌ Error processing config file ${filename}:`, error);
    }
  }

  /**
   * Validate agent config
   */
  validateAgentConfig(config) {
    const errors = [];
    const required = ['name', 'type', 'version', 'description'];

    for (const field of required) {
      if (!config[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate capabilities
    if (config.capabilities && !Array.isArray(config.capabilities)) {
      errors.push('Capabilities must be an array');
    }

    // Validate dependencies
    if (config.dependencies && !Array.isArray(config.dependencies)) {
      errors.push('Dependencies must be an array');
    }

    // Validate endpoints
    if (config.endpoints && typeof config.endpoints !== 'object') {
      errors.push('Endpoints must be an object');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Get file modification time
   */
  async getFileModificationTime(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.mtime;
    } catch (error) {
      return new Date();
    }
  }

  /**
   * Update dependency graph
   */
  updateDependencyGraph(agentId, dependencies) {
    this.dependencyGraph.set(agentId, dependencies);

    // Create reverse dependencies
    for (const dependency of dependencies) {
      if (!this.dependencyGraph.has(dependency)) {
        this.dependencyGraph.set(dependency, []);
      }
    }
  }

  /**
   * Register agent
   */
  async registerAgent(agentId, metadata) {
    try {
      const agentInfo = {
        id: agentId,
        name: metadata.config.name,
        type: metadata.config.type,
        version: metadata.config.version,
        description: metadata.config.description,
        capabilities: metadata.capabilities,
        dependencies: metadata.dependencies,
        endpoints: metadata.endpoints,
        settings: metadata.settings,
        status: 'registered',
        registeredAt: new Date(),
        metadata: metadata,
      };

      this.agentRegistry.set(agentId, agentInfo);

      // Emit registration event
      this.emit('agent_registered', agentId, agentInfo);
    } catch (error) {
      console.error(`❌ Error registering agent ${agentId}:`, error);
    }
  }

  /**
   * Setup file watching
   */
  async setupFileWatching() {
    try {
      // Watch configs directory
      const watcher = fs.watch(this.config.configsDir, { recursive: false });

      if (watcher && typeof watcher.on === 'function') {
        watcher.on('change', async (eventType, filename) => {
          if (filename && filename.endsWith('.json')) {
            await this.handleConfigChange(eventType, filename);
          }
        });

        this.configWatchers.set('configs', watcher);
      } else {
        console.log(
          'File watching not available, using periodic scanning only'
        );
      }
    } catch (error) {
      console.error('Error setting up file watching:', error);
    }
  }

  /**
   * Handle config change
   */
  async handleConfigChange(eventType, filename) {
    try {
      const agentId = filename.replace('.json', '');

      if (eventType === 'rename' || eventType === 'change') {
        // Re-process the config file
        await this.processConfigFile(filename);

        // Update registry if agent was already registered
        if (this.agentRegistry.has(agentId)) {
          const metadata = this.discoveredAgents.get(agentId);
          if (metadata) {
            await this.registerAgent(agentId, metadata);
          }
        }

        // Emit update event
        this.emit('agent_updated', agentId, metadata);
      }
    } catch (error) {
      console.error(`❌ Error handling config change for ${filename}:`, error);
    }
  }

  /**
   * Setup periodic scanning
   */
  setupPeriodicScanning() {
    setInterval(async () => {
      await this.performPeriodicScan();
    }, this.config.scanInterval);
  }

  /**
   * Perform periodic scan
   */
  async performPeriodicScan() {
    try {
      const files = await fs.readdir(this.config.configsDir);
      const configFiles = files.filter(file => file.endsWith('.json'));

      // Check for new files
      for (const configFile of configFiles) {
        const agentId = configFile.replace('.json', '');

        if (!this.discoveredAgents.has(agentId)) {
          await this.processConfigFile(configFile);
        }
      }

      // Check for removed files
      for (const [agentId, metadata] of this.discoveredAgents) {
        const configPath = path.join(this.config.configsDir, metadata.filename);

        try {
          await fs.access(configPath);
        } catch (error) {
          await this.unregisterAgent(agentId);
        }
      }
    } catch (error) {
      console.error('❌ Error in periodic scan:', error);
    }
  }

  /**
   * Unregister agent
   */
  async unregisterAgent(agentId) {
    try {
      this.discoveredAgents.delete(agentId);
      this.agentRegistry.delete(agentId);
      this.agentMetadata.delete(agentId);
      this.dependencyGraph.delete(agentId);

      // Emit unregistration event
      this.emit('agent_unregistered', agentId);
    } catch (error) {
      console.error(`❌ Error unregistering agent ${agentId}:`, error);
    }
  }

  /**
   * Setup dependency resolution
   */
  setupDependencyResolution() {
    // This would implement dependency resolution logic
    // For now, we'll just track dependencies
  }

  /**
   * Get discovered agents
   */
  getDiscoveredAgents() {
    return Array.from(this.discoveredAgents.values());
  }

  /**
   * Get registered agents
   */
  getRegisteredAgents() {
    return Array.from(this.agentRegistry.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId) {
    return (
      this.agentRegistry.get(agentId) || this.discoveredAgents.get(agentId)
    );
  }

  /**
   * Get agent dependencies
   */
  getAgentDependencies(agentId) {
    return this.dependencyGraph.get(agentId) || [];
  }

  /**
   * Get agents by type
   */
  getAgentsByType(type) {
    return Array.from(this.agentRegistry.values()).filter(
      agent => agent.type === type
    );
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    return Array.from(this.agentRegistry.values()).filter(
      agent => agent.capabilities && agent.capabilities.includes(capability)
    );
  }

  /**
   * Resolve dependencies
   */
  resolveDependencies(agentId) {
    const resolved = new Set();
    const unresolved = new Set();

    const resolve = id => {
      if (resolved.has(id)) return;
      if (unresolved.has(id)) {
        throw new Error(`Circular dependency detected: ${id}`);
      }

      unresolved.add(id);

      const dependencies = this.getAgentDependencies(id);
      for (const dep of dependencies) {
        resolve(dep);
      }

      unresolved.delete(id);
      resolved.add(id);
    };

    resolve(agentId);
    return Array.from(resolved);
  }

  /**
   * Generate discovery report
   */
  generateDiscoveryReport() {
    const report = {
      timestamp: new Date(),
      totalDiscovered: this.discoveredAgents.size,
      totalRegistered: this.agentRegistry.size,
      agents: Array.from(this.agentRegistry.values()).map(agent => ({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        version: agent.version,
        status: agent.status,
        capabilities: agent.capabilities,
        dependencies: agent.dependencies,
        registeredAt: agent.registeredAt,
      })),
      dependencyGraph: Object.fromEntries(this.dependencyGraph),
      configs: {
        scanInterval: this.config.scanInterval,
        hotReload: this.config.hotReload,
        validateConfigs: this.config.validateConfigs,
        autoRegister: this.config.autoRegister,
      },
    };

    return report;
  }

  /**
   * Export agent registry
   */
  async exportAgentRegistry() {
    try {
      const registryData = {
        timestamp: new Date(),
        agents: Array.from(this.agentRegistry.entries()),
        metadata: Array.from(this.agentMetadata.entries()),
        dependencyGraph: Object.fromEntries(this.dependencyGraph),
      };

      const exportPath = path.join(__dirname, '../exports/agent_registry.json');
      await fs.mkdir(path.dirname(exportPath), { recursive: true });
      await fs.writeFile(exportPath, JSON.stringify(registryData, null, 2));

      return exportPath;
    } catch (error) {
      console.error('Error exporting agent registry:', error);
      throw error;
    }
  }

  /**
   * Shutdown auto-discovery
   */
  async shutdown() {
    try {
      this.isActive = false;

      // Close file watchers
      for (const [name, watcher] of this.configWatchers) {
        await watcher.close();
      }

      // Export final registry
      await this.exportAgentRegistry();
    } catch (error) {
      console.error('Error shutting down auto-discovery:', error);
    }
  }
}

module.exports = AgentAutoDiscovery;
