# AIOS - Production Ready Configuration

## 🚀 Quick Start

1. **Copy environment template:**
   ```bash
   cp env.template .env
   ```

2. **Fill in your Firebase credentials in `.env`**

3. **Install dependencies:**
   ```bash
   npm run install:all
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## 📋 Required Environment Variables

### Firebase Configuration
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=aios-97581.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aios-97581
VITE_FIREBASE_STORAGE_BUCKET=aios-97581.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Server Configuration
```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 🛠️ Development Commands

### **Testing**
```bash
npm run test:server      # Backend tests only
npm run test:client      # Frontend tests only
npm run test:integration # Integration tests
npm run test:ci          # All tests for CI
```

### **Linting & Formatting**
```bash
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues
npm run lint:check       # Strict linting (no warnings)
npm run format           # Format code with Prettier
```

### **Building**
```bash
npm run build:client     # Build React app
npm run build:server     # Build server
npm run build            # Build everything
```

### **Firebase**
```bash
npm run firebase:deploy           # Deploy everything
npm run firebase:deploy:hosting   # Deploy frontend only
npm run firebase:deploy:firestore # Deploy database only
npm run firebase:emulators        # Start local emulators
```

## 🔧 Troubleshooting

### **Common Issues:**

1. **Port conflicts:**
   ```bash
   lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
   lsof -ti:5000 | xargs kill -9  # Kill process on port 5000
   ```

2. **Permission errors:**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

3. **Module not found:**
   ```bash
   npm run clean
   npm run fresh-install
   ```

4. **Firebase login issues:**
   ```bash
   firebase logout
   firebase login
   ```

## 📊 Project Structure

```
AIOS/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD pipelines
├── firebase.json           # Firebase configuration
├── firestore.rules         # Database security rules
├── firestore.indexes.json  # Database indexes
├── package.json            # Root package configuration
└── env.template            # Environment variables template
```

## 🚀 Deployment

### **Manual Deployment:**
```bash
npm run build
npm run firebase:deploy
```

### **Automatic Deployment:**
- Push to `main` branch triggers automatic deployment
- CI/CD pipeline runs tests, builds, and deploys
- Check GitHub Actions for deployment status

## 📈 Monitoring

- **Firebase Console**: https://console.firebase.google.com/project/aios-97581
- **App URL**: https://aios-97581.web.app
- **GitHub Actions**: Check repository Actions tab

## 🔒 Security

- Environment variables are not committed to git
- Firebase security rules are deployed
- All API endpoints require authentication
- Rate limiting is configured

## 📚 Documentation

- **Unified Workspace Guide**: `UNIFIED_WORKSPACE_GUIDE.md`
- **Firebase Schema**: `FIREBASE_SCHEMA.md`
- **Power Enhancement Roadmap**: `POWER_ENHANCEMENT_ROADMAP.md`
- **Testing Guide**: `docs/TESTING_GUIDE.md`

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Common Issues & Fixes in `UNIFIED_WORKSPACE_GUIDE.md`
3. Check Firebase Console for errors
4. Review GitHub Actions logs for CI/CD issues
