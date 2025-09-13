# 🚀 AIOS Unified Workspace Guide

## 📁 **Project Structure Overview**

```
AIOS/
├── 📁 client/                 # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI Components
│   │   ├── 📁 pages/         # Page Components (Dashboard, Apps, etc.)
│   │   ├── 📁 services/      # API Services & Data Agent
│   │   └── 📁 __tests__/     # Frontend Tests
│   ├── 📁 public/           # Static Assets
│   └── 📄 package.json       # Frontend Dependencies
│
├── 📁 server/                # Node.js Backend API
│   ├── 📄 index.js           # Main Server File
│   └── 📁 tests/             # Backend Tests
│
├── 📁 docs/                  # Documentation
│   ├── 📄 IMPROVEMENT_PLAN.md
│   ├── 📄 TESTING_STRATEGY.md
│   └── 📄 TESTING_GUIDE.md
│
├── 📁 config/                # Configuration Files
│   └── 📄 firebase.env.template
│
├── 📄 workspace.code-workspace  # VS Code/Cursor Workspace Config
├── 📄 package.json           # Root Package Manager
├── 📄 firebase.json          # Firebase Configuration
├── 📄 firestore.rules        # Database Security Rules
├── 📄 firestore.indexes.json # Database Indexes
├── 📄 AIOS_BLUEPRINT.md      # Technical Blueprint (Gemini)
└── 📄 CURSOR_NOTES.md        # Development Log (Claude ↔ Gemini)
```

## 🛠️ **Unified Development Commands**

### **From Root Directory (`/Users/cryptojoker710/Desktop/AIOS/`):**

```bash
# 📦 Install All Dependencies
npm run install:all

# 🚀 Start Development (Both Frontend & Backend)
npm run dev

# 🏗️ Build Frontend
npm run build:client

# 🧪 Run All Tests
npm test

# 🔥 Deploy to Firebase
npm run firebase:deploy

# 🧹 Clean & Fresh Install
npm run fresh-install
```

### **Individual Commands:**

```bash
# Backend Only
npm run dev:server

# Frontend Only  
npm run dev:client

# Backend Tests
npm run test:backend

# Frontend Tests
npm run test:frontend

# Lint Code
npm run lint
npm run lint:fix
```

## 🎯 **How to Work on All Files from One Place**

### **1. Open Workspace in Cursor:**
```bash
# Open the workspace file
cursor workspace.code-workspace
```

### **2. Use the File Explorer:**
- **Root Level**: All configuration files, documentation
- **Client Folder**: All React frontend code
- **Server Folder**: All Node.js backend code
- **Docs Folder**: All documentation and guides

### **3. Use Integrated Terminal:**
- All commands run from root directory
- Access to all project files
- Unified environment variables

### **4. Use Search Across All Files:**
- Search in entire workspace
- Find references across frontend/backend
- Global find/replace capabilities

## 🔧 **Development Workflow**

### **1. Start Development:**
```bash
npm run dev
```
This starts both:
- Backend server on port 5000
- Frontend React app on port 3000

### **2. Make Changes:**
- Edit any file in `client/src/` for frontend
- Edit any file in `server/` for backend
- Changes auto-reload in development

### **3. Test Changes:**
```bash
npm test
```

### **4. Deploy Changes:**
```bash
npm run firebase:deploy
```

## 📋 **Key Files You Can Edit from One Place**

### **Frontend Files:**
- `client/src/App.js` - Main React app
- `client/src/pages/` - All page components
- `client/src/services/` - API services & Data Agent
- `client/src/components/` - Reusable components

### **Backend Files:**
- `server/index.js` - Main server file
- `server/tests/` - Backend tests

### **Configuration Files:**
- `firebase.json` - Firebase settings
- `firestore.rules` - Database security
- `package.json` - Dependencies & scripts

### **Documentation:**
- `CURSOR_NOTES.md` - Development log
- `AIOS_BLUEPRINT.md` - Technical blueprint
- `docs/` - All guides and plans

## 🚀 **Quick Start Guide**

1. **Open Workspace:**
   ```bash
   cursor workspace.code-workspace
   ```

2. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start Development:**
   ```bash
   npm run dev
   ```

4. **Open Browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

5. **Make Changes:**
   - Edit any file in the workspace
   - Changes auto-reload

6. **Deploy:**
   ```bash
   npm run firebase:deploy
   ```

## 🎉 **Benefits of This Setup**

✅ **One Place for Everything** - All files accessible from root
✅ **Unified Commands** - Run everything from one terminal
✅ **Auto-Reload** - Changes reflect immediately
✅ **Integrated Testing** - Test frontend and backend together
✅ **Easy Deployment** - Deploy everything with one command
✅ **Shared Dependencies** - No duplicate packages
✅ **Workspace Management** - Organized file structure

Now you can work on all files from one unified workspace! 🚀

---

## 🛠️ **Common Issues & Fixes**

### **Firebase Authentication Issues**

#### **Issue**: Firebase login fails with "auth/network-request-failed"
```bash
# Solution 1: Check Firebase configuration
firebase projects:list
firebase use aios-97581

# Solution 2: Verify environment variables
cat .env | grep FIREBASE

# Solution 3: Clear Firebase cache
firebase logout
firebase login
```

#### **Issue**: "Firebase App named '[DEFAULT]' already exists"
```javascript
// Solution: Check for duplicate Firebase initialization
// In client/src/services/FirebaseService.js
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
}
```

#### **Issue**: Firestore permission denied
```bash
# Solution: Update Firestore rules
firebase deploy --only firestore:rules

# Check rules in Firebase Console
# https://console.firebase.google.com/project/aios-97581/firestore/rules
```

### **Port Conflicts**

