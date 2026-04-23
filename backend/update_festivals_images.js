require('dotenv').config();
const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name: String,
  location: String,
  month: String,
  description: String,
  images: [String]
});

const Festival = mongoose.models.Festival || mongoose.model('Festival', festivalSchema);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    try {
      console.log('Connected to MongoDB for updating festivals...');
      
      await Festival.updateOne({ name: 'Chhath Puja' }, { $set: { images: ['/destinations/patna.png'] } });
      await Festival.updateOne({ name: 'Sonepur Mela' }, { $set: { images: ['/destinations/vaishali.png'] } });
      await Festival.updateOne({ name: 'Rajgir Mahotsav' }, { $set: { images: ['/destinations/rajgir.png'] } });
      await Festival.updateOne({ name: 'Buddha Purnima' }, { $set: { images: ['/destinations/bodh_gaya.png'] } });

      console.log('Festivals updated successfully!');
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      mongoose.disconnect();
      process.exit();
    }
  });
