/**
 * Security Dashboard Component for AIOS
 * Comprehensive security monitoring and management interface
 */

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Lock,
  RefreshCw,
  Search,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

const SecurityDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [securityData, setSecurityData] = useState({
    encryption: null,
    consent: null,
    retention: null,
    audit: null,
    overall: null,
  });
  const [timeRange, setTimeRange] = useState('24h');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange, loadSecurityData]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Import security systems dynamically
      const [
        { default: dataEncryption },
        { default: consentManagement },
        { default: dataRetention },
        { default: auditLogging },
      ] = await Promise.all([
        import('../services/DataEncryptionSystem'),
        import('../services/ConsentManagementSystem'),
        import('../services/DataRetentionPolicySystem'),
        import('../services/AuditLoggingSystem'),
      ]);

      const [encryptionStats, consentStats, retentionStats, auditStats] =
        await Promise.all([
          dataEncryption.getEncryptionStats(),
          consentManagement.getConsentStats(),
          dataRetention.getRetentionStats(),
          auditLogging.getAuditStats(),
        ]);

      // Generate overall security score
      const overallScore = calculateOverallSecurityScore({
        encryption: encryptionStats,
        consent: consentStats,
        retention: retentionStats,
        audit: auditStats,
      });

      setSecurityData({
        encryption: encryptionStats,
        consent: consentStats,
        retention: retentionStats,
        audit: auditStats,
        overall: overallScore,
      });

      setError(null);
    } catch (err) {
      console.error('Failed to load security data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallSecurityScore = data => {
    let score = 0;
    let maxScore = 0;

    // Encryption score (25%)
    if (data.encryption) {
      const encryptionScore = data.encryption.successRate * 25;
      score += encryptionScore;
      maxScore += 25;
    }

    // Consent score (25%)
    if (data.consent) {
      const consentScore = data.consent.consentRate * 25;
      score += consentScore;
      maxScore += 25;
    }

    // Retention score (25%)
    if (data.retention) {
      const retentionScore = Math.min(25, (data.retention.policies || 0) * 5);
      score += retentionScore;
      maxScore += 25;
    }

    // Audit score (25%)
    if (data.audit) {
      const auditScore = Math.min(
        25,
        (data.audit.totalEvents || 0) > 0 ? 25 : 0
      );
      score += auditScore;
      maxScore += 25;
    }

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    return {
      score: Math.round(percentage),
      level:
        percentage >= 90
          ? 'excellent'
          : percentage >= 75
          ? 'good'
          : percentage >= 50
          ? 'fair'
          : 'poor',
      details: {
        encryption: data.encryption?.successRate || 0,
        consent: data.consent?.consentRate || 0,
        retention: data.retention?.policies || 0,
        audit: data.audit?.totalEvents || 0,
      },
    };
  };

  const getSecurityLevelColor = level => {
    switch (level) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Removed unused getSeverityColor function

  const formatBytes = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = ms => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (loading && !securityData.overall) {
    return (
      <div className='flex items-center justify-center p-8'>
        <RefreshCw className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading security data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Failed to load security data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold flex items-center'>
            <Shield className='h-6 w-6 mr-2' />
            Security Dashboard
          </h2>
          <p className='text-gray-600'>
            Comprehensive security monitoring and compliance management
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className='px-3 py-1 border rounded-md text-sm'
          >
            <option value='1h'>Last hour</option>
            <option value='24h'>Last 24 hours</option>
            <option value='7d'>Last 7 days</option>
            <option value='30d'>Last 30 days</option>
          </select>
          <Button onClick={loadSecurityData} variant='outline' size='sm'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Security Score */}
      {securityData.overall && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Shield className='h-5 w-5 mr-2' />
              Overall Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div
                  className={`text-4xl font-bold ${
                    getSecurityLevelColor(securityData.overall.level).split(
                      ' '
                    )[0]
                  }`}
                >
                  {securityData.overall.score}%
                </div>
                <div>
                  <Badge
                    className={getSecurityLevelColor(
                      securityData.overall.level
                    )}
                  >
                    {securityData.overall.level.toUpperCase()}
                  </Badge>
                  <p className='text-sm text-gray-600 mt-1'>
                    Security compliance level
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='font-medium'>Encryption</p>
                  <p className='text-gray-600'>
                    {Math.round(securityData.overall.details.encryption * 100)}%
                  </p>
                </div>
                <div>
                  <p className='font-medium'>Consent</p>
                  <p className='text-gray-600'>
                    {Math.round(securityData.overall.details.consent * 100)}%
                  </p>
                </div>
                <div>
                  <p className='font-medium'>Retention</p>
                  <p className='text-gray-600'>
                    {securityData.overall.details.retention} policies
                  </p>
                </div>
                <div>
                  <p className='font-medium'>Audit</p>
                  <p className='text-gray-600'>
                    {securityData.overall.details.audit} events
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Systems Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Data Encryption */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <Lock className='h-4 w-4 mr-2' />
              Data Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {securityData.encryption
                ? Math.round(securityData.encryption.successRate * 100)
                : 0}
              %
            </div>
            <p className='text-xs text-gray-600'>Success Rate</p>
            <div className='mt-2 text-xs'>
              <p>
                Encryptions: {securityData.encryption?.totalEncryptions || 0}
              </p>
              <p>
                Decryptions: {securityData.encryption?.totalDecryptions || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <User className='h-4 w-4 mr-2' />
              Consent Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {securityData.consent
                ? Math.round(securityData.consent.consentRate * 100)
                : 0}
              %
            </div>
            <p className='text-xs text-gray-600'>Consent Rate</p>
            <div className='mt-2 text-xs'>
              <p>Granted: {securityData.consent?.grantedConsents || 0}</p>
              <p>Withdrawn: {securityData.consent?.withdrawnConsents || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <Clock className='h-4 w-4 mr-2' />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {securityData.retention?.policies || 0}
            </div>
            <p className='text-xs text-gray-600'>Active Policies</p>
            <div className='mt-2 text-xs'>
              <p>Deleted: {securityData.retention?.deletedRecords || 0}</p>
              <p>Archived: {securityData.retention?.archivedRecords || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logging */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center'>
              <Eye className='h-4 w-4 mr-2' />
              Audit Logging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {securityData.audit?.totalEvents || 0}
            </div>
            <p className='text-xs text-gray-600'>Total Events</p>
            <div className='mt-2 text-xs'>
              <p>Failed: {securityData.audit?.failedEvents || 0}</p>
              <p>
                Categories:{' '}
                {Object.keys(securityData.audit?.eventsByCategory || {}).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Information */}
      <Tabs defaultValue='encryption' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='encryption'>Encryption</TabsTrigger>
          <TabsTrigger value='consent'>Consent</TabsTrigger>
          <TabsTrigger value='retention'>Retention</TabsTrigger>
          <TabsTrigger value='audit'>Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value='encryption' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Data Encryption Statistics</CardTitle>
              <CardDescription>
                Encryption and decryption performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {securityData.encryption ? (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Performance</h4>
                    <p className='text-sm'>
                      Avg Encryption:{' '}
                      {formatDuration(
                        securityData.encryption.averageEncryptionTime
                      )}
                    </p>
                    <p className='text-sm'>
                      Avg Decryption:{' '}
                      {formatDuration(
                        securityData.encryption.averageDecryptionTime
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>Success Rates</h4>
                    <p className='text-sm'>
                      Encryption:{' '}
                      {Math.round(securityData.encryption.successRate * 100)}%
                    </p>
                    <p className='text-sm'>
                      Decryption:{' '}
                      {Math.round(
                        securityData.encryption.decryptionSuccessRate * 100
                      )}
                      %
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>No encryption data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='consent' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>
                User consent tracking and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {securityData.consent ? (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Consent Statistics</h4>
                    <p className='text-sm'>
                      Total Consents: {securityData.consent.totalConsents}
                    </p>
                    <p className='text-sm'>
                      Granted: {securityData.consent.grantedConsents}
                    </p>
                    <p className='text-sm'>
                      Denied: {securityData.consent.deniedConsents}
                    </p>
                    <p className='text-sm'>
                      Withdrawn: {securityData.consent.withdrawnConsents}
                    </p>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>System Status</h4>
                    <p className='text-sm'>
                      Active Consents: {securityData.consent.activeConsents}
                    </p>
                    <p className='text-sm'>
                      Consent Types: {securityData.consent.consentTypes}
                    </p>
                    <p className='text-sm'>
                      Policies: {securityData.consent.policies}
                    </p>
                    <p className='text-sm'>
                      Templates: {securityData.consent.templates}
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>No consent data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='retention' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
              <CardDescription>
                Automated data lifecycle management
              </CardDescription>
            </CardHeader>
            <CardContent>
              {securityData.retention ? (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Policy Statistics</h4>
                    <p className='text-sm'>
                      Total Policies: {securityData.retention.policies}
                    </p>
                    <p className='text-sm'>
                      Rules: {securityData.retention.rules}
                    </p>
                    <p className='text-sm'>
                      Categories: {securityData.retention.categories}
                    </p>
                    <p className='text-sm'>
                      Last Cleanup:{' '}
                      {securityData.retention.lastCleanupRun
                        ? new Date(
                            securityData.retention.lastCleanupRun
                          ).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>Data Processing</h4>
                    <p className='text-sm'>
                      Total Records: {securityData.retention.totalRecords}
                    </p>
                    <p className='text-sm'>
                      Deleted: {securityData.retention.deletedRecords}
                    </p>
                    <p className='text-sm'>
                      Archived: {securityData.retention.archivedRecords}
                    </p>
                    <p className='text-sm'>
                      Anonymized: {securityData.retention.anonymizedRecords}
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>No retention data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='audit' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Security event monitoring and compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Search className='h-4 w-4' />
                  <input
                    type='text'
                    placeholder='Search audit logs...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='flex-1 px-3 py-1 border rounded-md text-sm'
                  />
                  <select
                    value={filterSeverity}
                    onChange={e => setFilterSeverity(e.target.value)}
                    className='px-3 py-1 border rounded-md text-sm'
                  >
                    <option value='all'>All Severities</option>
                    <option value='critical'>Critical</option>
                    <option value='high'>High</option>
                    <option value='medium'>Medium</option>
                    <option value='low'>Low</option>
                  </select>
                </div>

                {securityData.audit ? (
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <h4 className='font-medium mb-2'>Event Statistics</h4>
                      <p className='text-sm'>
                        Total Events: {securityData.audit.totalEvents}
                      </p>
                      <p className='text-sm'>
                        Failed Events: {securityData.audit.failedEvents}
                      </p>
                      <p className='text-sm'>
                        Avg Event Size:{' '}
                        {formatBytes(securityData.audit.averageEventSize)}
                      </p>
                      <p className='text-sm'>
                        Last Event:{' '}
                        {securityData.audit.lastEventTime
                          ? new Date(
                              securityData.audit.lastEventTime
                            ).toLocaleString()
                          : 'Never'}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Events by Category</h4>
                      {Object.entries(
                        securityData.audit.eventsByCategory || {}
                      ).map(([category, count]) => (
                        <p key={category} className='text-sm'>
                          {category}: {count}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className='text-gray-500'>No audit data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
          <CardDescription>
            Quick actions for security management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-2' />
              Export Security Report
            </Button>
            <Button variant='outline' size='sm'>
              <Settings className='h-4 w-4 mr-2' />
              Security Settings
            </Button>
            <Button variant='outline' size='sm'>
              <AlertTriangle className='h-4 w-4 mr-2' />
              View Alerts
            </Button>
            <Button variant='outline' size='sm'>
              <CheckCircle className='h-4 w-4 mr-2' />
              Run Compliance Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