#### **Issue**: Port 3000 already in use
```bash
# Solution 1: Kill process using port
lsof -ti:3000 | xargs kill -9

# Solution 2: Use different port
cd client && PORT=3001 npm start

# Solution 3: Check what's using the port
lsof -i :3000
```

#### **Issue**: Port 5000 already in use
```bash
# Solution 1: Kill process using port
lsof -ti:5000 | xargs kill -9

# Solution 2: Use different port
PORT=5001 npm run dev:server

# Solution 3: Check Firebase emulator
firebase emulators:stop
```

### **Dependency Issues**

#### **Issue**: npm install fails with permission errors
```bash
# Solution 1: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Solution 2: Use yarn instead
npm install -g yarn
yarn install

# Solution 3: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **Issue**: "Module not found" errors
```bash
# Solution 1: Reinstall dependencies
npm run clean
npm run fresh-install

# Solution 2: Check workspace configuration
npm run install:all

# Solution 3: Verify package.json
npm ls
```

### **Build Issues**

#### **Issue**: React build fails with "Module not found"
```bash
# Solution 1: Check import paths
# Ensure all imports use correct relative paths

# Solution 2: Clear build cache
cd client
rm -rf build node_modules
npm install
npm run build

# Solution 3: Check environment variables
echo $VITE_FIREBASE_API_KEY
```

#### **Issue**: Socket.io connection fails
```bash
# Solution 1: Check server is running
curl http://localhost:5000/api/health

# Solution 2: Verify Socket.io configuration
# Check server/index.js for CORS settings

# Solution 3: Check client Socket.io URL
# Verify REACT_APP_SOCKET_URL in .env
```

### **Testing Issues**

#### **Issue**: Tests fail with Firebase errors
```bash
# Solution 1: Use Firebase emulator for tests
firebase emulators:start --only firestore,auth

# Solution 2: Set test environment variables
export NODE_ENV=test
export FIREBASE_PROJECT_ID=aios-test-project

# Solution 3: Mock Firebase in tests
# Check server/tests/setup.js
```

#### **Issue**: Jest tests timeout
```bash
# Solution 1: Increase timeout
# In jest.config.js:
{
  "testTimeout": 30000
}

# Solution 2: Run tests separately
npm run test:server
npm run test:client

# Solution 3: Check for async/await issues
# Ensure all async operations are properly handled
```

### **Development Environment Issues**

#### **Issue**: Hot reload not working
```bash
# Solution 1: Check file watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Solution 2: Restart development server
npm run dev

# Solution 3: Check for file permission issues
ls -la client/src/
```

#### **Issue**: Environment variables not loading
```bash
# Solution 1: Check .env file location
ls -la .env

# Solution 2: Verify variable naming
# Client variables must start with VITE_
# Server variables don't need prefix

# Solution 3: Restart development server
npm run dev
```

### **Firebase Deployment Issues**

#### **Issue**: Firebase deploy fails
```bash
# Solution 1: Check Firebase login
firebase login --reauth

# Solution 2: Verify project selection
firebase use aios-97581

# Solution 3: Check Firebase configuration
firebase projects:list
cat .firebaserc
```

#### **Issue**: Hosting deploy fails
```bash
# Solution 1: Build client first
npm run build:client

# Solution 2: Check firebase.json
cat firebase.json

# Solution 3: Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore
```

### **Performance Issues**

#### **Issue**: Slow page loads
```bash
# Solution 1: Check bundle size
cd client && npm run build
ls -la build/static/js/

# Solution 2: Enable code splitting
# Check React.lazy() usage

# Solution 3: Optimize images
# Use WebP format, compress images
```

#### **Issue**: Memory leaks
```bash
# Solution 1: Check for event listeners
# Ensure cleanup in useEffect

# Solution 2: Monitor memory usage
node --inspect server/index.js

# Solution 3: Check for circular references
# Use Chrome DevTools Memory tab
```

### **Git & Version Control Issues**

#### **Issue**: Git conflicts
```bash
# Solution 1: Pull latest changes
git pull origin main

# Solution 2: Resolve conflicts manually
git status
git diff

# Solution 3: Reset to clean state
git stash
git pull origin main
git stash pop
```

#### **Issue**: Large file commits
```bash
# Solution 1: Add to .gitignore
echo "node_modules/" >> .gitignore
echo "client/build/" >> .gitignore
echo ".env" >> .gitignore

# Solution 2: Remove from tracking
git rm --cached large-file.js
git commit -m "Remove large file"

# Solution 3: Use Git LFS for large files
git lfs track "*.psd"
git add .gitattributes
```

### **Quick Fix Commands**

```bash
# Reset everything to clean state
npm run clean
npm run fresh-install
npm run dev

# Fix common permission issues
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Clear all caches
npm cache clean --force
firebase logout && firebase login

# Restart all services
pkill -f node
npm run dev

# Check system status
npm run test:ci
firebase projects:list
```

### **Emergency Recovery**

If everything breaks:

```bash
# 1. Backup your work
git add .
git commit -m "Emergency backup"
git push origin main

# 2. Reset to clean state
git clean -fd
rm -rf node_modules client/node_modules
npm install
cd client && npm install

# 3. Restore from backup
git checkout HEAD~1 -- .

# 4. Start fresh
npm run dev
```

### **Getting Help**

- **Firebase Issues**: Check [Firebase Documentation](https://firebase.google.com/docs)
- **React Issues**: Check [React Documentation](https://reactjs.org/docs)
- **Node.js Issues**: Check [Node.js Documentation](https://nodejs.org/docs)
- **Socket.io Issues**: Check [Socket.io Documentation](https://socket.io/docs)

For persistent issues, check the logs:
```bash
# Server logs
npm run dev:server

# Client logs
npm run dev:client

# Firebase logs
firebase functions:log
```
