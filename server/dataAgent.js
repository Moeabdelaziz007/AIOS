/**
 * 🧠 Data Agent - Knowledge Base Manager
 *
 * Responsibilities:
 * - Store error patterns and successful fixes
 * - Enable fast retrieval via embeddings
 * - Support similarity-based recall for related errors
 * - Maintain learning history and patterns
 */

class DataAgent {
  constructor() {
    this.knowledgeBase = new Map();
    this.errorPatterns = new Map();
    this.fixPatterns = new Map();
    this.learningHistory = [];

    console.log('🧠 Data Agent initialized');
  }

  // Store error-fix pair
  storeErrorFix(errorSignature, fix, success) {
    const record = {
      errorSignature,
      fix,
      success,
      timestamp: new Date(),
      usageCount: 1,
    };

    this.knowledgeBase.set(errorSignature, record);
    this.errorPatterns.set(errorSignature, {
      pattern: errorSignature,
      frequency: 1,
      lastSeen: new Date(),
    });

    if (success) {
      this.fixPatterns.set(fix, {
        fix,
        successRate: 1.0,
        usageCount: 1,
        lastUsed: new Date(),
      });
    }

    this.learningHistory.push(record);
    console.log(`📚 Stored error-fix pattern: ${errorSignature}`);
  }

  // Retrieve similar error patterns
  retrieveSimilarErrors(errorSignature, threshold = 0.8) {
    const similar = [];

    for (const [pattern, data] of this.errorPatterns.entries()) {
      const similarity = this.calculateSimilarity(errorSignature, pattern);
      if (similarity >= threshold) {
        similar.push({
          pattern,
          similarity,
          data,
          fix: this.knowledgeBase.get(pattern)?.fix,
        });
      }
    }

    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  // Calculate similarity between error signatures
  calculateSimilarity(sig1, sig2) {
    // Simple similarity calculation based on common words
    const words1 = sig1.toLowerCase().split(/\s+/);
    const words2 = sig2.toLowerCase().split(/\s+/);

    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;

    return commonWords.length / totalWords;
  }

  // Get learning statistics
  getLearningStats() {
    return {
      totalPatterns: this.knowledgeBase.size,
      errorPatterns: this.errorPatterns.size,
      fixPatterns: this.fixPatterns.size,
      learningHistory: this.learningHistory.length,
      averageSuccessRate: this.calculateAverageSuccessRate(),
    };
  }

  // Calculate average success rate
  calculateAverageSuccessRate() {
    if (this.learningHistory.length === 0) return 0;

    const successfulFixes = this.learningHistory.filter(
      record => record.success
    );
    return successfulFixes.length / this.learningHistory.length;
  }

  // Get most common error patterns
  getMostCommonErrors(limit = 10) {
    const sorted = Array.from(this.errorPatterns.entries())
      .sort((a, b) => b[1].frequency - a[1].frequency)
      .slice(0, limit);

    return sorted.map(([pattern, data]) => ({
      pattern,
      frequency: data.frequency,
      lastSeen: data.lastSeen,
      fix: this.knowledgeBase.get(pattern)?.fix,
    }));
  }

  // Update pattern frequency
  updatePatternFrequency(errorSignature) {
    if (this.errorPatterns.has(errorSignature)) {
      const pattern = this.errorPatterns.get(errorSignature);
      pattern.frequency += 1;
      pattern.lastSeen = new Date();
    } else {
      this.errorPatterns.set(errorSignature, {
        pattern: errorSignature,
        frequency: 1,
        lastSeen: new Date(),
      });
    }
  }

  // Clear old patterns (cleanup)
  clearOldPatterns(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let removedCount = 0;

    for (const [pattern, data] of this.errorPatterns.entries()) {
      if (data.lastSeen < cutoffDate) {
        this.errorPatterns.delete(pattern);
        this.knowledgeBase.delete(pattern);
        removedCount++;
      }
    }

    console.log(`🧹 Cleaned up ${removedCount} old patterns`);
    return removedCount;
  }
}

module.exports = DataAgent;
