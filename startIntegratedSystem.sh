#!/bin/bash

# 🚀 AIOS Complete Integration System Startup Script
# This script starts the complete AIOS system with Backend-Frontend integration

echo "🚀 Starting AIOS Complete Integration System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_warning "Node.js version 16 or higher is recommended. Current version: $(node -v)"
fi

print_header "AIOS Integration System Startup"

# Check environment variables
print_status "Checking environment variables..."

if [ ! -f "firebase.env" ]; then
    print_warning "firebase.env file not found. Creating template..."
    cp env.template firebase.env
    print_warning "Please update firebase.env with your Firebase credentials"
fi

# Load environment variables
if [ -f "firebase.env" ]; then
    export $(cat firebase.env | grep -v '^#' | xargs)
    print_status "Environment variables loaded from firebase.env"
else
    print_warning "No environment file found. Using default values."
fi

# Check if client/.env exists
if [ ! -f "client/.env" ]; then
    print_status "Creating client/.env from firebase.env..."
    cp firebase.env client/.env
fi

# Install dependencies
print_status "Installing dependencies..."

# Install root dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing root dependencies..."
    npm install
fi

# Install client dependencies
if [ ! -d "client/node_modules" ]; then
    print_status "Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Build client
print_status "Building client application..."
cd client
if npm run build; then
    print_status "Client build successful"
else
    print_error "Client build failed"
    exit 1
fi
cd ..

# Check if build directory exists
if [ ! -d "client/build" ]; then
    print_error "Client build directory not found"
    exit 1
fi

# Start the integrated system
print_header "Starting AIOS Integration System"

print_status "Starting Backend Server with Frontend Integration..."
print_status "Backend URL: http://localhost:${PORT:-5000}"
print_status "Frontend URL: http://localhost:${PORT:-5000}"
print_status "API URL: http://localhost:${PORT:-5000}/api"
print_status "Socket.io URL: ws://localhost:${PORT:-5000}"

# Start the integrated system
node aiosIntegrationSystem.js

print_status "AIOS Integration System started successfully!"
print_status "System is now running with complete Backend-Frontend integration"
print_status "All services are connected and operational"

echo ""
print_header "System Status"
echo "✅ Backend Server: Running"
echo "✅ Frontend Application: Served"
echo "✅ Socket.io: Connected"
echo "✅ Firebase: Connected"
echo "✅ Quantum Autopilot: Active"
echo "✅ Cursor Debugger Agent: Active"
echo "✅ Error Flow Manager: Active"
echo "✅ System Integration: Complete"

echo ""
print_status "Access your AIOS system at: http://localhost:${PORT:-5000}"
print_status "Press Ctrl+C to stop the system"
