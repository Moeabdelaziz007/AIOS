/**
 * 🔗 Quantum Integration API - واجهة برمجة التطبيقات للتكامل الكمي
 *
 * واجهة REST API للتكامل بين محرك المكافآت الكمي ونظام AIOS
 */

const express = require('express');
const cors = require('cors');
const QuantumAIOSAgent = require('./quantumAIOSAgent');

class QuantumIntegrationAPI {
  constructor(config = {}) {
    this.app = express();
    this.port = config.port || 3002;
    this.quantumAgents = new Map();

    // إعداد middleware
    this.setupMiddleware();

    // إعداد routes
    this.setupRoutes();

    console.log('🔗 Quantum Integration API initialized');
  }

  /**
   * إعداد middleware
   */
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Middleware للتسجيل
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * إعداد routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        activeAgents: this.quantumAgents.size
      });
    });

    // إنشاء وكيل كمي جديد
    this.app.post('/agents', async (req, res) => {
      try {
        const config = req.body;
        const agent = new QuantumAIOSAgent(config);

        const initialized = await agent.initialize();
        if (!initialized) {
          return res.status(500).json({
            error: 'Failed to initialize quantum agent'
          });
        }

        this.quantumAgents.set(agent.agentId, agent);

        res.json({
          success: true,
          agentId: agent.agentId,
          status: agent.getStatus()
        });
      } catch (error) {
        console.error('Error creating quantum agent:', error);
        res.status(500).json({
          error: error.message
        });
      }
    });

    // الحصول على قائمة الوكلاء
    this.app.get('/agents', (req, res) => {
      const agents = Array.from(this.quantumAgents.values()).map(agent => agent.getStatus());

      res.json({
        success: true,
        agents: agents,
        total: agents.length
      });
    });

    // الحصول على حالة وكيل محدد
    this.app.get('/agents/:agentId', (req, res) => {
      const agentId = req.params.agentId;
      const agent = this.quantumAgents.get(agentId);

      if (!agent) {
        return res.status(404).json({
          error: 'Agent not found'
        });
      }

      res.json({
        success: true,
        status: agent.getStatus()
      });
    });

    // معالجة إشارة كميّة
    this.app.post('/agents/:agentId/process-signal', async (req, res) => {
      try {
        const agentId = req.params.agentId;
        const agent = this.quantumAgents.get(agentId);

        if (!agent) {
          return res.status(404).json({
            error: 'Agent not found'
          });
        }

        const marketData = req.body;
        const result = await agent.processQuantumSignal(marketData);

        res.json({
          success: true,
          result: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error processing quantum signal:', error);
        res.status(500).json({
          error: error.message
        });
      }
    });

    // حساب المكافأة
    this.app.post('/agents/:agentId/calculate-reward', async (req, res) => {
      try {
        const agentId = req.params.agentId;
        const agent = this.quantumAgents.get(agentId);

        if (!agent) {
          return res.status(404).json({
            error: 'Agent not found'
          });
        }

        const performanceData = req.body;
        const reward = await agent.calculateReward(performanceData);

        res.json({
          success: true,
          reward: reward,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error calculating reward:', error);
        res.status(500).json({
          error: error.message
        });
      }
    });

    // الحصول على مقاييس الأداء
    this.app.get('/agents/:agentId/performance', (req, res) => {
      const agentId = req.params.agentId;
      const agent = this.quantumAgents.get(agentId);

      if (!agent) {
        return res.status(404).json({
          error: 'Agent not found'
        });
      }

      res.json({
        success: true,
        performance: agent.performanceMetrics,
        timestamp: new Date().toISOString()
      });
    });

    // إيقاف وكيل
    this.app.delete('/agents/:agentId', async (req, res) => {
      try {
        const agentId = req.params.agentId;
        const agent = this.quantumAgents.get(agentId);

        if (!agent) {
          return res.status(404).json({
            error: 'Agent not found'
          });
        }

        await agent.shutdown();
        this.quantumAgents.delete(agentId);

        res.json({
          success: true,
          message: 'Agent stopped successfully'
        });
      } catch (error) {
        console.error('Error stopping agent:', error);
        res.status(500).json({
          error: error.message
        });
      }
    });

    // إيقاف جميع الوكلاء
    this.app.delete('/agents', async (req, res) => {
      try {
        const stopPromises = Array.from(this.quantumAgents.values()).map(agent => agent.shutdown());

        await Promise.all(stopPromises);
        this.quantumAgents.clear();

        res.json({
          success: true,
          message: 'All agents stopped successfully'
        });
      } catch (error) {
        console.error('Error stopping all agents:', error);
        res.status(500).json({
          error: error.message
        });
      }
    });

    // WebSocket endpoint للتحديثات في الوقت الفعلي
    this.app.get('/ws', (req, res) => {
      // سيتم إضافة WebSocket support لاحقاً
      res.json({
        message: 'WebSocket endpoint - coming soon'
      });
    });

    // Error handler
    this.app.use((error, req, res, next) => {
      console.error('API Error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Endpoint not found'
      });
    });
  }

  /**
   * بدء تشغيل API
   */
  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 Quantum Integration API running on port ${this.port}`);
      console.log(`📡 Health check: http://localhost:${this.port}/health`);
      console.log(`📚 API Documentation: http://localhost:${this.port}/docs`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  /**
   * إيقاف API
   */
  async shutdown() {
    console.log('🛑 Shutting down Quantum Integration API...');

    // إيقاف جميع الوكلاء
    const stopPromises = Array.from(this.quantumAgents.values()).map(agent => agent.shutdown());

    await Promise.all(stopPromises);

    // إيقاف الخادم
    if (this.server) {
      this.server.close(() => {
        console.log('✅ Quantum Integration API shut down successfully');
      });
    }
  }

  /**
   * الحصول على إحصائيات API
   */
  getStats() {
    return {
      activeAgents: this.quantumAgents.size,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = QuantumIntegrationAPI;

// تشغيل API إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const api = new QuantumIntegrationAPI();
  api.start();
}
