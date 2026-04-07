/**
 * Backend-Frontend Integration Test Script
 * Run this to verify all API connections are working
 */

const API_BASE = 'http://localhost:5000/api';

const tests = [
  {
    name: 'Health Check',
    endpoint: '/',
    method: 'GET',
  },
  {
    name: 'Get All Destinations',
    endpoint: '/destinations',
    method: 'GET',
  },
  {
    name: 'Get All Festivals',
    endpoint: '/festivals',
    method: 'GET',
  },
  {
    name: 'Get All Eco Sites',
    endpoint: '/ecotourism',
    method: 'GET',
  },
  {
    name: 'Register Test User',
    endpoint: '/auth/register',
    method: 'POST',
    body: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
    },
  },
  {
    name: 'Login User',
    endpoint: '/auth/login',
    method: 'POST',
    body: {
      email: 'admin@bihartourism.com',
      password: 'admin123',
    },
  },
];

async function runTests() {
  console.log('🧪 Testing Backend-Frontend Integration...\n');
  console.log(`API Base URL: ${API_BASE}\n`);

  let token = null;
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (token && test.endpoint.startsWith('/admin')) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(`${API_BASE}${test.endpoint}`, options);
      const data = await response.json();

      if (response.ok) {
        console.log(`✅ PASSED - ${test.name}`);
        passed++;

        // Store token if login/register
        if (data.token) {
          token = data.token;
          console.log(`   → Token received: ${token.substring(0, 20)}...`);
        }

        // Show data count if available
        if (data.count !== undefined) {
          console.log(`   → Count: ${data.count}`);
        }
        if (data.data && Array.isArray(data.data)) {
          console.log(`   → Items: ${data.data.length}`);
        }
      } else {
        console.log(`❌ FAILED - ${test.name}`);
        console.log(`   → Error: ${data.message || 'Unknown error'}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ FAILED - ${test.name}`);
      console.log(`   → Error: ${error.message}`);
      failed++;
    }

    console.log('');
  }

  console.log('═'.repeat(50));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📝 Total: ${tests.length}`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 All tests passed! Frontend-Backend integration is working!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure backend is running: npm run dev (in backend folder)');
    console.log('2. Make sure database is seeded: npm run seed (in backend folder)');
    console.log('3. Check if MongoDB connection is working');
    console.log('4. Verify API_BASE URL is correct');
  }
}

runTests();
