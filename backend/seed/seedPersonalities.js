const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Personality = require('../models/Personality');

dotenv.config({ path: path.join(__dirname, '../.env') });

const personalities = [
  { name: 'Gautama Buddha', era: 'Ancient Era', description: 'Founder of Buddhism, attained enlightenment in Bodh Gaya, Bihar.', image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=500&auto=format&fit=crop&q=60' },
  { name: 'Mahavira', era: 'Ancient Era', description: 'The 24th Tirthankara of Jainism, born in Vaishali and attained Nirvana in Pawapuri, Bihar.', image: 'https://images.unsplash.com/photo-1621213032549-38b8138b1f58?w=500&auto=format&fit=crop&q=60' },
  { name: 'Ashoka The Great', era: 'Ancient Era', description: 'One of India\'s greatest emperors who ruled the Maurya Dynasty from Pataliputra (modern Patna).', image: 'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=500&auto=format&fit=crop&q=60' },
  { name: 'Aryabhata', era: 'Ancient Era', description: 'The brilliant mathematician and astronomer who gave the world the concept of zero, operated from Kusumapura (Patna).', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60' },
  { name: 'Chanakya', era: 'Ancient Era', description: 'Master strategist, economist, and author of Arthashastra, closely associated with the Maurya Empire.', image: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?w=500&auto=format&fit=crop&q=60' },
  { name: 'Guru Gobind Singh', era: 'Medieval & Pre-Independence', description: 'The 10th Sikh Guru was born in Patna, Bihar. His birthplace is enshrined as Takht Sri Patna Sahib.', image: 'https://images.unsplash.com/photo-1586551800249-16e680d22dfb?w=500&auto=format&fit=crop&q=60' },
  { name: 'Sher Shah Suri', era: 'Medieval & Pre-Independence', description: 'Emperor who defeated the Mughals, founded the Suri Empire, and built the Grand Trunk Road. Buried in Sasaram.', image: 'https://images.unsplash.com/photo-1623947470691-23d3a0429f63?w=500&auto=format&fit=crop&q=60' },
  { name: 'Dr. Rajendra Prasad', era: 'Post-Independence', description: 'The first President of Independent India and a major leader in the Indian independence movement, hailing from Ziradei.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Rajendra_Prasad.jpg' },
  { name: 'Jayaprakash Narayan', era: 'Post-Independence', description: 'Known as Lok Nayak, a fierce independence activist and political leader who spearheaded the 1974 Total Revolution.', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Jayaprakash_Narayan.jpg' },
  { name: 'Bismillah Khan', era: 'Post-Independence', description: 'The legendary Shehnai maestro and Bharat Ratna awardee was born in Dumraon, Bihar.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Bismillah_Khan.jpg' },
  { name: 'Ramdhari Singh Dinkar', era: 'Post-Independence', description: 'One of the most important modern Hindi poets, known as Rashtrakavi, hailing from Simariya, Begusarai.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Ramdhari_Singh_Dinkar.jpg' },
  { name: 'Sushant Singh Rajput', era: 'Modern Day', description: 'Highly acclaimed Bollywood actor known for his brilliant performances and sharp intellect, born in Patna.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60' },
  { name: 'Manoj Bajpayee', era: 'Modern Day', description: 'Multi-award-winning Indian film actor renowned for his raw and powerful acting, hailing from Narkatiaganj.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60' },
  { name: 'Anand Kumar', era: 'Modern Day', description: 'Renowned mathematician and educator, famous for his Super 30 program that coaches underprivileged students for the IIT-JEE.', image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500&auto=format&fit=crop&q=60' },
];

const seedPersonalities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB. Wiping existing personalities...');
    await Personality.deleteMany();

    await Personality.insertMany(personalities);

    console.log(`Successfully seeded ${personalities.length} personalities!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding personalities:', error);
    process.exit(1);
  }
};

seedPersonalities();
