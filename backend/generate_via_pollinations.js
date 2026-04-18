const https = require('https');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '../bihar-tourism/public/destinations');

const targets = {
  "valmiki.png": "A high quality, cinematic, lush green, hyper-realistic photo of Valmiki National Park landscape in Bihar India, beautiful nature, dramatic lighting",
  "kakolat.png": "A high quality, cinematic, beautiful photo of the stunning Kakolat Waterfall surrounded by forests in Bihar India, dynamic water flow, nature",
  "maner_sharif.png": "A high quality, cinematic, spiritual photo of the stunning Sufi shrine Hazrat Makhdoom Shah Yahya Maneri tomb in Maner Sharif, Bihar India, premium aesthetic",
  "kesaria.png": "A high quality, cinematic, ancient photo of the large Buddhist Kesaria Stupa located in Bihar India, mysterious and historical aesthetic",
  "barabar.png": "A high quality, cinematic, mysterious photo of the massive rock-cut Barabar Caves in Bihar India, sunlight entering through ancient doorway",
  "rohtasgarh.png": "A high quality, cinematic, dramatic photo of the magnificent ancient stone walls and buildings of Rohtasgarh Fort, Bihar India",
  "bhimbandh.png": "A high quality, cinematic, natural photo of the Bhimbandh Wildlife Sanctuary in Bihar India with beautiful flora and fauna, soft natural lighting",
  "sanjay_gandhi.png": "A high quality, cinematic, lush photo of the Sanjay Gandhi Biological Park zoo in Bihar India, rich greenery and beautiful park layout"
};

const downloadGenImage = (promptText, filepath) => {
  return new Promise((resolve, reject) => {
    const promptUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=1024&height=768&nologo=true`;
    
    https.get(promptUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode <= 399 && res.headers.location) {
        return resolve(downloadGenImage(res.headers.location, filepath)); 
      }
      const writeStream = fs.createWriteStream(filepath);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        writeStream.close();
        resolve();
      });
    }).on('error', reject);
  });
};

async function executeGenerations() {
  console.log("Starting AI Image Generation via Pollinations API...");
  for (const [filename, prompt] of Object.entries(targets)) {
    const filepath = path.join(destDir, filename);
    console.log(`Generating AI Image for: ${filename}...`);
    try {
      await downloadGenImage(prompt, filepath);
      console.log(`Successfully generated and saved ${filename}`);
    } catch (e) {
      console.error(`Failed to generate ${filename}:`, e);
    }
  }
  console.log("All requested AI generations complete! Overwritten the DB fallback images.");
}

executeGenerations();
