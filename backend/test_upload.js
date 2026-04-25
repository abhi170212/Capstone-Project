const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // 1. Get an auth token. The easiest way is to mock it or register a new user
    const userRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Admin',
      email: 'testadmin' + Date.now() + '@example.com',
      password: 'password123'
    });
    const token = userRes.data.token;

    // Wait, the user might need admin role to access upload? 
    // Let's check uploadRoutes.js: router.post('/', protect, uploadImage.array('images', 10)...)
    // Only `protect` is needed.

    // 2. Upload image
    const dummyImage = path.join(__dirname, 'dummy.jpg');
    fs.writeFileSync(dummyImage, 'dummy content');

    const imageForm = new FormData();
    imageForm.append('images', fs.createReadStream(dummyImage));

    const imageRes = await axios.post('http://localhost:5000/api/upload', imageForm, {
      headers: {
        ...imageForm.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Image upload success:', imageRes.data);

    // 3. Upload audio
    const dummyAudio = path.join(__dirname, 'dummy.mp3');
    fs.writeFileSync(dummyAudio, 'dummy content');

    const audioForm = new FormData();
    audioForm.append('audio', fs.createReadStream(dummyAudio));

    const audioRes = await axios.post('http://localhost:5000/api/upload/audio', audioForm, {
      headers: {
        ...audioForm.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Audio upload success:', audioRes.data);

  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
    } else {
      console.error(err);
    }
  }
}

testUpload();
