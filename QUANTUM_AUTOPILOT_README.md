# 🚀 Quantum Autopilot System

A self-healing, learning development environment with real-time error monitoring, intelligent debugging, and continuous improvement.

## 🎯 Overview

The Quantum Autopilot System is a multi-agent architecture that provides:

- **Real-time Error Monitoring** - Captures all system errors, warnings, and logs
- **Intelligent Debugging** - Analyzes errors and suggests/applies fixes automatically
- **Learning Loop** - Stores successful fixes and reuses them for similar errors
- **Telegram Integration** - Sends structured, deduplicated error reports
- **Multi-Agent Collaboration** - Four specialized agents working together

## 🤖 Agents

### 1. Autopilot Agent (Error Monitor)
- **Role**: Captures and reports errors
- **Responsibilities**:
  - Monitor console errors, uncaught exceptions, and unhandled rejections
  - Send structured reports to Telegram with deduplication
  - Prevent spam with intelligent rate limiting
  - Maintain error history and patterns

### 2. Debugger Agent (Fixer)
- **Role**: Analyzes and fixes errors
- **Responsibilities**:
  - Parse error patterns and root causes
  - Suggest or apply fixes automatically
  - Learn from successful and failed fixes
  - Integrate with workspace for code modifications

### 3. Data Agent (Knowledge Base Manager)
- **Role**: Stores and retrieves error-fix patterns
- **Responsibilities**:
  - Store error patterns and successful fixes
  - Enable fast retrieval via signatures
  - Support similarity-based recall for related errors
  - Maintain learning history and patterns

### 4. Learner Agent (Continuous Improver)
- **Role**: Optimizes debugging strategies
- **Responsibilities**:
  - Analyze which fixes worked or failed
  - Update debugging strategies
  - Improve efficiency and reduce duplicate work
  - Provide improvement recommendations

## 🚀 Features

### Error Capture & Processing
- **Loop Protection**: Prevents infinite recursion from Telegram errors
- **Rate Limiting**: Avoids spam by limiting duplicate errors within 30 seconds
- **Queue System**: Batches errors and sends summaries every minute
- **Deduplication**: Groups similar errors and shows counts

### Intelligent Debugging
- **Pattern Recognition**: Identifies common error types (Firebase, Network, Syntax, etc.)
- **Fix Generation**: Creates contextual fixes based on error analysis
- **Success Tracking**: Records fix effectiveness and success rates
- **Workspace Integration**: Scans project structure for context

### Learning & Improvement
- **Knowledge Base**: Stores all error-fix pairs for future reference
- **Success Metrics**: Tracks effectiveness and performance
- **Strategy Updates**: Improves debugging approaches over time
- **Recommendations**: Provides improvement suggestions

### Telegram Integration
- **Structured Reports**: Sends formatted error summaries
- **Command Interface**: Responds to `/status`, `/stats`, `/recommendations`
- **Rate Limit Compliance**: Respects Telegram's API limits
- **Error Categorization**: Groups errors by type and severity

## 📊 System Flow

```
Error Occurs → Autopilot Agent → Queue System → Telegram Summary
                    ↓
            Debugger Agent → Fix Analysis → Data Agent → Learning
                    ↓
            Learner Agent → Strategy Update → Improvement Recommendations
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Telegram Bot Token
- Firebase Project (for Firestore integration)

### Environment Variables
Create `firebase.env` with:
```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here
DEBUGGER_CHAT_ID=your_chat_id_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Installation
```bash
# Install dependencies
npm install

# Install Telegram bot API
npm install node-telegram-bot-api

# Install dotenv for environment variables
npm install dotenv
```

## 🚀 Usage

### Basic Usage
```javascript
const QuantumAutopilotSystem = require('./server/quantumAutopilotSystem');

// Initialize the system
const system = new QuantumAutopilotSystem();

// The system automatically starts monitoring errors
// Errors will be captured, analyzed, and reported to Telegram
```

### Testing
```bash
# Run the test script
node testQuantumSystem.js
```

### Integration with Existing Server
```javascript
// In your server/index.js
const QuantumAutopilotSystem = require('./quantumAutopilotSystem');

// Initialize system
const quantumSystem = new QuantumAutopilotSystem();

// Errors will be automatically captured and processed
```

## 📱 Telegram Commands

- `/status` - Get system status and agent states
- `/stats` - View detailed statistics
- `/recommendations` - Get improvement recommendations

## 🔧 Configuration

### Error Categories
The system automatically categorizes errors:
- **Firebase Permission Error** - Firestore security issues
- **Network Error** - Connection and API issues
- **Syntax Error** - Code syntax problems
- **Type Error** - JavaScript type issues
- **Reference Error** - Undefined variable issues
- **General Error** - Other errors

### Rate Limiting
- **Duplicate Prevention**: Same error within 30 seconds is skipped
- **Queue Processing**: Errors are batched and sent every minute
- **Telegram Limits**: Respects API rate limits (429 errors)

### Severity Levels
- **Critical** - System-breaking errors (10+ occurrences)
- **High** - Important errors (5+ occurrences)
- **Medium** - Moderate errors (2+ occurrences)
- **Low** - Minor errors (1 occurrence)

## 📈 Monitoring & Analytics

### System Statistics
- Total errors captured
- Queue size and processing status
- Critical/recurring/new error counts
- Debugger success rates
- Learning effectiveness metrics

### Performance Metrics
- Error processing time
- Fix application success rate
- Strategy improvement over time
- Agent collaboration efficiency

## 🔄 Learning Loop

1. **Capture** - Error is detected and captured
2. **Analyze** - Debugger agent analyzes the error
3. **Fix** - Fix is generated and applied
4. **Store** - Error-fix pair is stored in knowledge base
5. **Learn** - Learner agent analyzes effectiveness
6. **Improve** - Strategy is updated for future errors

## 🚨 Error Handling

The system includes comprehensive error handling:
- **Loop Protection** - Prevents infinite recursion
- **Rate Limiting** - Avoids API spam
- **Graceful Degradation** - Continues working even if components fail
- **Error Recovery** - Automatically recovers from temporary failures

## 🔮 Future Enhancements

- **Vector Database Integration** - For semantic error similarity
- **LLM Integration** - For more sophisticated error analysis
- **Cursor Workspace API** - For direct code modifications
- **Dashboard Interface** - Web-based monitoring and control
- **Multi-Project Support** - Monitor multiple projects simultaneously

## 📝 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Built with ❤️ for self-healing development environments**
