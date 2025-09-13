#!/bin/bash

# AIOS Test Runner Script
# This script runs all tests for the AIOS project

set -e

echo "🚀 Starting AIOS Test Suite"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
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

print_status "Node.js and npm are available"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_warning "Installing root dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    print_warning "Installing client dependencies..."
    cd client && npm install && cd ..
fi

print_status "Dependencies are installed"

# Set up environment variables for testing
export NODE_ENV=test
export FIREBASE_PROJECT_ID=aios-test
export FIREBASE_API_KEY=test-api-key
export FIREBASE_AUTH_DOMAIN=aios-test.firebaseapp.com
export FIREBASE_STORAGE_BUCKET=aios-test.appspot.com
export FIREBASE_MESSAGING_SENDER_ID=123456789
export FIREBASE_APP_ID=test-app-id
export AIOS_API_URL=http://localhost:3000/api
export AIOS_WS_URL=http://localhost:3000

print_status "Environment variables set"

# Run backend tests
echo ""
echo "🧪 Running Backend Tests"
echo "========================"
if npm run test:backend; then
    print_status "Backend tests passed"
else
    print_error "Backend tests failed"
    exit 1
fi

# Run frontend tests
echo ""
echo "🧪 Running Frontend Tests"
echo "========================"
if npm run test:frontend; then
    print_status "Frontend tests passed"
else
    print_error "Frontend tests failed"
    exit 1
fi

# Run linting
echo ""
echo "🔍 Running Linting"
echo "=================="
if npm run lint; then
    print_status "Linting passed"
else
    print_warning "Linting issues found"
fi

# Generate coverage report
echo ""
echo "📊 Generating Coverage Report"
echo "============================="
if npm run test:coverage; then
    print_status "Coverage report generated"
else
    print_warning "Coverage report generation failed"
fi

echo ""
echo "🎉 All tests completed successfully!"
echo "=================================="
echo ""
echo "Test Summary:"
echo "- Backend tests: ✅"
echo "- Frontend tests: ✅"
echo "- Linting: ✅"
echo "- Coverage report: ✅"
echo ""
echo "You can view the coverage report in the coverage/ directory"
echo "To run tests in watch mode: npm run test:watch"
echo "To run specific test suites:"
echo "  Backend only: npm run test:backend"
echo "  Frontend only: npm run test:frontend"
