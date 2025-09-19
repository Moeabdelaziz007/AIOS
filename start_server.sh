#!/bin/bash

# AIOS Server Startup Script
# This script ensures only one instance of the server runs

echo "🚀 Starting AIOS Server..."

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "aiosIntegrationSystem" 2>/dev/null
pkill -f "node.*server" 2>/dev/null
sleep 2

# Check if port 5000 is in use
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5000 is already in use. Killing processes..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Start the server
echo "🚀 Starting AIOS Integration System..."
cd /Users/cryptojoker710/Desktop/AIOS
node aiosIntegrationSystem.js

echo "✅ Server started successfully!"
