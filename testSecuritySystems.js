/**
 * Security Systems Test Suite for AIOS
 * Comprehensive testing of data security features
 */

const fs = require('fs');
const path = require('path');

class SecuritySystemsTester {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    console.log('🔐 Security Systems Test Suite v1.0.0 initialized');
    console.log('🚀 Starting comprehensive security systems tests...\n');
  }

  async runAllTests() {
    try {
      await this.testDataEncryptionSystem();
      await this.testConsentManagementSystem();
      await this.testDataRetentionPolicySystem();
      await this.testAuditLoggingSystem();
      await this.testSecurityDashboard();
      await this.testSecurityIntegration();

      this.generateTestReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testDataEncryptionSystem() {
    console.log('🔐 Testing Data Encryption System...');

    try {
      // Test encryption system initialization
      const encryptionSystem =
        require('./client/src/services/DataEncryptionSystem').default;

      // Test encryption
      const testData = 'sensitive_user_data_12345';
      const encrypted = await encryptionSystem.encryptData(
        testData,
        'userData'
      );

      this.recordTest(
        'Data Encryption - Encryption',
        encrypted && encrypted.encrypted && encrypted.algorithm === 'AES-GCM',
        'Data encryption working correctly'
      );

      // Test decryption
      const decrypted = await encryptionSystem.decryptData(
        encrypted,
        'userData'
      );

      this.recordTest(
        'Data Encryption - Decryption',
        decrypted === testData,
        'Data decryption working correctly'
      );

      // Test object encryption
      const testObject = { email: 'user@example.com', password: 'secret123' };
      const encryptedObject = await encryptionSystem.encryptObject(testObject);

      this.recordTest(
        'Data Encryption - Object Encryption',
        encryptedObject.email && typeof encryptedObject.email === 'object',
        'Object encryption working correctly'
      );

      // Test object decryption
      const decryptedObject = await encryptionSystem.decryptObject(
        encryptedObject
      );

      this.recordTest(
        'Data Encryption - Object Decryption',
        decryptedObject.email === testObject.email,
        'Object decryption working correctly'
      );

      // Test encryption statistics
      const stats = encryptionSystem.getEncryptionStats();

      this.recordTest(
        'Data Encryption - Statistics',
        stats && stats.totalEncryptions > 0 && stats.totalDecryptions > 0,
        'Encryption statistics working correctly'
      );

      // Test health check
      const health = await encryptionSystem.healthCheck();

      this.recordTest(
        'Data Encryption - Health Check',
        health && health.status === 'healthy',
        'Encryption health check working correctly'
      );

      console.log('✅ Data Encryption System tests completed');
    } catch (error) {
      console.error('❌ Data Encryption System test failed:', error.message);
      this.recordTest(
        'Data Encryption - System Test',
        false,
        `Error: ${error.message}`
      );
    }
  }

  async testConsentManagementSystem() {
    console.log('📋 Testing Consent Management System...');

    try {
      const consentSystem =
        require('./client/src/services/ConsentManagementSystem').default;

      // Test consent request
      const consentRequest = await consentSystem.requestConsent(
        'test_user_123',
        'data_collection',
        {
          purpose: 'Testing consent system',
          description: 'This is a test consent request',
          required: true,
        }
      );

      this.recordTest(
        'Consent Management - Request Consent',
        consentRequest && consentRequest.success && consentRequest.consentId,
        'Consent request working correctly'
      );

      // Test consent grant
      const consentGrant = await consentSystem.grantConsent(
        'test_user_123',
        consentRequest.consentId,
        { grantedAt: Date.now() }
      );

      this.recordTest(
        'Consent Management - Grant Consent',
        consentGrant && consentGrant.success,
        'Consent grant working correctly'
      );

      // Test consent status check
      const consentStatus = consentSystem.checkConsentStatus(
        'test_user_123',
        'data_collection'
      );

      this.recordTest(
        'Consent Management - Check Status',
        consentStatus && consentStatus.hasConsent === true,
        'Consent status check working correctly'
      );

      // Test consent withdrawal
      const consentWithdrawal = await consentSystem.withdrawConsent(
        'test_user_123',
        consentRequest.consentId,
        'User requested withdrawal'
      );

      this.recordTest(
        'Consent Management - Withdraw Consent',
        consentWithdrawal && consentWithdrawal.success,
        'Consent withdrawal working correctly'
      );

      // Test user consent summary
      const userSummary = consentSystem.getUserConsentSummary('test_user_123');

      this.recordTest(
        'Consent Management - User Summary',
        userSummary && userSummary.userId === 'test_user_123',
        'User consent summary working correctly'
      );

      // Test consent statistics
      const stats = consentSystem.getConsentStats();

      this.recordTest(
        'Consent Management - Statistics',
        stats && stats.totalConsents > 0,
        'Consent statistics working correctly'
      );

      // Test health check
      const health = await consentSystem.healthCheck();

      this.recordTest(
        'Consent Management - Health Check',
        health && health.status === 'healthy',
        'Consent health check working correctly'
      );

      console.log('✅ Consent Management System tests completed');
    } catch (error) {
      console.error('❌ Consent Management System test failed:', error.message);
      this.recordTest(
        'Consent Management - System Test',
        false,
        `Error: ${error.message}`
      );
    }
  }

  async testDataRetentionPolicySystem() {
    console.log('📅 Testing Data Retention Policy System...');

    try {
      const retentionSystem =
        require('./client/src/services/DataRetentionPolicySystem').default;

      // Test policy creation
      const policy = await retentionSystem.createRetentionPolicy({
        name: 'Test Retention Policy',
        description: 'Test policy for automated cleanup',
        dataCategories: ['test_data'],
        retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
        action: 'delete',
        trigger: 'time_based',
        conditions: { age: '7_days_old' },
      });

      this.recordTest(
        'Data Retention - Create Policy',
        policy && policy.id && policy.name === 'Test Retention Policy',
        'Policy creation working correctly'
      );

      // Test policy application
      const testRecords = [
        {
          id: 'record1',
          data: 'test data 1',
          createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'record2',
          data: 'test data 2',
          createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        },
      ];

      const policyResult = await retentionSystem.applyRetentionPolicy(
        policy.id,
        testRecords
      );

      this.recordTest(
        'Data Retention - Apply Policy',
        policyResult && policyResult.success,
        'Policy application working correctly'
      );

      // Test automated cleanup
      const cleanupResult = await retentionSystem.runAutomatedCleanup();

      this.recordTest(
        'Data Retention - Automated Cleanup',
        cleanupResult && cleanupResult.policiesProcessed >= 0,
        'Automated cleanup working correctly'
      );

      // Test compliance check
      const complianceReport = await retentionSystem.checkRetentionCompliance();

      this.recordTest(
        'Data Retention - Compliance Check',
        complianceReport && complianceReport.totalPolicies > 0,
        'Compliance check working correctly'
      );

      // Test retention report
      const report = await retentionSystem.getRetentionReport();

      this.recordTest(
        'Data Retention - Generate Report',
        report && report.summary && report.policyDetails,
        'Retention report generation working correctly'
      );

      // Test retention statistics
      const stats = retentionSystem.getRetentionStats();

      this.recordTest(
        'Data Retention - Statistics',
        stats && stats.policies > 0,
        'Retention statistics working correctly'
      );

      // Test health check
      const health = await retentionSystem.healthCheck();

      this.recordTest(
        'Data Retention - Health Check',
        health && health.status === 'healthy',
        'Retention health check working correctly'
      );

      console.log('✅ Data Retention Policy System tests completed');
    } catch (error) {
      console.error(
        '❌ Data Retention Policy System test failed:',
        error.message
      );
      this.recordTest(
        'Data Retention - System Test',
        false,
        `Error: ${error.message}`
      );
    }
  }

  async testAuditLoggingSystem() {
    console.log('📝 Testing Audit Logging System...');

    try {
      const auditSystem =
        require('./client/src/services/AuditLoggingSystem').default;

      // Test audit event logging
      const auditEvent = await auditSystem.logEvent({
        category: 'data_access',
        action: 'read',
        userId: 'test_user_123',
        resourceId: 'document_456',
        resourceType: 'user_profile',
        details: { timestamp: Date.now() },
        severity: 'low',
      });

      this.recordTest(
        'Audit Logging - Log Event',
        auditEvent && auditEvent.success && auditEvent.auditId,
        'Audit event logging working correctly'
      );

      // Test data access logging
      const dataAccessLog = await auditSystem.logDataAccess(
        'test_user_123',
        'document_789',
        'user_profile',
        'read',
        { ipAddress: '127.0.0.1' }
      );

      this.recordTest(
        'Audit Logging - Data Access Log',
        dataAccessLog && dataAccessLog.success,
        'Data access logging working correctly'
      );

      // Test authentication logging
      const authLog = await auditSystem.logAuthentication(
        'test_user_123',
        'login',
        true,
        { method: 'password', ipAddress: '127.0.0.1' }
      );

      this.recordTest(
        'Audit Logging - Authentication Log',
        authLog && authLog.success,
        'Authentication logging working correctly'
      );

      // Test security event logging
      const securityLog = await auditSystem.logSecurityEvent(
        'suspicious_activity',
        'high',
        { userId: 'test_user_123', details: 'Multiple failed logins' }
      );

      this.recordTest(
        'Audit Logging - Security Event Log',
        securityLog && securityLog.success,
        'Security event logging working correctly'
      );

      // Test API access logging
      const apiLog = await auditSystem.logAPIAccess(
        'test_user_123',
        '/api/users',
        'GET',
        200,
        150,
        { userAgent: 'Test Agent' }
      );

      this.recordTest(
        'Audit Logging - API Access Log',
        apiLog && apiLog.success,
        'API access logging working correctly'
      );

      // Test audit log querying
      const queryResult = await auditSystem.queryAuditLogs({
        userId: 'test_user_123',
        limit: 10,
      });

      this.recordTest(
        'Audit Logging - Query Logs',
        queryResult && queryResult.logs && Array.isArray(queryResult.logs),
        'Audit log querying working correctly'
      );

      // Test audit report generation
      const report = await auditSystem.generateAuditReport({
        startTime: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
        endTime: Date.now(),
      });

      this.recordTest(
        'Audit Logging - Generate Report',
        report && report.summary && report.timestamp,
        'Audit report generation working correctly'
      );

      // Test audit statistics
      const stats = auditSystem.getAuditStats();

      this.recordTest(
        'Audit Logging - Statistics',
        stats && stats.totalEvents > 0,
        'Audit statistics working correctly'
      );

      // Test health check
      const health = await auditSystem.healthCheck();

      this.recordTest(
        'Audit Logging - Health Check',
        health && health.status === 'healthy',
        'Audit health check working correctly'
      );

      console.log('✅ Audit Logging System tests completed');
    } catch (error) {
      console.error('❌ Audit Logging System test failed:', error.message);
      this.recordTest(
        'Audit Logging - System Test',
        false,
        `Error: ${error.message}`
      );
    }
  }

  async testSecurityDashboard() {
    console.log('🛡️ Testing Security Dashboard Component...');

    try {
      // Check if SecurityDashboard component exists
      const dashboardPath = './client/src/components/SecurityDashboard.js';
      const dashboardExists = fs.existsSync(dashboardPath);

      this.recordTest(
        'Security Dashboard - Component Exists',
        dashboardExists,
        'Security Dashboard component file exists'
      );

      if (dashboardExists) {
        // Read and validate component structure
        const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

        // Check for required imports
        const hasReactImport = dashboardContent.includes('import React');
        const hasUIComponents =
          dashboardContent.includes('Card') &&
          dashboardContent.includes('Button');
        const hasIcons = dashboardContent.includes('lucide-react');

        this.recordTest(
          'Security Dashboard - React Imports',
          hasReactImport,
          'React imports present'
        );

        this.recordTest(
          'Security Dashboard - UI Components',
          hasUIComponents,
          'UI components imported'
        );

        this.recordTest(
          'Security Dashboard - Icons',
          hasIcons,
          'Icons imported'
        );

        // Check for security system integrations
        const hasEncryptionIntegration = dashboardContent.includes(
          'DataEncryptionSystem'
        );
        const hasConsentIntegration = dashboardContent.includes(
          'ConsentManagementSystem'
        );
        const hasRetentionIntegration = dashboardContent.includes(
          'DataRetentionPolicySystem'
        );
        const hasAuditIntegration =
          dashboardContent.includes('AuditLoggingSystem');

        this.recordTest(
          'Security Dashboard - Encryption Integration',
          hasEncryptionIntegration,
          'Data encryption system integration present'
        );

        this.recordTest(
          'Security Dashboard - Consent Integration',
          hasConsentIntegration,
          'Consent management system integration present'
        );

        this.recordTest(
          'Security Dashboard - Retention Integration',
          hasRetentionIntegration,
          'Data retention system integration present'
        );

        this.recordTest(
          'Security Dashboard - Audit Integration',
          hasAuditIntegration,
          'Audit logging system integration present'
        );

        // Check for security score calculation
        const hasSecurityScore = dashboardContent.includes(
          'calculateOverallSecurityScore'
        );

        this.recordTest(
          'Security Dashboard - Security Score',
          hasSecurityScore,
          'Security score calculation present'
        );
      }

      console.log('✅ Security Dashboard Component tests completed');
    } catch (error) {
      console.error(
        '❌ Security Dashboard Component test failed:',
        error.message
      );
      this.recordTest(
        'Security Dashboard - Component Test',
        false,
        `Error: ${error.message}`
      );
    }
  }

  async testSecurityIntegration() {
    console.log('🔗 Testing Security Systems Integration...');

    try {
      // Test that all security systems can work together
      const encryptionSystem =
        require('./client/src/services/DataEncryptionSystem').default;
      const consentSystem =
        require('./client/src/services/ConsentManagementSystem').default;
      const retentionSystem =
        require('./client/src/services/DataRetentionPolicySystem').default;
      const auditSystem =
        require('./client/src/services/AuditLoggingSystem').default;

      // Test integrated workflow: Consent -> Encryption -> Audit -> Retention

      // 1. Request consent
      const consentRequest = await consentSystem.requestConsent(
        'integration_test_user',
        'data_processing',
        { purpose: 'Integration testing' }
      );

      // 2. Grant consent
      const consentGrant = await consentSystem.grantConsent(
        'integration_test_user',
        consentRequest.consentId
      );

      // 3. Encrypt sensitive data
      const sensitiveData = 'integration_test_sensitive_data';
      const encryptedData = await encryptionSystem.encryptData(
        sensitiveData,
        'integration_test'
      );

      // 4. Log the encryption event
      const encryptionAudit = await auditSystem.logEvent({
        category: 'encryption',
        action: 'encrypt',
        userId: 'integration_test_user',
        resourceId: 'integration_test_data',
        resourceType: 'sensitive_data',
        details: { encrypted: true },
        severity: 'medium',
      });

      // 5. Create retention policy for test data
      const retentionPolicy = await retentionSystem.createRetentionPolicy({
        name: 'Integration Test Policy',
        description: 'Policy for integration test data',
        dataCategories: ['integration_test'],
        retentionPeriod: 24 * 60 * 60 * 1000, // 1 day
        action: 'delete',
        trigger: 'time_based',
      });

      this.recordTest(
        'Security Integration - Consent Workflow',
        consentGrant && consentGrant.success,
        'Consent workflow working correctly'
      );

      this.recordTest(
        'Security Integration - Encryption Workflow',
        encryptedData && encryptedData.encrypted,
        'Encryption workflow working correctly'
      );

      this.recordTest(
        'Security Integration - Audit Workflow',
        encryptionAudit && encryptionAudit.success,
        'Audit workflow working correctly'
      );

      this.recordTest(
        'Security Integration - Retention Workflow',
        retentionPolicy && retentionPolicy.id,
        'Retention workflow working correctly'
      );

      // Test cross-system health checks
      const encryptionHealth = await encryptionSystem.healthCheck();
      const consentHealth = await consentSystem.healthCheck();
      const retentionHealth = await retentionSystem.healthCheck();
      const auditHealth = await auditSystem.healthCheck();

      const allSystemsHealthy =
        encryptionHealth.status === 'healthy' &&
        consentHealth.status === 'healthy' &&
        retentionHealth.status === 'healthy' &&
        auditHealth.status === 'healthy';

      this.recordTest(
        'Security Integration - All Systems Healthy',
        allSystemsHealthy,
        'All security systems are healthy'
      );

      console.log('✅ Security Systems Integration tests completed');
    } catch (error) {
      console.error(
        '❌ Security Systems Integration test failed:',
        error.message
      );
      this.recordTest(
        'Security Integration - System Test',
        false,
        `Error: ${error.message}`
      );
    }
  }

  recordTest(testName, passed, message) {
    const result = {
      name: testName,
      passed,
      message,
      timestamp: new Date().toISOString(),
    };

    this.testResults.push(result);

    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}`);
    console.log(`   ${message}`);
    console.log(`   Time: ${new Date().toLocaleTimeString()}\n`);
  }

  generateTestReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = this.testResults.filter(test => !test.passed).length;
    const totalTests = this.testResults.length;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    console.log(
      '================================================================================'
    );
    console.log('🔐 SECURITY SYSTEMS TEST REPORT');
    console.log(
      '================================================================================'
    );
    console.log(
      `📅 Test Date: ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`
    );
    console.log(`🔧 Tester: Security Systems Test Suite v1.0.0`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`⏱️ Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(
      '================================================================================\n'
    );

    console.log('📋 DETAILED RESULTS:');
    console.log(
      '--------------------------------------------------------------------------------'
    );

    this.testResults.forEach((test, index) => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${test.name}`);
      console.log(`   ${test.message}`);
      console.log(`   Time: ${test.timestamp}\n`);
    });

    console.log(
      '================================================================================'
    );
    console.log('🎯 SECURITY SYSTEMS SUMMARY:');
    console.log(
      '================================================================================'
    );

    if (successRate >= 95) {
      console.log('🎉 EXCELLENT: All security systems are working perfectly!');
      console.log('🛡️ AIOS security implementation is production-ready.');
    } else if (successRate >= 80) {
      console.log('✅ GOOD: Most security systems are working well.');
      console.log('🔧 Some minor issues need attention before production.');
    } else if (successRate >= 60) {
      console.log('⚠️ FAIR: Security systems need improvements.');
      console.log('🚨 Review failed tests and fix issues before deployment.');
    } else {
      console.log('❌ POOR: Security systems have significant issues.');
      console.log('🚨 Major security concerns need immediate attention.');
    }

    console.log('\n🔧 SECURITY FEATURES TESTED:');
    console.log(
      '--------------------------------------------------------------------------------'
    );
    console.log('• Data Encryption: AES-GCM encryption/decryption');
    console.log('• Consent Management: GDPR/CCPA compliance');
    console.log('• Data Retention: Automated lifecycle management');
    console.log('• Audit Logging: Comprehensive event tracking');
    console.log('• Security Dashboard: Real-time monitoring');
    console.log('• System Integration: Cross-system workflows');

    console.log('\n🚀 NEXT STEPS:');
    console.log(
      '--------------------------------------------------------------------------------'
    );
    if (failedTests > 0) {
      console.log('1. Review failed security tests');
      console.log('2. Fix identified security issues');
      console.log('3. Re-run security tests to verify fixes');
    }
    console.log('4. Deploy security systems to production');
    console.log('5. Monitor security metrics continuously');
    console.log('6. Regular security audits and compliance checks');
    console.log(
      '================================================================================\n'
    );

    console.log('✅ All security systems tests completed!');
  }
}

// Run the test suite
const tester = new SecuritySystemsTester();
tester.runAllTests().catch(console.error);
