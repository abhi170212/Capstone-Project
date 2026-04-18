require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const https = require('https');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bihartourism';
const destDir = path.join(__dirname, '../bihar-tourism/public/destinations');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Fallback high-quality direct image URLs for downloading
const imageDownloads = {
  "Vikramshila Ruins": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Vikramshila_University_Ruins.jpg",
    filename: "vikramshila.png"
  },
  "Valmiki National Park": {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Valmiki_Tiger_Reserve_landscape.jpg",
    filename: "valmiki.png"
  },
  "Kesaria Stupa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Kesariya_Stupa_Bihar_India.jpg",
    filename: "kesaria.png"
  },
  "Barabar Caves": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/22/Barabar_Caves.jpg",
    filename: "barabar.png"
  },
  "Kakolat Waterfall": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Kakolat_Waterfall.jpg",
    filename: "kakolat.png"
  },
  "Rohtasgarh Fort": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Sher_Shah_Suri%27s_-_Tomb_01.jpg",
    filename: "rohtasgarh.png"
  },
  "Bhimbandh Wildlife Sanctuary": {
    url: "https://images.unsplash.com/photo-1583344195155-2252c7be2199?w=800&q=80",
    filename: "bhimbandh.png"
  },
  "Sanjay Gandhi Biological Park": {
    url: "https://images.unsplash.com/photo-1498453443187-5c5cb2cbdbf0?w=800&q=80",
    filename: "sanjay_gandhi.png"
  },
  "Maner Sharif": {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Maner_Sharif.jpg",
    filename: "maner_sharif.png"
  }
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode <= 399 && res.headers.location) {
        return resolve(downloadImage(res.headers.location, filepath)); // handle redirect
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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected. Downloading and pairing images for remaining locations...');
    const destinations = await Destination.find({});
    
    let updateCount = 0;
    for (let dest of destinations) {
      const data = imageDownloads[dest.name];
      // Only update if it doesn't already have a local path (starts with /destinations/)
      if (data && (!dest.images || dest.images.length === 0 || !dest.images[0].startsWith('/destinations'))) {
        const localPath = path.join(destDir, data.filename);
        
        console.log(`Downloading image for ${dest.name}...`);
        try {
          await downloadImage(data.url, localPath);
          const dbPath = `/destinations/${data.filename}`;
          
          await Destination.collection.updateOne(
            { _id: dest._id },
            { $set: { images: [dbPath] } }
          );
          
          console.log(`Saved ${dbPath} for ${dest.name}`);
          updateCount++;
        } catch (e) {
          console.error(`Failed to download for ${dest.name}:`, e.message);
        }
      }
    }
    
    console.log(`Complete! Successfully downloaded and linked ${updateCount} images.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during update:', err);
    process.exit(1);
  });
