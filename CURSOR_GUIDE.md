# 🎯 Cursor Guide for AIOS Project

## 📋 Project Overview

Your AIOS (AI Operating System) project is now fully set up with:
- ✅ **Backend API** (Node.js/Express) with Firebase integration
- ✅ **Frontend** (React) with Material-UI components
- ✅ **Comprehensive Testing** (Jest + React Testing Library)
- ✅ **Firebase Integration** (Firestore, Hosting, Authentication ready)
- ✅ **Complete Documentation** and guides

## 🚀 Getting Started in Cursor

### 1. **Open Project in Cursor**
```bash
# Navigate to your project
cd /Users/cryptojoker710/Desktop/AIOS

# Open in Cursor
cursor .
```

### 2. **Project Structure**
```
AIOS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Apps, Settings
│   │   ├── services/      # API & Firebase services
│   │   └── __tests__/     # Frontend tests
│   └── package.json
├── server/                 # Node.js Backend
│   ├── index.js           # Main server file
│   └── tests/             # Backend tests
├── docs/                   # Documentation
├── firebase.json          # Firebase configuration
├── .firebaserc            # Firebase project ID
└── package.json           # Root package.json
```

## 🔧 Essential Cursor Commands

### **Terminal Commands**
```bash
# Install dependencies (if needed)
npm run install:all

# Start development server
npm run dev

# Start frontend only
cd client && npm start

# Run all tests
./run-tests.sh

# Run specific tests
npm run test:backend
npm run test:frontend
```

### **Firebase Commands**
```bash
# Check Firebase status
firebase use

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View Firestore data
firebase firestore:get
```

## 📁 Key Files to Work With

### **Frontend Components**
- `client/src/pages/Dashboard.js` - Main dashboard
- `client/src/pages/Apps.js` - App management
- `client/src/pages/Settings.js` - Settings page
- `client/src/services/api.js` - API service layer

### **Backend API**
- `server/index.js` - Main server with all API endpoints
- `server/tests/api.test.js` - Backend tests

### **Configuration**
- `firebase.json` - Firebase hosting config
- `firestore.rules` - Database security rules
- `firebase.env` - Environment variables template

## 🧪 Testing in Cursor

### **Run Tests**
```bash
# All tests
npm test

# Backend only
npm run test:backend

# Frontend only
npm run test:frontend

# Watch mode (re-runs on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### **Test Files**
- `server/tests/api.test.js` - Backend API tests
- `client/src/__tests__/Dashboard.test.js` - Dashboard tests
- `client/src/__tests__/Apps.test.js` - Apps management tests
- `client/src/__tests__/Settings.test.js` - Settings tests

## 🔥 Firebase Integration

### **Current Setup**
- **Project ID**: `aios-97581`
- **Hosting**: Configured for `client/build`
- **Firestore**: Security rules ready
- **Authentication**: Ready to enable

### **Environment Variables**
Copy `firebase.env` to `.env` and add your Firebase credentials:
```bash
cp firebase.env .env
```

### **Firebase Console**
Visit: https://console.firebase.google.com/project/aios-97581

## 🎨 Development Workflow

### **1. Start Development**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd client && npm start
```

### **2. Make Changes**
- Edit components in `client/src/pages/`
- Modify API in `server/index.js`
- Update tests as needed

### **3. Test Changes**
```bash
# Run tests
npm test

# Check linting
npm run lint
```

### **4. Deploy**
```bash
# Build frontend
npm run build

# Deploy to Firebase
firebase deploy
```

## 🔍 Debugging in Cursor

### **Frontend Debugging**
- Use React Developer Tools
- Check browser console
- Use `console.log()` in components
- Test components individually

### **Backend Debugging**
- Use Node.js debugger
- Check server logs
- Test API endpoints with Postman/curl
- Use `console.log()` in server code

### **Firebase Debugging**
```bash
# Check Firebase status
firebase use

# View logs
firebase functions:log

# Test Firestore rules
firebase firestore:rules:test
```

## 📊 Available API Endpoints

### **Apps Management**
- `GET /api/apps` - Get all apps
- `GET /api/apps/:id` - Get single app
- `POST /api/apps` - Create new app
- `PUT /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app

### **System Management**
- `GET /api/system/status` - System status
- `GET /api/system/logs` - System logs
- `POST /api/system/logs` - Create log
- `GET /api/health` - Health check
- `GET /api/config` - Configuration

## 🎯 Common Tasks

### **Add New Feature**
1. Create component in `client/src/pages/`
2. Add API endpoint in `server/index.js`
3. Write tests for both
4. Update documentation

### **Fix Bug**
1. Run tests to identify issue
2. Check console logs
3. Use debugger
4. Write test for fix
5. Update tests

### **Deploy Changes**
1. Test locally
2. Run all tests
3. Build frontend
4. Deploy to Firebase

## 🔐 Security Considerations

### **Environment Variables**
- Never commit `.env` file
- Use `firebase.env` as template
- Keep Firebase keys secure

### **Firestore Rules**
- Review `firestore.rules`
- Test rules before deploying
- Use authentication for sensitive data

### **API Security**
- Validate all inputs
- Use proper error handling
- Implement rate limiting (future)

## 📚 Documentation Files

- `FIREBASE_SETUP_GUIDE.md` - Firebase setup guide
- `IMPLEMENTATION_SUMMARY.md` - Project overview
- `docs/TESTING_GUIDE.md` - Testing documentation
- `docs/IMPROVEMENT_PLAN.md` - Future improvements
- `docs/TESTING_STRATEGY.md` - Testing strategy

## 🚀 Next Steps

### **Immediate**
1. Set up Firebase credentials in `.env`
2. Run tests to verify everything works
3. Start development server
4. Begin customizing features

### **Short Term**
1. Add authentication system
2. Implement real-time features
3. Add more app management features
4. Improve UI/UX

### **Long Term**
1. Add AI model integration
2. Implement advanced analytics
3. Add mobile support
4. Scale infrastructure

## 💡 Tips for Cursor

### **Productivity**
- Use Cursor's AI features for code generation
- Use IntelliSense for autocomplete
- Use integrated terminal for commands
- Use file explorer for navigation

### **Debugging**
- Use breakpoints in Cursor
- Use integrated debugger
- Use console for logging
- Use test runner for validation

### **Collaboration**
- Use Git integration
- Use Cursor's sharing features
- Use comments for documentation
- Use version control

---

**Your AIOS project is ready for development in Cursor!** 🎉

Start by running `npm run dev` and `cd client && npm start` to see your application in action.
