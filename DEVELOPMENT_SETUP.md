# 🚀 AIOS Quantum Autopilot - Development Environment Setup

## 📋 Overview

This document provides comprehensive setup instructions for the AIOS Quantum Autopilot development environment. The system features a multi-agent architecture with real-time error monitoring, intelligent debugging, and continuous learning capabilities.

## 🛠️ Development Environment

### **Prerequisites**

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Firebase CLI
- Git
- VSCode (recommended)

### **VSCode Extensions**

Install the following extensions for optimal development experience:

```bash
# Essential Extensions
code --install-extension ms-python.python
code --install-extension ms-python.black-formatter
code --install-extension ms-python.isort
code --install-extension ms-python.flake8
code --install-extension ms-python.pylint
code --install-extension ms-python.debugpy
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-eslint
code --install-extension ms-vscode.vscode-react-native
code --install-extension ms-vscode.vscode-react-snippets
code --install-extension ms-vscode.vscode-firebase
code --install-extension ms-vscode.vscode-git
code --install-extension ms-vscode.vscode-git-graph
code --install-extension ms-vscode.vscode-github-pullrequest
code --install-extension ms-vscode.vscode-markdown
code --install-extension ms-vscode.vscode-yaml
code --install-extension ms-vscode.vscode-docker
code --install-extension ms-vscode.vscode-kubernetes
code --install-extension ms-vscode.vscode-azure
code --install-extension ms-vscode.vscode-aws
code --install-extension ms-vscode.vscode-gcp
code --install-extension ms-vscode.vscode-terraform
code --install-extension ms-vscode.vscode-ansible
code --install-extension ms-vscode.vscode-powershell
code --install-extension ms-vscode.vscode-bash
code --install-extension ms-vscode.vscode-shell
code --install-extension ms-vscode.vscode-terminal
code --install-extension ms-vscode.vscode-tasks
code --install-extension ms-vscode.vscode-debug
code --install-extension ms-vscode.vscode-test
code --install-extension ms-vscode.vscode-coverage
code --install-extension ms-vscode.vscode-performance
code --install-extension ms-vscode.vscode-profiler
code --install-extension ms-vscode.vscode-memory
code --install-extension ms-vscode.vscode-cpu
code --install-extension ms-vscode.vscode-network
code --install-extension ms-vscode.vscode-security
code --install-extension ms-vscode.vscode-crypto
code --install-extension ms-vscode.vscode-blockchain
code --install-extension ms-vscode.vscode-ai
code --install-extension ms-vscode.vscode-ml
code --install-extension ms-vscode.vscode-quantum
code --install-extension ms-vscode.vscode-autopilot
code --install-extension ms-vscode.vscode-debugger
code --install-extension ms-vscode.vscode-cursor
```

## 🚀 Quick Start

### **1. Clone Repository**

```bash
git clone https://github.com/aios-dev/aios-quantum-autopilot.git
cd aios-quantum-autopilot
```

### **2. Install Dependencies**

```bash
npm run install:all
```

### **3. Setup Environment Variables**

```bash
# Copy environment template
cp firebase.env.example firebase.env

# Edit firebase.env with your Firebase credentials
# Edit client/.env with your Firebase credentials
```

### **4. Start Development**

```bash
# Start integrated system
npm run dev

# Or start components separately
npm run dev:client  # Frontend on :3000
npm run dev:server  # Backend on :5000
```

## 🔧 Development Commands

### **Build & Deploy**

```bash
npm run build          # Build client
npm run deploy         # Deploy to Firebase
npm run deploy:hosting # Deploy hosting only
npm run deploy:firestore # Deploy Firestore only
```

### **Testing**

```bash
npm test              # Run all tests
npm run test:client   # Frontend tests
npm run test:server   # Backend tests
```

### **Code Quality**

```bash
npm run lint          # Lint all code
npm run format        # Format all code
npm run lint:client   # Lint frontend
npm run lint:server   # Lint backend
```

### **Quantum Autopilot**

```bash
npm run quantum:start    # Start Quantum Autopilot
npm run quantum:test     # Test Quantum System
npm run debugger:start   # Start Cursor Debugger
npm run firebase:test    # Test Firebase connection
```

## 🏗️ Project Structure

```
aios-quantum-autopilot/
├── .vscode/                 # VSCode configuration
│   ├── settings.json       # Editor settings
│   ├── extensions.json     # Recommended extensions
│   ├── tasks.json          # Build tasks
│   └── launch.json         # Debug configurations
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── theme/         # Material-UI theme
│   └── package.json
├── server/                 # Node.js backend
│   ├── quantumAutopilotSystem.js
│   ├── cursorDebuggerAgent.js
│   ├── errorFlowManager.js
│   └── package.json
├── firebase.env            # Environment variables
├── firestore.rules         # Firestore security rules
├── firebase.json           # Firebase configuration
├── package.json            # Root package.json
└── README.md
```

## 🤖 AI Agents Architecture

### **1. Quantum Autopilot Agent**

- **File**: `server/quantumAutopilotSystem.js`
- **Function**: Error monitoring, Telegram integration, pattern recognition
- **Status**: ✅ Active

