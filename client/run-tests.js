#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running AI Component Tests...\n');

try {
  // Run Jest tests
  console.log('📊 Running component tests...');
  execSync('npx jest --config=jest.config.js --coverage', {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'client'),
  });

  console.log('\n✅ All tests completed successfully!');
  console.log('📈 Coverage report generated in client/coverage/');
} catch (error) {
  console.error('\n❌ Tests failed:', error.message);
  process.exit(1);
}
