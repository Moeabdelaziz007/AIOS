/**
 * CommunicationAgent.ts
 *
 * Example implementation of a communication agent using the high-quality architecture.
 * Demonstrates real-world usage of the BaseAgent class and related utilities.
 */

import { AgentConfig, BaseAgent, TaskRequest } from '../core/BaseAgent';
import { Logger } from '../utils/Logger';

export interface CommunicationAgentConfig extends AgentConfig {
  // Communication-specific configuration
  supportedChannels: string[];
  maxMessageLength: number;
  enableEncryption: boolean;
  enableMessageHistory: boolean;
  maxHistorySize: number;
  responseTimeout: number;
}

export interface Message {
  id: string;
  channel: string;
  sender: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  metadata?: any;
}

export interface CommunicationTask extends TaskRequest {
  type: 'send_message' | 'receive_message' | 'broadcast_message' | 'get_history' | 'encrypt_message';
  payload: {
    channel?: string;
    message?: string;
    recipient?: string;
    sender?: string;
    content?: string;
    metadata?: any;
  };
}

export class CommunicationAgent extends BaseAgent {
  private readonly logger: Logger;
  private config: CommunicationAgentConfig;
  private messageHistory: Map<string, Message[]> = new Map();
  private activeChannels: Set<string> = new Set();
  private encryptionKey?: string;

  constructor(config: CommunicationAgentConfig) {
    super(config);
    this.config = config;
    this.logger = new Logger(`CommunicationAgent:${config.id}`);
  }

  /**
   * Initialize the communication agent
   */
  protected async onInitialize(): Promise<void> {
    this.logger.info('Initializing CommunicationAgent');

    try {
      // Initialize encryption if enabled
      if (this.config.enableEncryption) {
        await this.initializeEncryption();
      }

      // Initialize supported channels
      this.config.supportedChannels.forEach(channel => {
        this.activeChannels.add(channel);
        this.messageHistory.set(channel, []);
      });

      // Add communication capabilities
      this.addCapability('send_message');
      this.addCapability('receive_message');
      this.addCapability('broadcast_message');
      this.addCapability('encrypt_message');
      this.addCapability('message_history');

      this.logger.info('CommunicationAgent initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize CommunicationAgent', error);
      throw error;
    }
  }

  /**
   * Execute communication tasks
   */
  protected async executeTask(task: CommunicationTask): Promise<any> {
    this.logger.info(`Executing communication task: ${task.type}`, { taskId: task.id });

    try {
      switch (task.type) {
        case 'send_message':
          return await this.sendMessage(task);

        case 'receive_message':
          return await this.receiveMessage(task);

        case 'broadcast_message':
          return await this.broadcastMessage(task);

        case 'get_history':
          return await this.getMessageHistory(task);

        case 'encrypt_message':
          return await this.encryptMessage(task);

        default:
          throw new Error(`Unknown communication task type: ${task.type}`);
      }
    } catch (error) {
      this.logger.error(`Communication task failed: ${task.type}`, error);
      throw error;
    }
  }

  /**
   * Send a message to a specific channel
   */
  private async sendMessage(task: CommunicationTask): Promise<any> {
    const { channel, message, sender, metadata } = task.payload;

    if (!channel || !message || !sender) {
      throw new Error('Missing required fields: channel, message, sender');
    }

    if (!this.activeChannels.has(channel)) {
      throw new Error(`Channel '${channel}' is not supported`);
    }

    if (message.length > this.config.maxMessageLength) {
      throw new Error(`Message exceeds maximum length of ${this.config.maxMessageLength} characters`);
    }

    const messageObj: Message = {
      id: this.generateMessageId(),
      channel,
      sender,
      content: message,
      timestamp: new Date(),
      encrypted: false,
      metadata
    };

    // Encrypt message if encryption is enabled
    if (this.config.enableEncryption && this.encryptionKey) {
      messageObj.content = await this.encryptContent(message);
      messageObj.encrypted = true;
    }

    // Store message in history
    if (this.config.enableMessageHistory) {
      this.addToHistory(channel, messageObj);
    }

    this.logger.info(`Message sent to channel '${channel}'`, {
      messageId: messageObj.id,
      sender,
      length: message.length
    });

    return {
      success: true,
      messageId: messageObj.id,
      channel,
      timestamp: messageObj.timestamp,
      encrypted: messageObj.encrypted
    };
  }

  /**
   * Receive a message from a channel
   */
  private async receiveMessage(task: CommunicationTask): Promise<any> {
    const { channel } = task.payload;

    if (!channel) {
      throw new Error('Channel is required');
    }

    if (!this.activeChannels.has(channel)) {
      throw new Error(`Channel '${channel}' is not supported`);
    }

    const history = this.messageHistory.get(channel) || [];
    const latestMessage = history[history.length - 1];

    if (!latestMessage) {
      return {
        success: true,
        message: null,
        channel
      };
    }

    // Decrypt message if it's encrypted
    let content = latestMessage.content;
    if (latestMessage.encrypted && this.config.enableEncryption && this.encryptionKey) {
      content = await this.decryptContent(content);
    }

    this.logger.info(`Message received from channel '${channel}'`, {
      messageId: latestMessage.id,
      sender: latestMessage.sender
    });

    return {
      success: true,
      message: {
        id: latestMessage.id,
        channel: latestMessage.channel,
        sender: latestMessage.sender,
        content,
        timestamp: latestMessage.timestamp,
        encrypted: latestMessage.encrypted,
        metadata: latestMessage.metadata
      }
    };
  }

