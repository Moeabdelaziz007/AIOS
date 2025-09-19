/**
 * Data Encryption System for AIOS
 * Comprehensive encryption/decryption for sensitive information with key management
 */

class DataEncryptionSystem {
  constructor() {
    this.encryptionKey = null;
    this.keyDerivationSalt = null;
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
    this.tagLength = 16; // 128 bits for GCM

    this.encryptionStats = {
      totalEncryptions: 0,
      totalDecryptions: 0,
      failedEncryptions: 0,
      failedDecryptions: 0,
      averageEncryptionTime: 0,
      averageDecryptionTime: 0,
      encryptionTimes: [],
      decryptionTimes: [],
    };

    this.sensitiveFields = [
      'password',
      'email',
      'phone',
      'ssn',
      'creditCard',
      'bankAccount',
      'personalData',
      'biometricData',
      'medicalData',
      'financialData',
    ];

    this.initializeEncryption();
  }

  /**
   * Initialize encryption system
   */
  async initializeEncryption() {
    try {
      console.log('🔐 Initializing Data Encryption System...');

      // Generate or retrieve encryption key
      await this.generateOrRetrieveKey();

      console.log('✅ Data Encryption System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize encryption system:', error);
      throw error;
    }
  }

  /**
   * Generate or retrieve encryption key
   */
  async generateOrRetrieveKey() {
    try {
      // Try to retrieve existing key from secure storage
      const existingKey = await this.retrieveStoredKey();

      if (existingKey) {
        this.encryptionKey = existingKey;
        console.log('🔑 Retrieved existing encryption key');
      } else {
        // Generate new key
        await this.generateNewKey();
        console.log('🔑 Generated new encryption key');
      }
    } catch (error) {
      console.error('Failed to handle encryption key:', error);
      throw error;
    }
  }

