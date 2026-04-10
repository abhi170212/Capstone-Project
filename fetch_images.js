const https = require('https');

const urls = [
  "https://unsplash.com/photos/a-buddha-statue-sitting-in-the-middle-of-a-body-of-water-RSneU6rxBoU",
  "https://unsplash.com/photos/a-group-of-people-standing-around-a-white-building-xB6L5tjAEUE",
  "https://unsplash.com/photos/a-bowl-of-fruit-iIcmGBrVYqY",
  "https://unsplash.com/photos/a-group-of-stone-structures-sitting-on-top-of-a-dirt-field-di04090zyto",
  "https://unsplash.com/photos/woman-in-red-jacket-walking-with-white-and-black-goats-on-green-grass-field-during-daytime-Noh7YrcLeTg"
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location)); // handle redirect
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta property="og:image" content="(https:\/\/images\.unsplash\.com\/[^"]+)"/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve('Not found for ' + url);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const url of urls) {
    const imgUrl = await fetchUrl(url);
    console.log(imgUrl);
  }
}

run();