  /**
   * Broadcast a message to all active channels
   */
  private async broadcastMessage(task: CommunicationTask): Promise<any> {
    const { message, sender, metadata } = task.payload;

    if (!message || !sender) {
      throw new Error('Message and sender are required for broadcast');
    }

    const results = [];

    for (const channel of this.activeChannels) {
      try {
        const broadcastTask: CommunicationTask = {
          ...task,
          payload: { ...task.payload, channel }
        };

        const result = await this.sendMessage(broadcastTask);
        results.push({ channel, success: true, result });
      } catch (error) {
        results.push({
          channel,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    this.logger.info(`Broadcast completed`, {
      successCount,
      totalCount,
      sender
    });

    return {
      success: successCount > 0,
      results,
      summary: {
        totalChannels: totalCount,
        successfulChannels: successCount,
        failedChannels: totalCount - successCount
      }
    };
  }

  /**
   * Get message history for a channel
   */
  private async getMessageHistory(task: CommunicationTask): Promise<any> {
    const { channel, limit } = task.payload;

    if (!channel) {
      throw new Error('Channel is required');
    }

    if (!this.activeChannels.has(channel)) {
      throw new Error(`Channel '${channel}' is not supported`);
    }

    const history = this.messageHistory.get(channel) || [];
    const maxLimit = limit || this.config.maxHistorySize;
    const limitedHistory = history.slice(-maxLimit);

    // Decrypt messages if needed
    const decryptedHistory = await Promise.all(
      limitedHistory.map(async msg => {
        let content = msg.content;
        if (msg.encrypted && this.config.enableEncryption && this.encryptionKey) {
          content = await this.decryptContent(content);
        }

        return {
          ...msg,
          content
        };
      })
    );

    this.logger.info(`Retrieved message history for channel '${channel}'`, {
      messageCount: decryptedHistory.length
    });

    return {
      success: true,
      channel,
      messages: decryptedHistory,
      totalCount: history.length,
      returnedCount: decryptedHistory.length
    };
  }

  /**
   * Encrypt a message
   */
  private async encryptMessage(task: CommunicationTask): Promise<any> {
    const { content } = task.payload;

    if (!content) {
      throw new Error('Content is required for encryption');
    }

    if (!this.config.enableEncryption || !this.encryptionKey) {
      throw new Error('Encryption is not enabled or key not available');
    }

    const encryptedContent = await this.encryptContent(content);

    this.logger.info('Message encrypted successfully');

    return {
      success: true,
      originalLength: content.length,
      encryptedLength: encryptedContent.length,
      encrypted: encryptedContent
    };
  }

  /**
   * Initialize encryption
   */
  private async initializeEncryption(): Promise<void> {
    // TODO: Implement proper encryption key generation/retrieval
    this.encryptionKey = 'sample-encryption-key';
    this.logger.info('Encryption initialized');
  }

  /**
   * Encrypt content
   */
  private async encryptContent(content: string): Promise<string> {
    // TODO: Implement proper encryption
    // For now, just base64 encode
    return Buffer.from(content).toString('base64');
  }

  /**
   * Decrypt content
   */
  private async decryptContent(encryptedContent: string): Promise<string> {
    // TODO: Implement proper decryption
    // For now, just base64 decode
    return Buffer.from(encryptedContent, 'base64').toString();
  }

  /**
   * Add message to history
   */
  private addToHistory(channel: string, message: Message): void {
    const history = this.messageHistory.get(channel) || [];
    history.push(message);

    // Maintain history size limit
    if (history.length > this.config.maxHistorySize) {
      history.shift();
    }

    this.messageHistory.set(channel, history);
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get active channels
   */
  getActiveChannels(): string[] {
    return Array.from(this.activeChannels);
  }

  /**
   * Add new channel
   */
  addChannel(channel: string): void {
    if (!this.activeChannels.has(channel)) {
      this.activeChannels.add(channel);
      this.messageHistory.set(channel, []);
      this.logger.info(`Added new channel: ${channel}`);
    }
  }

  /**
   * Remove channel
   */
  removeChannel(channel: string): void {
    if (this.activeChannels.has(channel)) {
      this.activeChannels.delete(channel);
      this.messageHistory.delete(channel);
      this.logger.info(`Removed channel: ${channel}`);
    }
  }

  /**
   * Get communication statistics
   */
  getCommunicationStats(): any {
    const totalMessages = Array.from(this.messageHistory.values()).reduce((sum, history) => sum + history.length, 0);

    return {
      activeChannels: this.activeChannels.size,
      totalMessages,
      encryptionEnabled: this.config.enableEncryption,
      historyEnabled: this.config.enableMessageHistory,
      maxMessageLength: this.config.maxMessageLength,
      maxHistorySize: this.config.maxHistorySize
    };
  }

  /**
   * Cleanup resources
   */
  protected async onStop(): Promise<void> {
    this.logger.info('Stopping CommunicationAgent');

    try {
      // Clear message history
      this.messageHistory.clear();

      // Clear active channels
      this.activeChannels.clear();

      // Clear encryption key
      this.encryptionKey = undefined;

      this.logger.info('CommunicationAgent stopped successfully');
    } catch (error) {
      this.logger.error('Error during CommunicationAgent cleanup', error);
      throw error;
    }
  }
}

// Export the agent class for registration
export default CommunicationAgent;
