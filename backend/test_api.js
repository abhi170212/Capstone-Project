const axios = require('axios');

async function test() {
  try {
    console.log("1. Registering new test user...");
    const email = `testuser_${Date.now()}@example.com`;
    let res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test',
      email: email,
      password: 'password123'
    });
    const token = res.data.token;
    console.log("Token received:", token.slice(0, 15) + "...");

    console.log("2. Fetching a destination to favorite...");
    res = await axios.get('http://localhost:5000/api/destinations');
    const destId = res.data.data[0]._id;
    console.log("Destination ID:", destId);

    console.log("3. Toggling favorite for destination...");
    res = await axios.post(`http://localhost:5000/api/users/favorites/${destId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Favorites array after adding:", res.data.favorites);

    console.log("4. Fetching dashboard...");
    res = await axios.get('http://localhost:5000/api/users/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Dashboard favorites:", res.data.favorites.map(f => f.name || f._id));
    
    console.log("ALL TESTS PASSED!");
  } catch (err) {
    if (err.response) {
      console.error("API Error:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

test();
