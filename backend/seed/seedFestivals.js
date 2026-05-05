const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Festival = require('../models/Festival');

dotenv.config({ path: path.join(__dirname, '../.env') });

const FESTIVALS = [
  { name: 'Chhath Puja', month: 'October', location: 'Throughout Bihar', images: ['https://images.unsplash.com/photo-1604928141064-207e95b85df4?w=800&q=80'], category: 'Religious', description: 'The most revered festival of Bihar dedicated to the Sun God. Devotees offer prayers at riverbanks during sunset and sunrise over four rigorous days of fasting.', highlight: 'UNESCO Recognized' },
  { name: 'Holi', month: 'March', location: 'Statewide', images: ['https://images.unsplash.com/photo-1520642413789-2bd6770d59e3?w=800&q=80'], category: 'Cultural', description: 'The vibrant festival of colors celebrated with great enthusiasm across Bihar with traditional folk songs, dances, and community feasts.', highlight: 'Most Colorful' },
  { name: 'Diwali', month: 'October', location: 'Statewide', images: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80'], category: 'Religious', description: 'Festival of lights celebrated with oil lamps, fireworks, and worship of Goddess Lakshmi. Markets light up brilliantly across Patna and all districts.', highlight: 'Festival of Lights' },
  { name: 'Durga Puja', month: 'October', location: 'Patna, Bhagalpur', images: ['https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=800&q=80'], category: 'Religious', description: 'Five-day grand celebration honoring Goddess Durga with elaborate pandals, cultural performances, and immersion processions.', highlight: 'Grand Pandals' },
  { name: 'Makar Sankranti', month: 'January', location: 'Statewide', images: ['https://images.unsplash.com/photo-1574914629385-46448b06dc71?w=800&q=80'], category: 'Harvest', description: 'Harvest festival marking the sun\'s transit into Capricorn. Celebrated with kite flying, sesame sweets (tilkut), and ritual bathing in rivers.', highlight: 'Kite Flying' },
  { name: 'Buddha Purnima', month: 'May', location: 'Bodh Gaya', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], category: 'Religious', description: 'Commemorating the birth, enlightenment, and death of Gautama Buddha. Thousands of pilgrims gather at the Mahabodhi Temple in Bodh Gaya.', highlight: 'UNESCO Site' },
  { name: 'Mahavir Jayanti', month: 'April', location: 'Vaishali, Pawapuri', images: ['https://images.unsplash.com/photo-1609790873028-d5dd41fabb5c?w=800&q=80'], category: 'Religious', description: 'Birth anniversary of Lord Mahavira, the 24th Jain Tirthankara. Celebrated with devotion at Jain temples, especially at Pawapuri where he attained Moksha.', highlight: 'Jain Heritage' },
  { name: 'Sonepur Mela', month: 'November', location: 'Sonepur', images: ['https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80'], category: 'Cultural', description: 'Asia\'s largest cattle fair held at the confluence of the Gandak and Ganges. Features elephants, horses, handicrafts, and a massive cultural fair.', highlight: 'Asia\'s Largest Fair' },
  { name: 'Sama Chakeva', month: 'November', location: 'Mithila Region', images: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'], category: 'Folk', description: 'A unique Maithili festival celebrating the return of migratory birds. Sisters make clay figurines and sing folk songs around bonfires.', highlight: 'Unique Folk Tradition' },
  { name: 'Teej', month: 'July', location: 'Statewide', images: ['https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=800&q=80'], category: 'Cultural', description: 'Women\'s festival celebrating the union of Lord Shiva and Goddess Parvati. Marked by fasting, beautiful swings, folk songs, and green attire.', highlight: 'Women\'s Celebration' },
  { name: 'Jitiya (Jivitputrika)', month: 'September', location: 'Statewide', images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'], category: 'Religious', description: 'Mothers observe a rigorous three-day fast for the longevity and well-being of their children. Celebrated with devotion at rivers and temples.', highlight: 'Mothers\' Fast' },
  { name: 'Pitru Paksha Mela', month: 'September', location: 'Gaya', images: ['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80'], category: 'Religious', description: 'A 16-day period when Hindus perform rituals for the salvation of their ancestors at Gaya. Thousands of pilgrims come to perform Pind Daan at Vishnupad Temple.', highlight: 'Ancestral Rituals' },
  { name: 'Ram Navami', month: 'April', location: 'Sitamarhi, Darbhanga', images: ['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&q=80'], category: 'Religious', description: 'Birth anniversary of Lord Rama celebrated with huge processions, devotional music, and special prayers at temples across Bihar.', highlight: 'Grand Processions' },
  { name: 'Saraswati Puja', month: 'February', location: 'Statewide', images: ['https://images.unsplash.com/photo-1574618865584-1b3e6bc1b2d8?w=800&q=80'], category: 'Religious', description: 'Worship of the Goddess of knowledge on Vasant Panchami. Schools and colleges celebrate, students pray for wisdom, and yellow attire is the theme.', highlight: 'Vasant Panchami' },
  { name: 'Eid-ul-Fitr', month: 'April', location: 'Statewide', images: ['https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80'], category: 'Religious', description: 'Celebrated at the end of Ramadan with communal prayers at mosques, feasting, wearing new clothes, and sharing gifts with neighbors.', highlight: 'Communal Harmony' },
  { name: 'Eid-ul-Adha', month: 'June', location: 'Statewide', images: ['https://images.unsplash.com/photo-1597776680597-3a0b1b3f9e5b?w=800&q=80'], category: 'Religious', description: 'Festival of sacrifice commemorating Ibrahim\'s devotion. Celebrated with prayers, sharing of meat with the poor, and community gatherings.', highlight: 'Festival of Sacrifice' },
  { name: 'Christmas', month: 'December', location: 'Patna, Muzaffarpur', images: ['https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80'], category: 'Cultural', description: 'Celebrated by the Christian community with church services, carol singing, decorations, and community feasts. Patna\'s churches see large gatherings.', highlight: 'Carol Singing' },
  { name: 'Anant Chaturdashi', month: 'September', location: 'Statewide', images: ['https://images.unsplash.com/photo-1560089168-6516081f5bf1?w=800&q=80'], category: 'Religious', description: 'The final day of Ganesh Chaturthi festival celebrated with grand processions and immersion of Ganesha idols in rivers and tanks.', highlight: 'Ganesh Immersion' },
  { name: 'Nag Panchami', month: 'August', location: 'Statewide', images: ['https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80'], category: 'Folk', description: 'Festival dedicated to snake worship. Women pray for the safety of their families and brothers. Live snakes are worshipped in many rural areas of Bihar.', highlight: 'Ancient Tradition' },
  { name: 'Karma Festival', month: 'August', location: 'Tribal Areas', images: ['https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80'], category: 'Folk', description: 'A tribal festival celebrating nature and the Karma tree. Young men bring branches of the Karma tree and plant them in the courtyard for worship.', highlight: 'Tribal Culture' },
  { name: 'Shravani Mela', month: 'July', location: 'Sultanganj to Deoghar', images: ['https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800&q=80'], category: 'Religious', description: 'A month-long festival where Kanwariyas collect holy water from the Ganges at Sultanganj and walk barefoot to offer it to Lord Shiva in Deoghar.', highlight: 'Longest Human Chain' },
  { name: 'Maha Shivaratri', month: 'February', location: 'Statewide', images: ['https://images.unsplash.com/photo-1615307584144-88db0eec8212?w=800&q=80'], category: 'Religious', description: 'Festival honoring Lord Shiva. Devotees fast, sing hymns, and offer prayers and milk at Shiva temples across the state.', highlight: 'Night of Shiva' },
  { name: 'Rajgir Mahotsav', month: 'December', location: 'Rajgir', images: ['https://images.unsplash.com/photo-1605335805574-dcb47d96a7d7?w=800&q=80'], category: 'Cultural', description: 'A vibrant festival showcasing the classical music, dance, and cultural heritage of Magadh. Features prominent artists and a lively fair.', highlight: 'Cultural Extravaganza' },
  { name: 'Chhath Mahaparv', month: 'April', location: 'Chaiti Chhath', images: ['https://images.unsplash.com/photo-1602536052359-ef94c21c5948?w=800&q=80'], category: 'Religious', description: 'The summer counterpart to Kartik Chhath, celebrated with the same devotion and rituals honoring the Sun God.', highlight: 'Chaiti Chhath' },
  { name: 'Pataliputra Mahotsav', month: 'March', location: 'Patna', images: ['https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=800&q=80'], category: 'Cultural', description: 'An annual celebration in the capital city featuring regional art, cuisine, drama, and modern music performances.', highlight: 'Capital Celebration' },
  { name: 'Madhushravani', month: 'August', location: 'Mithilanchal', images: ['https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?w=800&q=80'], category: 'Folk', description: 'A monsoon festival celebrated by newlywed women in the Mithila region. They listen to folk tales of snake gods and eat food without salt for 13 days.', highlight: 'Mithila Tradition' }
];

const seedFestivals = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB. Wiping existing festivals...');
    await Festival.deleteMany();

    await Festival.insertMany(FESTIVALS);

    console.log(`Successfully seeded ${FESTIVALS.length} festivals!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding festivals:', error);
    process.exit(1);
  }
};

seedFestivals();