  /**
   * Generate new encryption key
   */
  async generateNewKey() {
    try {
      // Generate random key material
      const keyMaterial = crypto.getRandomValues(new Uint8Array(32));

      // Derive key using PBKDF2
      this.keyDerivationSalt = crypto.getRandomValues(new Uint8Array(16));

      const key = await crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      const derivedKey = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: this.keyDerivationSalt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        key,
        this.keyLength
      );

      this.encryptionKey = await crypto.subtle.importKey(
        'raw',
        derivedKey,
        { name: this.algorithm },
        false,
        ['encrypt', 'decrypt']
      );

      // Store key securely
      await this.storeKeySecurely();
    } catch (error) {
      console.error('Failed to generate encryption key:', error);
      throw error;
    }
  }

  /**
   * Encrypt sensitive data
   */
  async encryptData(data, fieldName = null) {
    const startTime = performance.now();

    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }

      // Convert data to string if needed
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));

      // Encrypt data
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv,
          tagLength: this.tagLength,
        },
        this.encryptionKey,
        new TextEncoder().encode(dataString)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      // Convert to base64 for storage
      const encryptedBase64 = btoa(String.fromCharCode(...combined));

      // Update stats
      const encryptionTime = performance.now() - startTime;
      this.updateEncryptionStats(true, encryptionTime);

      // Log encryption event
      this.logEncryptionEvent('encrypt', fieldName, dataString.length, true);

      return {
        encrypted: encryptedBase64,
        algorithm: this.algorithm,
        timestamp: Date.now(),
        fieldName: fieldName,
      };
    } catch (error) {
      const encryptionTime = performance.now() - startTime;
      this.updateEncryptionStats(false, encryptionTime);
      this.logEncryptionEvent('encrypt', fieldName, 0, false, error.message);

      console.error('Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt sensitive data
   */
  async decryptData(encryptedData, fieldName = null) {
    const startTime = performance.now();

    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }

      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData.encrypted)
          .split('')
          .map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, this.ivLength);
      const encrypted = combined.slice(this.ivLength);

      // Decrypt data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv,
          tagLength: this.tagLength,
        },
        this.encryptionKey,
        encrypted
      );

      // Convert back to string
      const decryptedString = new TextDecoder().decode(decryptedData);

      // Update stats
      const decryptionTime = performance.now() - startTime;
      this.updateDecryptionStats(true, decryptionTime);

      // Log decryption event
      this.logEncryptionEvent(
        'decrypt',
        fieldName,
        decryptedString.length,
        true
      );

      return decryptedString;
    } catch (error) {
      const decryptionTime = performance.now() - startTime;
      this.updateDecryptionStats(false, decryptionTime);
      this.logEncryptionEvent('decrypt', fieldName, 0, false, error.message);

      console.error('Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Encrypt object with sensitive fields
   */
  async encryptObject(obj) {
    const encryptedObj = { ...obj };

    for (const [key, value] of Object.entries(obj)) {
      if (this.isSensitiveField(key) && value !== null && value !== undefined) {
        try {
          const encrypted = await this.encryptData(value, key);
          encryptedObj[key] = encrypted;
        } catch (error) {
          console.warn(`Failed to encrypt field ${key}:`, error);
          // Keep original value if encryption fails
        }
      }
    }

    return encryptedObj;
  }

  /**
   * Decrypt object with sensitive fields
   */
  async decryptObject(obj) {
    const decryptedObj = { ...obj };

    for (const [key, value] of Object.entries(obj)) {
      if (this.isEncryptedField(value)) {
        try {
          const decrypted = await this.decryptData(value, key);
          decryptedObj[key] = decrypted;
        } catch (error) {
          console.warn(`Failed to decrypt field ${key}:`, error);
          // Keep encrypted value if decryption fails
        }
      }
    }

    return decryptedObj;
  }

  /**
   * Check if field is sensitive
   */
  isSensitiveField(fieldName) {
    return this.sensitiveFields.some(field =>
      fieldName.toLowerCase().includes(field.toLowerCase())
    );
  }

  /**
   * Check if field is encrypted
   */
  isEncryptedField(value) {
    return (
      value &&
      typeof value === 'object' &&
      value.encrypted &&
      value.algorithm === this.algorithm
    );
  }

  /**
   * Generate secure password
   */
  generatePassword() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Store key securely
   */
  async storeKeySecurely() {
    try {
      // In a real implementation, you would store this in a secure key management system
      // For now, we'll use localStorage with additional obfuscation
      const keyData = {
        key: Array.from(
          new Uint8Array(
            await crypto.subtle.exportKey('raw', this.encryptionKey)
          )
        ),
        salt: Array.from(this.keyDerivationSalt),
        timestamp: Date.now(),
      };

      // Obfuscate the key data
      const obfuscated = btoa(JSON.stringify(keyData));
      localStorage.setItem('aios_encryption_key', obfuscated);
    } catch (error) {
      console.error('Failed to store encryption key:', error);
    }
  }

  /**
   * Retrieve stored key
   */
  async retrieveStoredKey() {
    try {
      const stored = localStorage.getItem('aios_encryption_key');
      if (!stored) return null;

      const keyData = JSON.parse(atob(stored));

      // Reconstruct key
      const keyBuffer = new Uint8Array(keyData.key);
      this.keyDerivationSalt = new Uint8Array(keyData.salt);

      this.encryptionKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: this.algorithm },
        false,
        ['encrypt', 'decrypt']
      );

      return this.encryptionKey;
    } catch (error) {
      console.error('Failed to retrieve encryption key:', error);
      return null;
    }
  }

  /**
   * Update encryption statistics
   */
  updateEncryptionStats(success, time) {
    this.encryptionStats.totalEncryptions++;
    if (!success) {
      this.encryptionStats.failedEncryptions++;
    }

    this.encryptionStats.encryptionTimes.push(time);
    this.encryptionStats.averageEncryptionTime =
      this.encryptionStats.encryptionTimes.reduce((a, b) => a + b, 0) /
      this.encryptionStats.encryptionTimes.length;
  }

  /**
   * Update decryption statistics
   */
  updateDecryptionStats(success, time) {
    this.encryptionStats.totalDecryptions++;
    if (!success) {
      this.encryptionStats.failedDecryptions++;
    }

    this.encryptionStats.decryptionTimes.push(time);
    this.encryptionStats.averageDecryptionTime =
      this.encryptionStats.decryptionTimes.reduce((a, b) => a + b, 0) /
      this.encryptionStats.decryptionTimes.length;
  }

  /**
   * Log encryption events
   */
  logEncryptionEvent(operation, fieldName, dataSize, success, error = null) {
    const event = {
      id: this.generateEventId(),
      operation,
      fieldName,
      dataSize,
      success,
      error,
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
    };

    // Store in audit log
    this.storeAuditEvent('encryption', event);
  }

  /**
   * Get encryption statistics
   */
  getEncryptionStats() {
    return {
      ...this.encryptionStats,
      successRate:
        this.encryptionStats.totalEncryptions > 0
          ? (this.encryptionStats.totalEncryptions -
              this.encryptionStats.failedEncryptions) /
            this.encryptionStats.totalEncryptions
          : 0,
      decryptionSuccessRate:
        this.encryptionStats.totalDecryptions > 0
          ? (this.encryptionStats.totalDecryptions -
              this.encryptionStats.failedDecryptions) /
            this.encryptionStats.totalDecryptions
          : 0,
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const testData = 'test_encryption_data';
      const encrypted = await this.encryptData(testData);
      const decrypted = await this.decryptData(encrypted);

      const isHealthy = decrypted === testData;

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy
          ? 'Encryption system operational'
          : 'Encryption test failed',
        stats: this.getEncryptionStats(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        stats: this.getEncryptionStats(),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Utility methods
   */
  generateEventId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getCurrentUserId() {
    // This would integrate with your authentication system
    return 'current_user_id';
  }

  storeAuditEvent(type, event) {
    // This would integrate with your audit logging system
    console.log(`🔍 Audit Event [${type}]:`, event);
  }

  /**
   * Clear encryption data
   */
  clearEncryptionData() {
    this.encryptionKey = null;
    this.keyDerivationSalt = null;
    localStorage.removeItem('aios_encryption_key');
    console.log('🧹 Encryption data cleared');
  }
}

// Create singleton instance
const dataEncryptionSystem = new DataEncryptionSystem();

export default dataEncryptionSystem;