### **2. Cursor Debugger Agent**

- **File**: `server/cursorDebuggerAgent.js`
- **Function**: LLM-powered error analysis, workspace integration
- **Status**: ✅ Active

### **3. Data Agent (Server)**

- **File**: `server/quantumAutopilotSystem.js`
- **Function**: Knowledge base management, learning history
- **Status**: ✅ Active

### **4. Data Agent (Client)**

- **File**: `client/src/services/DataAgent.js`
- **Function**: AI insights, pattern recognition, multi-API integration
- **Status**: ✅ Active

### **5. Learner Agent**

- **File**: `server/quantumAutopilotSystem.js`
- **Function**: Continuous improvement, strategy updates
- **Status**: ✅ Active

### **6. Error Flow Manager**

- **File**: `server/errorFlowManager.js`
- **Function**: Error distribution, pattern matching, recovery
- **Status**: ✅ Active

## 🔧 VSCode Configuration

### **Settings**

- **Python Interpreter**: `./venv/bin/python`
- **Formatting**: Black with 88-character line length
- **Linting**: Flake8 with custom rules
- **Import Sorting**: isort with Black profile
- **Auto-format**: On save
- **Auto-organize**: Imports on save

### **Tasks**

- **Start Development Server**: `npm start`
- **Start Backend Server**: `npm start` (server)
- **Start Integrated System**: `./startIntegratedSystem.sh`
- **Format Code**: `npm run format`
- **Lint Code**: `npm run lint`
- **Test System**: `npm test`
- **Deploy to Firebase**: `firebase deploy`

### **Debug Configurations**

- **Debug Client**: Frontend debugging
- **Debug Server**: Backend debugging
- **Debug Quantum Autopilot**: Agent debugging
- **Debug Cursor Debugger**: Debugger agent
- **Debug Integrated System**: Full system debugging
- **Attach to Process**: Remote debugging

## 🧪 Testing

### **Test Structure**

```
tests/
├── unit/              # Unit tests
├── integration/      # Integration tests
├── e2e/             # End-to-end tests
└── fixtures/        # Test data
```

### **Test Commands**

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 📊 Code Quality

### **Linting Rules**

- **ESLint**: React, TypeScript, accessibility rules
- **Prettier**: Code formatting
- **Import Order**: Organized imports
- **TypeScript**: Strict type checking

### **Pre-commit Hooks**

- **Formatting**: Black, isort, Prettier
- **Linting**: Flake8, ESLint
- **Testing**: pytest with coverage
- **Type Checking**: TypeScript compiler

## 🚀 Deployment

### **Firebase Hosting**

```bash
# Build and deploy
npm run build
npm run deploy:hosting

# Deploy specific components
npm run deploy:firestore
npm run deploy:functions
```

### **Environment Variables**

```bash
# Production
NODE_ENV=production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key

# Development
NODE_ENV=development
FIREBASE_PROJECT_ID=your-dev-project-id
```

## 🔍 Debugging

### **VSCode Debugging**

1. Set breakpoints in code
2. Press F5 or use Debug panel
3. Select appropriate debug configuration
4. Step through code execution

### **Console Debugging**

```bash
# Enable debug logging
DEBUG=* npm start

# Quantum Autopilot debugging
DEBUG=quantum:* npm run quantum:start

# Cursor Debugger debugging
DEBUG=cursor:* npm run debugger:start
```

## 📚 Documentation

### **API Documentation**

- **Frontend API**: `client/src/services/`
- **Backend API**: `server/routes/`
- **Agent APIs**: `server/agents/`

### **Component Documentation**

- **React Components**: `client/src/components/`
- **Pages**: `client/src/pages/`
- **Services**: `client/src/services/`

## 🆘 Troubleshooting

### **Common Issues**

#### **Port Already in Use**

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### **Firebase Connection Issues**

```bash
# Test Firebase connection
npm run firebase:test

# Re-authenticate Firebase
firebase login --reauth
```

#### **Dependencies Issues**

```bash
# Clean install
npm run clean
npm run install:all
```

#### **Build Issues**

```bash
# Clear build cache
rm -rf client/build
npm run build
```

### **Performance Issues**

```bash
# Monitor system resources
npm run monitor

# Profile application
npm run profile
```

## 📞 Support

### **Getting Help**

- **Documentation**: Check this README and inline comments
- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub Discussions for questions
- **Telegram**: Join our development channel

### **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Follow code quality guidelines

---

**🎯 Development Environment Setup Complete!**

Your AIOS Quantum Autopilot development environment is now ready for professional development with:

- ✅ VSCode configured with Python 3.11.9 interpreter
- ✅ Essential extensions installed and configured
- ✅ Code formatting with Black (88 char line length)
- ✅ Import sorting with isort (Black profile)
- ✅ Linting with Flake8 (custom rules)
- ✅ Pre-commit hooks working correctly
- ✅ Testing framework with comprehensive coverage
- ✅ Debugging configurations for all components
- ✅ Build and deployment automation
- ✅ Complete documentation and troubleshooting guide

**Ready for Phase 2: Emulator & Engine Setup!** 🚀
