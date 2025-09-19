# 🎛️ AIOS Full-Stack Dashboard System

A comprehensive, real-time dashboard system for the AIOS platform with advanced monitoring, analytics, and system management capabilities.

## 🌟 Features

### 📊 **Multiple Dashboard Types**

- **Overview Dashboard**: Complete system overview with real-time metrics
- **Analytics Dashboard**: Real-time analytics and performance trends
- **System Monitoring**: Advanced system monitoring and alerts

### 🔄 **Real-Time Capabilities**

- WebSocket-based real-time updates
- Live metrics and performance data
- Instant alert notifications
- Auto-refresh functionality

### 📱 **Responsive Design**

- Mobile-friendly interface
- Adaptive layouts for all screen sizes
- Touch-optimized controls
- Progressive Web App features

### 🚨 **Advanced Monitoring**

- System health monitoring
- Performance metrics tracking
- Alert threshold management
- Log analysis and filtering

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Modern web browser

### Installation

1. **Clone and navigate to the project**:

   ```bash
   cd /Users/cryptojoker710/Desktop/AIOS
   ```

2. **Install dependencies**:

   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Start the dashboard system**:
   ```bash
   ./start_dashboard.sh
   ```

### Manual Startup

If you prefer to start components manually:

1. **Start Dashboard API Server**:

   ```bash
   node server/dashboardAPI.js
   ```

2. **Start Main API Server** (optional):

   ```bash
   node server/aiosAPIServer.js
   ```

3. **Start Client Development Server**:
   ```bash
   cd client && npm start
   ```

## 📊 Dashboard Components

### 1. **Full-Stack Dashboard** (`FullStackDashboard.js`)

- **Purpose**: Complete system overview
- **Features**:
  - System health metrics
  - Real-time performance data
  - User and app statistics
  - Alert management
  - Interactive metric cards

### 2. **Real-Time Analytics Dashboard** (`RealTimeAnalyticsDashboard.js`)

- **Purpose**: Advanced analytics and trends
- **Features**:
  - Performance trend analysis
  - User activity tracking
  - App usage statistics
  - Interactive charts and graphs
  - Tabbed interface for different data views

### 3. **System Monitoring Dashboard** (`SystemMonitoringDashboard.js`)

- **Purpose**: System monitoring and alerts
- **Features**:
  - Real-time system metrics
  - Alert threshold management
  - Log analysis
  - Performance monitoring
  - Customizable settings

### 4. **Dashboard Router** (`DashboardRouter.js`)

- **Purpose**: Navigation and layout management
- **Features**:
  - Responsive sidebar navigation
  - Dashboard switching
  - User profile management
  - Notification system
  - Quick actions menu

## 🔧 API Endpoints

### Dashboard API Server (Port 3001)

| Endpoint                     | Method | Description          |
| ---------------------------- | ------ | -------------------- |
| `/api/dashboard/overview`    | GET    | System overview data |
| `/api/dashboard/analytics`   | GET    | Analytics data       |
| `/api/dashboard/metrics`     | GET    | Real-time metrics    |
| `/api/dashboard/alerts`      | GET    | System alerts        |
| `/api/dashboard/logs`        | GET    | System logs          |
| `/api/dashboard/health`      | GET    | System health status |
| `/api/dashboard/data-agent`  | GET    | Data agent status    |
| `/api/dashboard/performance` | GET    | Performance metrics  |
| `/api/dashboard/users`       | GET    | User statistics      |
| `/api/dashboard/apps`        | GET    | App statistics       |

### WebSocket Events

| Event Type     | Description               |
| -------------- | ------------------------- |
| `initial_data` | Initial dashboard data    |
| `overview`     | System overview updates   |
| `metrics`      | Real-time metrics updates |
| `alert`        | New alert notifications   |
| `log`          | New log entries           |

## 🎨 UI Components

### Material-UI Components Used

- **Layout**: `Box`, `Grid`, `Card`, `CardContent`
- **Navigation**: `AppBar`, `Toolbar`, `Drawer`, `List`
- **Data Display**: `Table`, `Typography`, `Chip`, `Badge`
- **Feedback**: `Alert`, `CircularProgress`, `LinearProgress`
- **Input**: `Button`, `IconButton`, `Switch`, `Slider`
- **Navigation**: `Tabs`, `Tab`, `Menu`, `MenuItem`

### Custom Components

- **MetricCard**: Reusable metric display component
- **PerformanceChart**: Interactive performance visualization
- **TabPanel**: Tab content management
- **DrawerContent**: Navigation drawer content

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the client directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key

