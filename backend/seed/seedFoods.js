const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('../models/Food');

dotenv.config({ path: path.join(__dirname, '../.env') });

const foods = [
  {
    name: 'Litti Chokha',
    description: 'The signature dish of Bihar. Litti is a dough ball made up of whole wheat flour and stuffed with roasted chickpea flour (sattu), mixed with herbs and spices. It is roasted over coal or wood then tossed with lots of ghee. It is served with Chokha, a mash of roasted eggplant, tomatoes, and potatoes.',
    location: 'Patna',
    ingredients: [
      'Wheat flour', 'Sattu (roasted chickpea flour)', 'Ghee', 
      'Eggplant (Baingan)', 'Tomatoes', 'Potatoes', 
      'Garlic', 'Ginger', 'Green chilies', 'Mustard oil', 'Coriander leaves'
    ],
    recipe: '1. Prepare the dough using wheat flour, salt, and water. 2. Prepare the filling by mixing sattu with chopped garlic, ginger, chilies, coriander, lemon juice, mustard oil, and spices. 3. Stuff the filling into dough balls. 4. Roast the littis over coal/wood fire until cooked. 5. Dip in melted ghee. 6. For Chokha, roast eggplant, tomatoes, and potatoes. Mash them together with raw mustard oil, chopped onions, garlic, green chilies, and salt.',
    famousShops: [
      { name: 'D K Litti Spices', address: 'Fraser Road Area, Patna' },
      { name: 'Boring Road Litti Chokha Stall', address: 'Boring Road, Patna' }
    ],
    image: 'https://images.unsplash.com/photo-1626500057075-816fdb1bb336?q=80&w=800&auto=format&fit=crop' // placeholder
  },
  {
    name: 'Khaja',
    description: 'A multi-layered, crispy, and sweet pastry that literally melts in the mouth. It is deep-fried and then dipped in sugar syrup. The Khaja from Silao, near Nalanda, is particularly famous and holds a Geographical Indication (GI) tag.',
    location: 'Nalanda', // Silao is near Nalanda
    ingredients: [
      'Refined wheat flour (Maida)', 'Sugar', 'Ghee or Oil for frying', 'Cardamom powder', 'Water'
    ],
    recipe: '1. Make a stiff dough with maida and a little ghee. 2. Roll it out into very thin sheets. 3. Layer multiple sheets on top of each other, applying a mixture of ghee and flour between layers. 4. Roll them tightly into a cylinder and cut into pieces. 5. Deep fry on low heat until layers separate and turn golden. 6. Dip in thick sugar syrup for a few minutes.',
    famousShops: [
      { name: 'Kali Shah Khaja Shop', address: 'Silao Market, near Nalanda' },
      { name: 'Old Silao Sweets', address: 'Main Road, Silao' }
    ],
    image: 'https://images.unsplash.com/photo-1599598425947-330026e47fdd?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Tilkut',
    description: 'A traditional winter sweet made from pounded sesame seeds (til) and jaggery or sugar. Gaya is famous worldwide for its exceptionally crisp and delicious Tilkut.',
    location: 'Gaya', // Or Bodh Gaya
    ingredients: [
      'Sesame seeds (Til)', 'Jaggery (Gur) or Sugar', 'Water'
    ],
    recipe: '1. Clean and lightly roast the sesame seeds until they pop. 2. Boil jaggery or sugar with water to make a thick, sticky syrup (chashni). 3. Mix the roasted sesame seeds into the hot syrup. 4. While still hot, take small portions and pound them repeatedly into a flat, round shape until crisp. This requires immense physical labor and skill.',
    famousShops: [
      { name: 'Ramna Road Tilkut Bhandar', address: 'Ramna Road, Gaya' },
      { name: 'Pramod Laddu Bhandar', address: 'Tekari Road, Gaya' }
    ],
    image: 'https://images.unsplash.com/photo-1605658602787-847244ecbe05?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Makhana (Fox Nuts)',
    description: 'Bihar produces over 80% of India\'s Makhana. It is a highly nutritious, low-fat snack. It can be eaten roasted with spices or made into rich curries and sweet kheer.',
    location: 'Darbhanga', // Though Darbhanga isn't in destinations directly, we can use "All" or add it. Let's map it to "Patna" as available everywhere, or just leave it.
    ingredients: [
      'Raw Makhana (Lotus Seeds)', 'Ghee', 'Salt', 'Black pepper', 'Milk (for kheer)'
    ],
    recipe: 'For Roasted Makhana: 1. Heat a pan and dry roast makhana on low heat until crisp. 2. Add a spoon of ghee, salt, and pepper. Toss well. For Kheer: 1. Roast makhana in ghee. 2. Boil milk until slightly thickened. 3. Add crushed roasted makhana, sugar, and cardamom. 4. Cook until creamy.',
    famousShops: [
      { name: 'Local Markets', address: 'Darbhanga & Madhubani region' },
      { name: 'Sudha Dairy Outlets', address: 'Across Bihar' }
    ],
    image: 'https://images.unsplash.com/photo-1605292416997-6a45bd4b0b8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Maner Ka Ladoo',
    description: 'A special type of Motichoor Ladoo originating from Maner. Made with fine chickpea flour pearls, pure ghee, and sugar, it is incredibly soft and rich.',
    location: 'Patna', // Maner is near Patna
    ingredients: [
      'Besan (Gram flour)', 'Desi Ghee', 'Sugar', 'Water', 'Cardamom', 'Melon seeds'
    ],
    recipe: '1. Make a smooth batter with besan and water. 2. Pass the batter through a special perforated ladle (jhara) into hot ghee to fry tiny, pearl-like boondis. 3. Prepare a sugar syrup of one-string consistency. 4. Mix the fried boondi into the warm syrup. 5. Add cardamom and melon seeds. 6. Shape into round ladoos while slightly warm.',
    famousShops: [
      { name: 'Maner Sweets', address: 'Maner, near Patna' },
      { name: 'Patna Sweets', address: 'Frazer Road, Patna' }
    ],
    image: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?q=80&w=800&auto=format&fit=crop'
  }
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB. Wiping existing foods...');
    await Food.deleteMany();

    await Food.insertMany(foods);

    console.log(`Successfully seeded ${foods.length} foods!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
};

seedFoods();
