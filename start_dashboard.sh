#!/bin/bash

# 🎛️ AIOS Full-Stack Dashboard Startup Script
# Comprehensive dashboard system startup and management

echo "🎛️ Starting AIOS Full-Stack Dashboard System..."

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
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
}

# Install dependencies
install_dependencies() {
    print_header "📦 Installing Dependencies..."
    
    # Install server dependencies
    if [ -f "package.json" ]; then
        print_status "Installing server dependencies..."
        npm install
    else
        print_warning "No package.json found in root directory"
    fi
    
    # Install client dependencies
    if [ -d "client" ] && [ -f "client/package.json" ]; then
        print_status "Installing client dependencies..."
        cd client
        npm install
        cd ..
    else
        print_warning "No client directory or package.json found"
    fi
}

# Check environment variables
check_environment() {
    print_header "🔧 Checking Environment Configuration..."
    
    # Check for required environment variables
    if [ -f "firebase.env" ]; then
        print_status "Firebase environment file found"
        source firebase.env
    else
        print_warning "No firebase.env file found"
    fi
    
    # Check for API keys
    if [ -z "$VITE_GEMINI_API_KEY" ]; then
        print_warning "VITE_GEMINI_API_KEY not set"
    else
        print_status "Gemini API key configured"
    fi
    
    if [ -z "$REACT_APP_FIREBASE_API_KEY" ]; then
        print_warning "REACT_APP_FIREBASE_API_KEY not set"
    else
        print_status "Firebase API key configured"
    fi
}

# Start the dashboard API server
start_dashboard_server() {
    print_header "🚀 Starting Dashboard API Server..."
    
    if [ -f "server/dashboardAPI.js" ]; then
        print_status "Starting dashboard API server on port 3001..."
        node server/dashboardAPI.js &
        DASHBOARD_PID=$!
        echo $DASHBOARD_PID > dashboard.pid
        print_status "Dashboard API server started with PID: $DASHBOARD_PID"
    else
        print_error "Dashboard API server file not found"
        exit 1
    fi
}

# Start the main API server
start_main_server() {
    print_header "🌐 Starting Main API Server..."
    
    if [ -f "server/aiosAPIServer.js" ]; then
        print_status "Starting main API server on port 5000..."
        node server/aiosAPIServer.js &
        MAIN_PID=$!
        echo $MAIN_PID > main.pid
        print_status "Main API server started with PID: $MAIN_PID"
    else
        print_warning "Main API server file not found, skipping..."
    fi
}

# Start the client development server
start_client() {
    print_header "💻 Starting Client Development Server..."
    
    if [ -d "client" ]; then
        print_status "Starting React development server..."
        cd client
        npm start &
        CLIENT_PID=$!
        echo $CLIENT_PID > ../client.pid
        cd ..
        print_status "Client development server started with PID: $CLIENT_PID"
    else
        print_warning "Client directory not found, skipping..."
    fi
}

# Wait for servers to start
wait_for_servers() {
    print_header "⏳ Waiting for servers to start..."
    
    # Wait for dashboard server
    print_status "Waiting for dashboard server (port 3001)..."
    for i in {1..30}; do
        if curl -s http://localhost:3001/api/dashboard/health > /dev/null 2>&1; then
            print_status "Dashboard server is ready!"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            print_error "Dashboard server failed to start"
            exit 1
        fi
    done
    
    # Wait for main server
    print_status "Waiting for main server (port 5000)..."
    for i in {1..30}; do
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            print_status "Main server is ready!"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            print_warning "Main server not responding"
        fi
    done
}

# Display dashboard URLs
show_dashboard_urls() {
    print_header "🎛️ Dashboard URLs"
    echo ""
    echo -e "${GREEN}📊 Full-Stack Dashboard:${NC} http://localhost:3000"
    echo -e "${GREEN}📈 Analytics Dashboard:${NC} http://localhost:3000/analytics"
    echo -e "${GREEN}🔍 System Monitoring:${NC} http://localhost:3000/monitoring"
    echo -e "${GREEN}🌐 Dashboard API:${NC} http://localhost:3001"
    echo -e "${GREEN}🔌 WebSocket:${NC} ws://localhost:3001"
    echo ""
    echo -e "${BLUE}📱 Mobile-friendly responsive design${NC}"
    echo -e "${BLUE}🔄 Real-time updates via WebSocket${NC}"
    echo -e "${BLUE}📊 Live metrics and analytics${NC}"
    echo -e "${BLUE}🚨 Alert system with notifications${NC}"
    echo ""
}

# Create system status check
create_status_check() {
    print_header "📋 Creating Status Check Script..."
    
    cat > check_dashboard_status.sh << 'EOF'
#!/bin/bash

echo "🎛️ AIOS Dashboard Status Check"
echo "================================"

# Check dashboard server
if curl -s http://localhost:3001/api/dashboard/health > /dev/null 2>&1; then
    echo "✅ Dashboard API Server: Running (port 3001)"
else
    echo "❌ Dashboard API Server: Not responding"
fi

# Check main server
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Main API Server: Running (port 5000)"
else
    echo "❌ Main API Server: Not responding"
fi

# Check client server
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Client Server: Running (port 3000)"
else
    echo "❌ Client Server: Not responding"
fi

# Check WebSocket connection
if nc -z localhost 3001 2>/dev/null; then
    echo "✅ WebSocket Server: Running (port 3001)"
else
    echo "❌ WebSocket Server: Not responding"
fi

echo ""
echo "📊 Dashboard URLs:"
echo "  • Main Dashboard: http://localhost:3000"
echo "  • Analytics: http://localhost:3000/analytics"
echo "  • Monitoring: http://localhost:3000/monitoring"
echo "  • API: http://localhost:3001"
EOF

    chmod +x check_dashboard_status.sh
    print_status "Status check script created: check_dashboard_status.sh"
}

# Cleanup function
cleanup() {
    print_header "🧹 Cleaning up processes..."
    
    if [ -f "dashboard.pid" ]; then
        DASHBOARD_PID=$(cat dashboard.pid)
        kill $DASHBOARD_PID 2>/dev/null
        rm dashboard.pid
        print_status "Dashboard server stopped"
    fi
    
    if [ -f "main.pid" ]; then
        MAIN_PID=$(cat main.pid)
        kill $MAIN_PID 2>/dev/null
        rm main.pid
        print_status "Main server stopped"
    fi
    
    if [ -f "client.pid" ]; then
        CLIENT_PID=$(cat client.pid)
        kill $CLIENT_PID 2>/dev/null
        rm client.pid
        print_status "Client server stopped"
    fi
}

# Main execution
main() {
    print_header "🎛️ AIOS Full-Stack Dashboard System"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Check environment
    check_environment
    
    # Start servers
    start_dashboard_server
    start_main_server
    start_client
    
    # Wait for servers
    wait_for_servers
    
    # Create status check script
    create_status_check
    
    # Show URLs
    show_dashboard_urls
    
    print_status "🎉 AIOS Full-Stack Dashboard System is running!"
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for user interrupt
    trap cleanup EXIT
    wait
}

# Run main function
main "$@"