# Dashboard Configuration
DASHBOARD_PORT=3001
REACT_APP_API_URL=http://localhost:3001/api
```

### Alert Thresholds

Default alert thresholds can be customized in the System Monitoring Dashboard:

- **CPU Usage**: 80%
- **Memory Usage**: 85%
- **Storage Usage**: 90%
- **Network Usage**: 75%

## 🔄 Real-Time Features

### WebSocket Connection

- Automatic reconnection on disconnect
- Real-time data streaming
- Connection status indicators
- Error handling and recovery

### Auto-Refresh

- Configurable refresh intervals (1s, 3s, 5s, 10s, 30s)
- Toggle on/off functionality
- Background data updates
- Performance optimization

### Live Metrics

- CPU, Memory, Storage, Network usage
- System health scores
- Performance trends
- User activity tracking

## 📱 Mobile Support

### Responsive Design

- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts
- Optimized performance

### Progressive Web App

- Offline capabilities
- Push notifications
- App-like experience
- Install prompts

## 🚨 Alert System

### Alert Types

- **Error**: Critical system issues
- **Warning**: Performance concerns
- **Info**: General notifications
- **Success**: Positive status updates

### Alert Management

- Real-time alert generation
- Threshold-based alerts
- Alert history tracking
- Customizable notifications

## 📊 Analytics Features

### Performance Metrics

- Response time tracking
- Throughput monitoring
- Error rate analysis
- Uptime statistics

### User Analytics

- User growth tracking
- Activity monitoring
- Engagement metrics
- Usage patterns

### App Analytics

- App usage statistics
- Category distribution
- Performance metrics
- Growth trends

## 🔧 Development

### Project Structure

```
client/src/pages/
├── FullStackDashboard.js          # Main overview dashboard
├── RealTimeAnalyticsDashboard.js  # Analytics dashboard
├── SystemMonitoringDashboard.js   # System monitoring
└── DashboardRouter.js             # Navigation router

server/
└── dashboardAPI.js                # Dashboard API server

start_dashboard.sh                 # Startup script
check_dashboard_status.sh          # Status check script
```

### Adding New Dashboards

1. **Create Dashboard Component**:

   ```javascript
   // client/src/pages/NewDashboard.js
   import React from 'react';
   import { Box, Typography } from '@mui/material';

   const NewDashboard = () => {
     return (
       <Box>
         <Typography variant='h4'>New Dashboard</Typography>
         {/* Dashboard content */}
       </Box>
     );
   };

   export default NewDashboard;
   ```

2. **Add to Router**:

   ```javascript
   // In DashboardRouter.js
   import NewDashboard from './NewDashboard';

   const dashboardItems = [
     // ... existing dashboards
     {
       id: 'new',
       title: 'New Dashboard',
       icon: <NewIcon />,
       component: NewDashboard,
       description: 'Description of new dashboard'
     }
   ];
   ```

3. **Add API Endpoints** (if needed):
   ```javascript
   // In server/dashboardAPI.js
   this.app.get('/api/dashboard/new', (req, res) => {
     res.json({
       success: true,
       data: {
         /* new data */
       },
       timestamp: new Date().toISOString()
     });
   });
   ```

## 🧪 Testing

### Status Check

```bash
./check_dashboard_status.sh
```

### Manual Testing

1. **API Endpoints**: Test all endpoints with curl or Postman
2. **WebSocket**: Use browser dev tools to monitor WebSocket messages
3. **UI Components**: Test responsive design on different screen sizes
4. **Real-time Updates**: Verify data updates in real-time

### Performance Testing

- Load testing with multiple concurrent users
- Memory usage monitoring
- Response time analysis
- WebSocket connection stability

## 🚀 Deployment

### Production Build

```bash
cd client
npm run build
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server/dashboardAPI.js"]
```

### Environment Setup

- Configure production environment variables
- Set up reverse proxy (nginx)
- Configure SSL certificates
- Set up monitoring and logging

## 📈 Performance Optimization

### Frontend Optimization

- Code splitting and lazy loading
- Memoization of expensive components
- Virtual scrolling for large lists
- Image optimization

### Backend Optimization

- Connection pooling
- Caching strategies
- Database query optimization
- Rate limiting

### Real-time Optimization

- WebSocket connection management
- Data compression
- Efficient data structures
- Background processing

## 🔒 Security

### Authentication

- Firebase Authentication integration
- Role-based access control
- Session management
- API key protection

### Data Protection

- HTTPS enforcement
- Input validation
- SQL injection prevention
- XSS protection

## 📚 Documentation

### API Documentation

- Swagger/OpenAPI integration
- Endpoint documentation
- Request/response examples
- Error handling guide

### User Guide

- Dashboard navigation
- Feature explanations
- Troubleshooting guide
- FAQ section

## 🤝 Contributing

### Development Guidelines

1. Follow React best practices
2. Use Material-UI components consistently
3. Implement proper error handling
4. Write comprehensive tests
5. Document new features

### Code Style

- ESLint configuration
- Prettier formatting
- TypeScript support
- Component documentation

## 📞 Support

### Troubleshooting

- Check system status: `./check_dashboard_status.sh`
- Review logs for errors
- Verify environment variables
- Test API endpoints manually

### Common Issues

- **Port conflicts**: Change ports in configuration
- **WebSocket issues**: Check firewall settings
- **Performance issues**: Monitor resource usage
- **Mobile issues**: Test responsive design

## 🎯 Roadmap

### Upcoming Features

- [ ] Advanced charting library integration
- [ ] Custom dashboard builder
- [ ] Export functionality
- [ ] Multi-tenant support
- [ ] Advanced alerting rules
- [ ] Machine learning insights
- [ ] Mobile app development
- [ ] API rate limiting
- [ ] Data visualization improvements
- [ ] Performance monitoring enhancements

---

## 🎉 Conclusion

The AIOS Full-Stack Dashboard System provides a comprehensive, real-time monitoring and analytics solution with:

- **Multiple specialized dashboards** for different use cases
- **Real-time data updates** via WebSocket connections
- **Responsive design** for all devices
- **Advanced monitoring capabilities** with customizable alerts
- **Extensible architecture** for easy customization
- **Production-ready** with proper error handling and security

Start exploring your system data with the AIOS Full-Stack Dashboard System today! 🚀
