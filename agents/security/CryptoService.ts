/**
 * CryptoService.ts
 *
 * Cryptographic service for encryption, decryption, hashing,
 * and secure key management.
 */

import * as crypto from 'crypto';
import { Logger } from '../utils/Logger';

export interface CryptoConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  hashAlgorithm: string;
  enableCompression: boolean;
  enableSalt: boolean;
  keyDerivationIterations: number;
}

export interface EncryptionResult {
  encrypted: string;
  iv: string;
  salt?: string;
  algorithm: string;
}

export interface HashResult {
  hash: string;
  salt?: string;
  algorithm: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: string;
}

export class CryptoService {
  private readonly logger: Logger;
  private config: CryptoConfig;
  private masterKey?: string;
  private keyCache: Map<string, Buffer> = new Map();

  constructor(config: Partial<CryptoConfig> = {}) {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      hashAlgorithm: 'sha256',
      enableCompression: false,
      enableSalt: true,
      keyDerivationIterations: 100000,
      ...config
    };

    this.logger = new Logger('CryptoService');
  }

  /**
   * Initialize crypto service with master key
   */
  async initialize(masterKey?: string): Promise<void> {
    try {
      this.logger.info('Initializing CryptoService');

      if (masterKey) {
        this.masterKey = masterKey;
      } else {
        // Generate a new master key
        this.masterKey = this.generateRandomKey(32);
        this.logger.warn('No master key provided, generated new key');
      }

      this.logger.info('CryptoService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize CryptoService', error);
      throw error;
    }
  }

  /**
   * Encrypt data
   */
  async encrypt(data: string, key?: string): Promise<string> {
    try {
      if (!this.masterKey && !key) {
        throw new Error('No encryption key available');
      }

      const encryptionKey = key ? this.deriveKey(key) : this.deriveKey(this.masterKey!);
      const iv = crypto.randomBytes(this.config.ivLength);
      const salt = this.config.enableSalt ? crypto.randomBytes(16) : undefined;

      const cipher = crypto.createCipher(this.config.algorithm, encryptionKey);
      cipher.setAAD(salt || Buffer.alloc(0));

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      const result: EncryptionResult = {
        encrypted,
        iv: iv.toString('hex'),
        salt: salt?.toString('hex'),
        algorithm: this.config.algorithm
      };

      // Combine all components
      const combined = JSON.stringify(result);
      return Buffer.from(combined).toString('base64');
    } catch (error) {
      this.logger.error('Encryption failed', error);
      throw error;
    }
  }

  /**
   * Decrypt data
   */
  async decrypt(encryptedData: string, key?: string): Promise<string> {
    try {
      if (!this.masterKey && !key) {
        throw new Error('No decryption key available');
      }

      // Parse the encrypted data
      const combined = Buffer.from(encryptedData, 'base64').toString('utf8');
      const result: EncryptionResult = JSON.parse(combined);

      const encryptionKey = key ? this.deriveKey(key) : this.deriveKey(this.masterKey!);
      const iv = Buffer.from(result.iv, 'hex');
      const salt = result.salt ? Buffer.from(result.salt, 'hex') : undefined;

      const decipher = crypto.createDecipher(this.config.algorithm, encryptionKey);
      decipher.setAAD(salt || Buffer.alloc(0));

      let decrypted = decipher.update(result.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', error);
      throw error;
    }
  }

  /**
   * Hash data with optional salt
   */
  async hash(data: string, salt?: string): Promise<HashResult> {
    try {
      const actualSalt = salt || (this.config.enableSalt ? this.generateRandomSalt() : '');
      const hash = crypto.createHash(this.config.hashAlgorithm);

      hash.update(data + actualSalt);
      const hashValue = hash.digest('hex');

      return {
        hash: hashValue,
        salt: actualSalt,
        algorithm: this.config.hashAlgorithm
      };
    } catch (error) {
      this.logger.error('Hashing failed', error);
      throw error;
    }
  }

  /**
   * Verify hash
   */
  async verifyHash(data: string, hash: string, salt?: string): Promise<boolean> {
    try {
      const result = await this.hash(data, salt);
      return result.hash === hash;
    } catch (error) {
      this.logger.error('Hash verification failed', error);
      return false;
    }
  }

  /**
   * Generate key pair for asymmetric encryption
   */
  async generateKeyPair(): Promise<KeyPair> {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      return {
        publicKey,
        privateKey,
        algorithm: 'rsa'
      };
    } catch (error) {
      this.logger.error('Key pair generation failed', error);
      throw error;
    }
  }

  /**
   * Sign data with private key
   */
  async sign(data: string, privateKey: string): Promise<string> {
    try {
      const sign = crypto.createSign('sha256');
      sign.update(data);
      return sign.sign(privateKey, 'hex');
    } catch (error) {
      this.logger.error('Signing failed', error);
      throw error;
    }
  }

  /**
   * Verify signature with public key
   */
  async verify(data: string, signature: string, publicKey: string): Promise<boolean> {
    try {
      const verify = crypto.createVerify('sha256');
      verify.update(data);
      return verify.verify(publicKey, signature, 'hex');
    } catch (error) {
      this.logger.error('Signature verification failed', error);
      return false;
    }
  }

  /**
   * Generate random key
   */
  generateRandomKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate random salt
   */
  generateRandomSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID
   */
  generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Derive key from password using PBKDF2
   */
  private deriveKey(password: string, salt?: Buffer): Buffer {
    const cacheKey = `${password}_${salt?.toString('hex') || 'no_salt'}`;

    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const actualSalt = salt || crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(
      password,
      actualSalt,
      this.config.keyDerivationIterations,
      this.config.keyLength,
      this.config.hashAlgorithm
    );

    this.keyCache.set(cacheKey, key);
    return key;
  }

  /**
   * Encrypt sensitive data for storage
   */
  async encryptForStorage(data: any): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      return await this.encrypt(jsonData);
    } catch (error) {
      this.logger.error('Storage encryption failed', error);
      throw error;
    }
  }

  /**
   * Decrypt sensitive data from storage
   */
  async decryptFromStorage(encryptedData: string): Promise<any> {
    try {
      const decryptedJson = await this.decrypt(encryptedData);
      return JSON.parse(decryptedJson);
    } catch (error) {
      this.logger.error('Storage decryption failed', error);
      throw error;
    }
  }

  /**
   * Hash password for storage
   */
  async hashPassword(password: string): Promise<HashResult> {
    try {
      return await this.hash(password);
    } catch (error) {
      this.logger.error('Password hashing failed', error);
      throw error;
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    try {
      return await this.verifyHash(password, hash, salt);
    } catch (error) {
      this.logger.error('Password verification failed', error);
      return false;
    }
  }

  /**
   * Generate secure token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64url');
  }

  /**
   * Generate HMAC
   */
  generateHMAC(data: string, key: string): string {
    return crypto.createHmac(this.config.hashAlgorithm, key).update(data).digest('hex');
  }

  /**
   * Verify HMAC
   */
  verifyHMAC(data: string, signature: string, key: string): boolean {
    const expectedSignature = this.generateHMAC(data, key);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Clear key cache
   */
  clearKeyCache(): void {
    this.keyCache.clear();
    this.logger.info('Key cache cleared');
  }

  /**
   * Get configuration
   */
  getConfig(): CryptoConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CryptoConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Crypto configuration updated');
  }

  /**
   * Get security status
   */
  getSecurityStatus(): any {
    return {
      initialized: !!this.masterKey,
      algorithm: this.config.algorithm,
      keyLength: this.config.keyLength,
      hashAlgorithm: this.config.hashAlgorithm,
      keyCacheSize: this.keyCache.size,
      enableSalt: this.config.enableSalt,
      enableCompression: this.config.enableCompression
    };
  }
}
