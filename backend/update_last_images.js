require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  await Destination.collection.updateOne({ name: 'Vikramshila Ruins' }, { $set: { images: ['/destinations/vikramshila.png'] } });
  await Destination.collection.updateOne({ name: 'Vaishali' }, { $set: { images: ['/destinations/vaishali.png'] } });
  await Destination.collection.updateOne({ name: 'Patna Sahib (Takht Sri Harmandir Sahib)' }, { $set: { images: ['/destinations/patna_sahib.png'] } });
  console.log('Database updated for the remaining generation locations!');
  process.exit();
});
