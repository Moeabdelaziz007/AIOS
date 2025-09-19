# AIOS Agents - Usage Examples

This document provides comprehensive examples of how to use the AIOS Agents system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Agent Creation](#basic-agent-creation)
3. [Advanced Agent Features](#advanced-agent-features)
4. [Security Integration](#security-integration)
5. [Agent Registry Usage](#agent-registry-usage)
6. [Monitoring and Metrics](#monitoring-and-metrics)
7. [Error Handling](#error-handling)
8. [Real-World Examples](#real-world-examples)

## Quick Start

```typescript
import { initializeAgentsSystem, createAgentRegistry, BasicAgent, type AgentConfig } from './index';

// Initialize the system
const system = await initializeAgentsSystem();

// Create a basic agent
const agentConfig: AgentConfig = {
  id: 'my-agent',
  role: 'processor',
  capabilities: ['data_processing'],
  permissions: ['read', 'write'],
  enableMetrics: true,
  enableAudit: true
};

const agent = new BasicAgent(agentConfig);
await agent.initialize();

// Register the agent
system.registry.register('my-agent', agent);

// Process a task
const result = await agent.processTask({
  id: 'task-1',
  type: 'process_data',
  payload: { data: 'Hello World' },
  priority: 'normal'
});

console.log('Task result:', result);
```

## Basic Agent Creation

### Creating a Custom Agent

```typescript
import { BaseAgent, type AgentConfig, type TaskRequest } from './index';

class DataProcessorAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  protected async onInitialize(): Promise<void> {
    this.logger.info('DataProcessorAgent initialized');
    this.addCapability('data_processing');
    this.addCapability('data_validation');
  }

  protected async executeTask(task: TaskRequest): Promise<any> {
    switch (task.type) {
      case 'process_data':
        return await this.processData(task.payload);
      case 'validate_data':
        return await this.validateData(task.payload);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async processData(payload: any): Promise<any> {
    // Your data processing logic here
    return {
      processed: true,
      data: payload.data.toUpperCase(),
      timestamp: new Date()
    };
  }

  private async validateData(payload: any): Promise<any> {
    // Your validation logic here
    return {
      valid: true,
      errors: []
    };
  }

  protected async onStop(): Promise<void> {
    this.logger.info('DataProcessorAgent stopped');
  }
}

// Usage
const agent = new DataProcessorAgent({
  id: 'data-processor',
  role: 'data_processor',
  capabilities: ['data_processing'],
  permissions: ['read', 'write']
});

await agent.initialize();
```

## Advanced Agent Features

### Using the Advanced Agent Template

```typescript
import { AdvancedAgent, type AdvancedAgentConfig } from './index';

class AdvancedDataAgent extends AdvancedAgent {
  constructor(config: AdvancedAgentConfig) {
    super({
      ...config,
      enableMetrics: true,
      enableCaching: true,
      enableRetry: true,
      maxRetries: 3,
      enableCircuitBreaker: true,
      circuitBreakerThreshold: 5,
      enableRateLimiting: true,
      rateLimit: 100,
      customFeatures: ['data_analysis', 'reporting']
    });
  }

  protected async executeTask(task: TaskRequest): Promise<any> {
    switch (task.type) {
      case 'analyze_data':
        return await this.analyzeData(task.payload);
      case 'generate_report':
        return await this.generateReport(task.payload);
      default:
        return await super.executeTask(task);
    }
  }

  private async analyzeData(payload: any): Promise<any> {
    // Complex data analysis with caching and retry logic
    return {
      analysis: 'completed',
      insights: ['insight1', 'insight2'],
      confidence: 0.95
    };
  }

  private async generateReport(payload: any): Promise<any> {
    // Report generation with metrics tracking
    return {
      report: 'generated',
      format: 'pdf',
      size: '2.5MB'
    };
  }
}

// Usage with advanced features
const advancedAgent = new AdvancedDataAgent({
  id: 'advanced-data-agent',
  role: 'data_analyst',
  capabilities: ['data_analysis', 'reporting'],
  permissions: ['read', 'write', 'admin']
});

await advancedAgent.initialize();
```

## Security Integration

### Authentication and Authorization

```typescript
import { createSecurityManager, createAuditService, createPolicyEngine } from './index';

// Initialize security services
const security = createSecurityManager({
  enableAudit: true,
  enableEncryption: true,
  sessionTimeout: 3600000,
  maxLoginAttempts: 5
});

const audit = createAuditService({
  enableAudit: true,
  logLevel: 'medium',
  retentionPeriod: 2592000000 // 30 days
});

const policy = createPolicyEngine({
  enablePolicyEngine: true,
  defaultEffect: 'deny',
  enableAudit: true
});

await security.initialize();
await audit.initialize();
await policy.initialize();

// Authenticate user
const authResult = await security.authenticate({
  username: 'user123',
  password: 'securePassword123'
});

if (authResult.success) {
  console.log('Authentication successful:', authResult.token);

  // Log authentication event
  await audit.logAuthEvent('user123', 'login', 'success', {
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...'
  });
} else {
  console.log('Authentication failed:', authResult.error);

  // Log failed authentication
  await audit.logAuthEvent('user123', 'login', 'failure', {
    error: authResult.error
  });
}

// Check permissions
const hasPermission = await security.checkPermission('user123', 'read_data', { resource: 'sensitive_data' });

console.log('Has permission:', hasPermission);
```

### Policy Management

```typescript
import { PolicyEngine, type PolicyRule } from './index';

const policyEngine = new PolicyEngine();

// Add a custom policy
const customPolicy: PolicyRule = {
  id: 'data_access_policy',
  name: 'Data Access Policy',
  description: 'Allow data access for specific users',
  enabled: true,
  priority: 50,
  conditions: [
    {
      type: 'equals',
      field: 'userId',
      value: 'data_analyst'
    },
    {
      type: 'in',
      field: 'resource',
      value: ['data_warehouse', 'analytics_db']
    }
  ],
  actions: [
    {
      type: 'log',
      parameters: {
        message: 'Data access granted'
      }
    }
  ],
  effect: 'allow',
  resource: 'data_warehouse',
  subject: 'data_analyst'
};

await policyEngine.addPolicy(customPolicy);

// Evaluate policy
const context = {
  userId: 'data_analyst',
  agentId: 'data-agent',
  resource: 'data_warehouse',
  action: 'read',
  timestamp: new Date()
};

const result = await policyEngine.evaluatePolicies(context);
console.log('Policy result:', result);
```

## Agent Registry Usage

### Managing Multiple Agents

```typescript
import { createAgentRegistry, BasicAgent, CommunicationAgent } from './index';

const registry = createAgentRegistry();

// Register different types of agents
const dataAgent = new BasicAgent({
  id: 'data-agent',
  role: 'data_processor',
  capabilities: ['data_processing']
});

const commAgent = new CommunicationAgent({
  id: 'comm-agent',
  role: 'communication',
  capabilities: ['send_message', 'receive_message'],
  supportedChannels: ['email', 'sms', 'push'],
  maxMessageLength: 1000,
  enableEncryption: true
});

// Register agents
await registry.register('data-agent', dataAgent);
await registry.register('comm-agent', commAgent);

// Initialize all agents
await registry.initializeAllAgents();

// Get agent by ID
const agent = registry.getAgent('data-agent');
if (agent) {
  const result = await agent.processTask({
    id: 'task-1',
    type: 'process',
    payload: { data: 'test' },
    priority: 'normal'
  });
}

// Get agents by capability
const dataAgents = registry.getAgentsWithCapability('data_processing');
console.log('Data processing agents:', dataAgents.length);

// Get registry statistics
const stats = registry.getStats();
console.log('Registry stats:', stats);

// Health check
const health = await registry.healthCheck();
console.log('Health status:', health);
```

## Monitoring and Metrics

### Metrics Collection

```typescript
import { createMetricsCollector, type PerformanceMetrics } from './index';

const metrics = createMetricsCollector({
  collectionInterval: 5000,
  retentionPeriod: 3600000,
  enableRealTime: true
});

await metrics.start('my-agent');

// Record custom metrics
metrics.recordMetric('processing_time', 150);
metrics.recordMetric('data_processed', 1000);
metrics.recordMetric('errors_count', 2);

// Record performance metrics
const perfMetrics: PerformanceMetrics = {
  responseTime: 150,
  throughput: 100,
  errorRate: 0.02,
  successRate: 0.98,
  activeConnections: 5
};

metrics.recordPerformanceMetrics(perfMetrics);

// Get metrics summary
const summary = metrics.getMetricsSummary();
console.log('Metrics summary:', summary);

// Get aggregated metrics
const avgProcessingTime = metrics.getAggregatedMetrics('processing_time', 'avg');
const totalDataProcessed = metrics.getAggregatedMetrics('data_processed', 'sum');

console.log('Average processing time:', avgProcessingTime);
console.log('Total data processed:', totalDataProcessed);

// Export metrics
const jsonMetrics = metrics.exportMetrics('json');
const csvMetrics = metrics.exportMetrics('csv');
```

### Error Handling and Recovery

```typescript
import { createErrorHandler, ErrorCategory, ErrorSeverity } from './index';

const errorHandler = new ErrorHandler();

// Add custom recovery strategy
errorHandler.addRecoveryStrategy(ErrorCategory.NETWORK, {
  name: 'retry_with_exponential_backoff',
  description: 'Retry network operations with exponential backoff',
  canRecover: (error, context) => {
    return error.message.includes('timeout') || error.message.includes('connection');
  },
  recover: async (error, context) => {
    const delay = Math.pow(2, context.retryCount || 0) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    return { retry: true, delay };
  }
});

// Handle errors
try {
  // Some operation that might fail
  await riskyOperation();
} catch (error) {
  const result = await errorHandler.handleError(error, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, {
    operationId: 'network-call-1',
    retryCount: 0
  });

  if (result.success) {
    console.log('Error recovered:', result.recovered);
  } else {
    console.log('Error not recoverable:', result.error);
  }
}

// Get error statistics
const errorStats = errorHandler.getErrorStats();
console.log('Error statistics:', errorStats);

// Get recent errors
const recentErrors = errorHandler.getRecentErrors(10);
console.log('Recent errors:', recentErrors);
```

## Real-World Examples

### E-commerce Order Processing Agent

```typescript
import { BaseAgent, type AgentConfig, type TaskRequest } from './index';

class OrderProcessingAgent extends BaseAgent {
  private orderQueue: any[] = [];
  private processedOrders: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    super({
      ...config,
      capabilities: ['order_processing', 'payment_validation', 'inventory_check'],
      permissions: ['read_orders', 'write_orders', 'update_inventory']
    });
  }

  protected async onInitialize(): Promise<void> {
    this.logger.info('OrderProcessingAgent initialized');
    this.addCapability('order_processing');
  }

  protected async executeTask(task: TaskRequest): Promise<any> {
    switch (task.type) {
      case 'process_order':
        return await this.processOrder(task.payload);
      case 'validate_payment':
        return await this.validatePayment(task.payload);
      case 'check_inventory':
        return await this.checkInventory(task.payload);
      case 'update_order_status':
        return await this.updateOrderStatus(task.payload);
      default:
        throw new Error(`Unknown order task type: ${task.type}`);
    }
  }

  private async processOrder(payload: any): Promise<any> {
    const { orderId, customerId, items, paymentInfo } = payload;

    try {
      // Validate payment
      const paymentResult = await this.validatePayment(paymentInfo);
      if (!paymentResult.valid) {
        throw new Error('Payment validation failed');
      }

      // Check inventory
      const inventoryResult = await this.checkInventory(items);
      if (!inventoryResult.available) {
        throw new Error('Insufficient inventory');
      }

      // Process order
      const order = {
        orderId,
        customerId,
        items,
        status: 'processing',
        createdAt: new Date(),
        totalAmount: this.calculateTotal(items)
      };

      this.processedOrders.set(orderId, order);
      this.orderQueue.push(order);

      this.logger.info(`Order ${orderId} processed successfully`);

      return {
        success: true,
        orderId,
        status: 'processing',
        estimatedDelivery: this.calculateDeliveryDate()
      };
    } catch (error) {
      this.logger.error(`Order processing failed for ${orderId}`, error);
      throw error;
    }
  }

  private async validatePayment(paymentInfo: any): Promise<any> {
    // Simulate payment validation
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      valid: true,
      transactionId: `txn_${Date.now()}`,
      amount: paymentInfo.amount
    };
  }

  private async checkInventory(items: any[]): Promise<any> {
    // Simulate inventory check
    await new Promise(resolve => setTimeout(resolve, 50));

    return {
      available: true,
      items: items.map(item => ({
        ...item,
        available: true,
        quantity: 10
      }))
    };
  }

  private async updateOrderStatus(payload: any): Promise<any> {
    const { orderId, status } = payload;
    const order = this.processedOrders.get(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.status = status;
    order.updatedAt = new Date();

    this.logger.info(`Order ${orderId} status updated to ${status}`);

    return {
      success: true,
      orderId,
      status,
      updatedAt: order.updatedAt
    };
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private calculateDeliveryDate(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery
    return deliveryDate;
  }

  // Get order statistics
  getOrderStats(): any {
    return {
      totalOrders: this.processedOrders.size,
      ordersInQueue: this.orderQueue.length,
      ordersByStatus: this.getOrdersByStatus()
    };
  }

  private getOrdersByStatus(): Record<string, number> {
    const statusCounts: Record<string, number> = {};

    for (const order of this.processedOrders.values()) {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    }

    return statusCounts;
  }
}

// Usage
const orderAgent = new OrderProcessingAgent({
  id: 'order-processor',
  role: 'order_processor',
  capabilities: ['order_processing'],
  permissions: ['read_orders', 'write_orders']
});

await orderAgent.initialize();

// Process an order
const result = await orderAgent.processTask({
  id: 'order-task-1',
  type: 'process_order',
  payload: {
    orderId: 'ORD-001',
    customerId: 'CUST-123',
    items: [
      { productId: 'PROD-001', quantity: 2, price: 29.99 },
      { productId: 'PROD-002', quantity: 1, price: 49.99 }
    ],
    paymentInfo: {
      method: 'credit_card',
      amount: 109.97,
      cardNumber: '****1234'
    }
  },
  priority: 'high'
});

console.log('Order processing result:', result);
```

### IoT Device Management Agent

```typescript
import { BaseAgent, type AgentConfig, type TaskRequest } from './index';

class IoTDeviceAgent extends BaseAgent {
  private devices: Map<string, any> = new Map();
  private deviceStatus: Map<string, string> = new Map();
  private deviceMetrics: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    super({
      ...config,
      capabilities: ['device_management', 'data_collection', 'remote_control'],
      permissions: ['read_devices', 'write_devices', 'control_devices']
    });
  }

  protected async onInitialize(): Promise<void> {
    this.logger.info('IoTDeviceAgent initialized');
    this.addCapability('device_management');
  }

  protected async executeTask(task: TaskRequest): Promise<any> {
    switch (task.type) {
      case 'register_device':
        return await this.registerDevice(task.payload);
      case 'collect_data':
        return await this.collectData(task.payload);
      case 'control_device':
        return await this.controlDevice(task.payload);
      case 'get_device_status':
        return await this.getDeviceStatus(task.payload);
      case 'update_device_config':
        return await this.updateDeviceConfig(task.payload);
      default:
        throw new Error(`Unknown IoT task type: ${task.type}`);
    }
  }

  private async registerDevice(payload: any): Promise<any> {
    const { deviceId, deviceType, location, capabilities } = payload;

    const device = {
      deviceId,
      deviceType,
      location,
      capabilities,
      registeredAt: new Date(),
      status: 'offline',
      lastSeen: new Date()
    };

    this.devices.set(deviceId, device);
    this.deviceStatus.set(deviceId, 'offline');

    this.logger.info(`Device ${deviceId} registered successfully`);

    return {
      success: true,
      deviceId,
      status: 'registered',
      registeredAt: device.registeredAt
    };
  }

  private async collectData(payload: any): Promise<any> {
    const { deviceId, dataType, timeRange } = payload;

    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    // Simulate data collection
    const data = this.generateMockData(deviceId, dataType, timeRange);

    // Store metrics
    this.deviceMetrics.set(deviceId, {
      lastDataCollection: new Date(),
      dataPoints: data.length,
      dataType
    });

    this.logger.info(`Collected ${data.length} data points from device ${deviceId}`);

    return {
      success: true,
      deviceId,
      dataType,
      dataPoints: data.length,
      data,
      collectedAt: new Date()
    };
  }

  private async controlDevice(payload: any): Promise<any> {
    const { deviceId, command, parameters } = payload;

    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    // Simulate device control
    const result = await this.sendCommandToDevice(deviceId, command, parameters);

    this.logger.info(`Command ${command} sent to device ${deviceId}`);

    return {
      success: true,
      deviceId,
      command,
      result,
      executedAt: new Date()
    };
  }

  private async getDeviceStatus(payload: any): Promise<any> {
    const { deviceId } = payload;

    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    const status = this.deviceStatus.get(deviceId) || 'unknown';
    const metrics = this.deviceMetrics.get(deviceId);

    return {
      deviceId,
      status,
      lastSeen: device.lastSeen,
      metrics,
      uptime: this.calculateUptime(deviceId)
    };
  }

  private async updateDeviceConfig(payload: any): Promise<any> {
    const { deviceId, config } = payload;

    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    // Update device configuration
    device.config = { ...device.config, ...config };
    device.updatedAt = new Date();

    this.logger.info(`Configuration updated for device ${deviceId}`);

    return {
      success: true,
      deviceId,
      config: device.config,
      updatedAt: device.updatedAt
    };
  }

  private generateMockData(deviceId: string, dataType: string, timeRange: any): any[] {
    const data = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - (timeRange?.hours || 1) * 60 * 60 * 1000);

    for (let i = 0; i < 10; i++) {
      data.push({
        timestamp: new Date(startTime.getTime() + i * 6 * 60 * 1000), // Every 6 minutes
        value: Math.random() * 100,
        unit: this.getDataUnit(dataType)
      });
    }

    return data;
  }

  private getDataUnit(dataType: string): string {
    const units: Record<string, string> = {
      temperature: '°C',
      humidity: '%',
      pressure: 'hPa',
      light: 'lux',
      motion: 'boolean'
    };
    return units[dataType] || 'unit';
  }

  private async sendCommandToDevice(deviceId: string, command: string, parameters: any): Promise<any> {
    // Simulate sending command to device
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      command,
      parameters,
      response: 'command_executed',
      timestamp: new Date()
    };
  }

  private calculateUptime(deviceId: string): number {
    const device = this.devices.get(deviceId);
    if (!device) return 0;

    const now = new Date();
    return now.getTime() - device.registeredAt.getTime();
  }

  // Get device statistics
  getDeviceStats(): any {
    const devices = Array.from(this.devices.values());

    return {
      totalDevices: devices.length,
      onlineDevices: Array.from(this.deviceStatus.values()).filter(status => status === 'online').length,
      offlineDevices: Array.from(this.deviceStatus.values()).filter(status => status === 'offline').length,
      devicesByType: this.getDevicesByType(),
      averageUptime: this.getAverageUptime()
    };
  }

  private getDevicesByType(): Record<string, number> {
    const typeCounts: Record<string, number> = {};

    for (const device of this.devices.values()) {
      typeCounts[device.deviceType] = (typeCounts[device.deviceType] || 0) + 1;
    }

    return typeCounts;
  }

  private getAverageUptime(): number {
    const devices = Array.from(this.devices.values());
    if (devices.length === 0) return 0;

    const totalUptime = devices.reduce((sum, device) => {
      return sum + this.calculateUptime(device.deviceId);
    }, 0);

    return totalUptime / devices.length;
  }
}

// Usage
const iotAgent = new IoTDeviceAgent({
  id: 'iot-manager',
  role: 'iot_manager',
  capabilities: ['device_management'],
  permissions: ['read_devices', 'write_devices']
});

await iotAgent.initialize();

// Register a device
const registerResult = await iotAgent.processTask({
  id: 'register-task-1',
  type: 'register_device',
  payload: {
    deviceId: 'SENSOR-001',
    deviceType: 'temperature_sensor',
    location: 'Building A, Floor 1',
    capabilities: ['temperature_reading', 'humidity_reading']
  },
  priority: 'normal'
});

console.log('Device registration result:', registerResult);

// Collect data from device
const dataResult = await iotAgent.processTask({
  id: 'data-task-1',
  type: 'collect_data',
  payload: {
    deviceId: 'SENSOR-001',
    dataType: 'temperature',
    timeRange: { hours: 1 }
  },
  priority: 'normal'
});

console.log('Data collection result:', dataResult);
```

This comprehensive guide provides examples for all major features of the AIOS Agents system, from basic usage to advanced real-world scenarios. Each example demonstrates best practices and proper error handling.
