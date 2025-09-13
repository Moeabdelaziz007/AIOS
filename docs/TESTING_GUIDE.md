# AIOS Testing Guide

## Overview
This document provides comprehensive information about testing the AIOS (AI Operating System) project. The project includes both backend (Node.js/Express) and frontend (React) components with full test coverage.

## Test Structure

### Backend Tests
- **Location**: `server/tests/`
- **Framework**: Jest + Supertest
- **Coverage**: API endpoints, business logic, error handling
- **Files**:
  - `api.test.js` - API endpoint tests
  - `setup.js` - Test configuration and mocks

### Frontend Tests
- **Location**: `client/src/__tests__/`
- **Framework**: Jest + React Testing Library
- **Coverage**: React components, user interactions, API integration
- **Files**:
  - `Dashboard.test.js` - Dashboard component tests
  - `Apps.test.js` - Apps management tests
  - `Settings.test.js` - Settings page tests

## Running Tests

### Quick Start
```bash
# Run all tests
./run-tests.sh

# Or use npm scripts
npm test
```

### Individual Test Suites
```bash
# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Watch mode (re-runs tests on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Commands Reference
| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:backend` | Backend tests only |
| `npm run test:frontend` | Frontend tests only |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## Test Configuration

### Backend Configuration
- **Jest Config**: `jest.config.js`
- **Test Setup**: `server/tests/setup.js`
- **Environment**: Node.js test environment
- **Mocking**: Firebase services mocked

### Frontend Configuration
- **Jest Config**: Built into React Scripts
- **Test Setup**: `client/src/setupTests.js`
- **Environment**: jsdom (browser simulation)
- **Mocking**: API services mocked

## Test Coverage

### Backend Coverage
- ✅ API endpoints (GET, POST, PUT, DELETE)
- ✅ Error handling and validation
- ✅ Firebase integration
- ✅ System status endpoints
- ✅ Logging functionality

### Frontend Coverage
- ✅ Component rendering
- ✅ User interactions (clicks, form submissions)
- ✅ API integration
- ✅ Error states and loading states
- ✅ Navigation and routing

## Writing Tests

### Backend Test Example
```javascript
test('GET /api/apps should return all apps', async () => {
  const response = await request(app)
    .get('/api/apps')
    .expect(200);

  expect(response.body).toHaveProperty('apps');
  expect(Array.isArray(response.body.apps)).toBe(true);
});
```

### Frontend Test Example
```javascript
test('renders dashboard with system status', async () => {
  render(
    <FirebaseProvider>
      <Dashboard />
    </FirebaseProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('AIOS Dashboard')).toBeInTheDocument();
  });
});
```

## Mocking Strategy

### Backend Mocks
- Firebase Firestore operations
- Firebase Authentication
- External API calls
- Console methods (to reduce test noise)

### Frontend Mocks
- API service calls
- Firebase services
- Browser APIs (matchMedia, IntersectionObserver)
- React Router

## Test Data

### Backend Test Data
- Mock apps with various statuses
- System configuration data
- Log entries with different levels
- Error scenarios

### Frontend Test Data
- Component props and state
- User interaction scenarios
- API response data
- Error conditions

## Continuous Integration

### GitHub Actions (Recommended)
```yaml
name: AIOS Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

## Debugging Tests

### Backend Debugging
```bash
# Run specific test file
npm test -- server/tests/api.test.js

# Run with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="should return all apps"
```

### Frontend Debugging
```bash
# Run specific test file
cd client && npm test -- Dashboard.test.js

# Run with coverage
cd client && npm test -- --coverage

# Debug mode
cd client && npm test -- --debug
```

## Performance Testing

### Load Testing (Future Enhancement)
```bash
# Install Artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### Memory Testing
```bash
# Run with memory profiling
node --inspect server/index.js
```

## Best Practices

### Test Organization
1. **One test file per component/feature**
2. **Descriptive test names**
3. **Arrange-Act-Assert pattern**
4. **Mock external dependencies**
5. **Clean up after tests**

### Test Quality
1. **Test both success and failure cases**
2. **Test edge cases and error conditions**
3. **Maintain high coverage (>80%)**
4. **Keep tests fast and reliable**
5. **Use meaningful assertions**

### Maintenance
1. **Update tests when features change**
2. **Remove obsolete tests**
3. **Refactor tests for clarity**
4. **Monitor test performance**
5. **Document test scenarios**

## Troubleshooting

### Common Issues

#### Backend Tests
- **Firebase connection errors**: Check environment variables
- **Port conflicts**: Ensure test port is available
- **Timeout errors**: Increase Jest timeout

#### Frontend Tests
- **Component not rendering**: Check React Testing Library setup
- **Async operations**: Use `waitFor` for async operations
- **Mock issues**: Verify mock implementations

### Getting Help
1. Check test output for specific error messages
2. Review test configuration files
3. Ensure all dependencies are installed
4. Check environment variables
5. Verify Firebase project configuration

## Future Enhancements

### Planned Improvements
- [ ] E2E testing with Cypress
- [ ] Visual regression testing
- [ ] Performance benchmarking
- [ ] Accessibility testing
- [ ] Security testing

### Integration Testing
- [ ] Database integration tests
- [ ] Firebase emulator testing
- [ ] API contract testing
- [ ] Cross-browser testing

This testing guide ensures comprehensive coverage and quality assurance for the AIOS project.
