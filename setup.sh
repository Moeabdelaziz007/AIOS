#!/bin/bash

# 🚀 AIOS Quick Start Script
# This script helps you get everything running from one place

echo "🚀 AIOS Unified Workspace Setup"
echo "================================"

# Check if we're in the right directory
if [ ! -f "workspace.code-workspace" ]; then
    echo "❌ Error: Please run this script from the AIOS root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected: /Users/cryptojoker710/Desktop/AIOS"
    exit 1
fi

echo "✅ Found workspace configuration"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo ""
echo "🔍 Checking required tools..."

if command_exists node; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if command_exists npm; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

if command_exists firebase; then
    echo "✅ Firebase CLI: $(firebase --version)"
else
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install && cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "🚀 Quick Commands:"
echo "   npm run dev          # Start both frontend and backend"
echo "   npm run build        # Build frontend"
echo "   npm test             # Run all tests"
echo "   npm run firebase:deploy # Deploy to Firebase"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Firebase Console: https://console.firebase.google.com/project/aios-97581"
echo ""
echo "📁 Open workspace in Cursor:"
echo "   cursor workspace.code-workspace"
echo ""
echo "Ready to develop! 🚀"
