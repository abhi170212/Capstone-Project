const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Attire = require('../models/Attire');

dotenv.config({ path: path.join(__dirname, '../.env') });

const attires = [
  // Bhagalpur (Famous for Silk)
  {
    name: 'Bhagalpuri Tussar Silk Saree',
    description: 'An elegant, lightweight Tussar silk saree with a distinctive natural golden sheen, handcrafted by the weavers of Bhagalpur, known as the Silk City of India.',
    category: 'Female',
    location: 'Bhagalpur',
    price: 4500,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1610189013583-b54131df4a6f?q=80&w=800&auto=format&fit=crop',
    sizes: ['Free Size']
  },
  {
    name: 'Bhagalpuri Silk Kurta',
    description: 'A premium men\'s kurta made from pure Bhagalpuri silk, offering a comfortable, breathable, and regal traditional look for festive occasions.',
    category: 'Male',
    location: 'Bhagalpur',
    price: 2200,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1596522354195-e84ae3c98731?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL']
  },

  // Mithila / Madhubani (Famous for art/prints)
  {
    name: 'Madhubani Hand-Painted Saree',
    description: 'A stunning cotton saree featuring authentic, hand-painted Madhubani (Mithila) art patterns. Each saree is a unique masterpiece depicting mythological themes.',
    category: 'Female',
    location: 'Mithila',
    price: 3500,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1583391733959-f583020002f5?q=80&w=800&auto=format&fit=crop',
    sizes: ['Free Size']
  },
  {
    name: 'Madhubani Print Dupatta',
    description: 'A vibrant Dupatta adorned with intricate Madhubani motifs, perfect for pairing with simple kurtis to instantly elevate your ethnic look.',
    category: 'Female',
    location: 'Mithila',
    price: 1200,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1605022600390-071c6f969eb2?q=80&w=800&auto=format&fit=crop',
    sizes: ['Free Size']
  },
  {
    name: 'Mithila Art Men\'s Kurta',
    description: 'A classic cotton kurta featuring subtle, hand-painted Madhubani art around the collar and cuffs, blending traditional art with everyday ethnic wear.',
    category: 'Male',
    location: 'Mithila',
    price: 1800,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1598300188481-2298bc36015b?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL']
  },

  // Patna / Standard Traditional
  {
    name: 'Classic Cotton Dhoti Kurta',
    description: 'The quintessential traditional wear of Bihar. A crisp white cotton dhoti paired with a comfortable kurta, ideal for religious ceremonies and hot summers.',
    category: 'Male',
    location: 'Patna',
    price: 1500,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1582418585408-013ba0c6487e?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL']
  },
  {
    name: 'Bhojpuri Gamcha',
    description: 'The iconic traditional cotton towel/scarf with a red and white checkered pattern. It is an essential, multi-purpose accessory for every Bihari man.',
    category: 'Unisex',
    location: 'Patna',
    price: 250,
    stock: 300,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=800&auto=format&fit=crop',
    sizes: ['Free Size']
  },
  {
    name: 'Festive Sherwani Set',
    description: 'An elaborately embroidered sherwani set used during traditional Bihari weddings and grand festivals, complete with a matching pajama and safa (turban).',
    category: 'Male',
    location: 'Patna',
    price: 8500,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1534520330058-294315bb99ee?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL']
  },

  // Gaya
  {
    name: 'Bawan Buti Saree',
    description: 'A traditional handloom saree originating from Nalanda/Gaya region, famous for its "Bawan Buti" (52 motifs) woven intricately into the fabric, often featuring Buddhist symbols.',
    category: 'Female',
    location: 'Gaya',
    price: 2800,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1583391265696-613d964f43c3?q=80&w=800&auto=format&fit=crop',
    sizes: ['Free Size']
  },
  {
    name: 'Cotton Lungi',
    description: 'A highly comfortable and breathable traditional lower garment wrapped around the waist, commonly worn by men across rural and urban Bihar for daily casual wear.',
    category: 'Male',
    location: 'Gaya',
    price: 400,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=800&auto=format&fit=crop', // Reusing placeholder
    sizes: ['Free Size']
  }
];

const seedAttires = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB. Wiping existing attires...');
    await Attire.deleteMany();

    await Attire.insertMany(attires);

    console.log(`Successfully seeded ${attires.length} attires with region/location data!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding attires:', error);
    process.exit(1);
  }
};

seedAttires();
