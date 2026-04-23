const destinations = [
  {
    name: 'Bodh Gaya',
    description:
      'Bodh Gaya is one of the most sacred Buddhist pilgrimage sites in the world. It is the place where Siddhartha Gautama attained enlightenment under the Bodhi Tree and became the Buddha. The Mahabodhi Temple, a UNESCO World Heritage Site, stands as an iconic symbol of this spiritual awakening.',
    location: 'Gaya district, Bihar',
    type: 'cultural',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahabodhi_Temple_in_Bodhgaya.jpg/1280px-Mahabodhi_Temple_in_Bodhgaya.jpg',
    ],
    coordinates: { lat: 24.6961, lng: 84.9912 },
    rating: 4.9,
    bestSeason: 'Winter',
    entryFee: 'Free (Temple: ₹100 for foreigners)',
    ecoScore: 85,
    interests: ['Spiritual', 'History', 'Architecture'],
    budget: 'Mid-range',
    activities: ['Meditation', 'Temple Visit', 'Photography'],
  },
  {
    name: 'Nalanda',
    description:
      'Nalanda was one of the greatest centers of learning in the ancient world. The ruins of this legendary Nalanda University draw scholars, historians, and travelers from around the globe. The site is a UNESCO World Heritage Site and houses an excellent museum displaying artifacts from excavations.',
    location: 'Nalanda district, Bihar',
    type: 'historical',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nalanda_university_ruins.jpg/1280px-Nalanda_university_ruins.jpg',
    ],
    coordinates: { lat: 25.1361, lng: 85.4436 },
    rating: 4.7,
    bestSeason: 'Winter',
    entryFee: '₹25 (Indians) / ₹300 (Foreigners)',
    ecoScore: 70,
    interests: ['History', 'Architecture'],
    budget: 'Budget',
    activities: ['Sightseeing', 'Museum Tour', 'History Walk'],
  },
  {
    name: 'Rajgir',
    description:
      'Rajgir is an ancient city surrounded by hills and valleys, renowned for its spiritual heritage connected to both Buddhism and Jainism. The Vishwa Shanti Stupa atop the Ratnagiri Hill, natural hot springs, and the ancient Cyclopean Wall make it a fascinating destination.',
    location: 'Nalanda district, Bihar',
    type: 'historical',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rajgir_Peace_Pagoda.jpg/1280px-Rajgir_Peace_Pagoda.jpg',
    ],
    coordinates: { lat: 25.0292, lng: 85.4218 },
    rating: 4.5,
    bestSeason: 'Winter',
    entryFee: 'Free',
    ecoScore: 80,
    interests: ['History', 'Nature', 'Spiritual'],
    budget: 'Mid-range',
    activities: ['Trekking', 'Cable Car Ride', 'Hot Spring Bath'],
  },
  {
    name: 'Valmiki National Park',
    description:
      'Valmiki National Park is the only national park in Bihar and part of the larger Valmiki Tiger Reserve. Located in the Himalayan foothills, it is home to Bengal tigers, leopards, gharials, elephants, and over 250 species of birds. The park offers unique wildlife safaris through diverse ecosystems.',
    location: 'West Champaran district, Bihar',
    type: 'eco',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Valmiki_Tiger_Reserve.jpg/1280px-Valmiki_Tiger_Reserve.jpg',
    ],
    coordinates: { lat: 27.5411, lng: 84.3025 },
    rating: 4.6,
    bestSeason: 'Winter',
    entryFee: '₹200 (Indians) / ₹500 (Foreigners)',
    ecoScore: 95,
    interests: ['Wildlife', 'Nature', 'Photography'],
    budget: 'Luxury',
    activities: ['Safari', 'Bird Watching', 'Nature Walk'],
  },
  {
    name: 'Vikramshila',
    description:
      'Vikramshila was one of the most important centers of Buddhist learning during the Pala Empire. The ruins of this ancient university complex, along with a museum housing rare Buddhist manuscripts and sculptures, offer a remarkable glimpse into Bihar\'s glorious intellectual past.',
    location: 'Bhagalpur district, Bihar',
    type: 'historical',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vikramshila_ruins.jpg/1280px-Vikramshila_ruins.jpg',
    ],
    coordinates: { lat: 25.3167, lng: 87.2833 },
    rating: 4.3,
    bestSeason: 'Winter',
    entryFee: '₹20 (Indians) / ₹200 (Foreigners)',
    ecoScore: 65,
    interests: ['History', 'Architecture'],
    budget: 'Budget',
    activities: ['Sightseeing', 'Museum Visit'],
  },
  {
    name: 'Pawapuri',
    description:
      'Pawapuri, also known as Apapuri (the sinless city), is an important Jain pilgrimage site where Lord Mahavira, the 24th Tirthankara, attained moksha (liberation). The Jal Mandir, a white marble temple situated in the middle of a lotus pond, is the most revered structure here.',
    location: 'Nalanda district, Bihar',
    type: 'cultural',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pawapuri_Jal_Mandir.jpg/1280px-Pawapuri_Jal_Mandir.jpg',
    ],
    coordinates: { lat: 25.2214, lng: 85.5356 },
    rating: 4.4,
    bestSeason: 'Winter',
    entryFee: 'Free',
    ecoScore: 75,
    interests: ['Spiritual', 'Nature', 'Architecture'],
    budget: 'Mid-range',
    activities: ['Temple Visit', 'Photography'],
  },
];

const festivals = [
  {
    name: 'Chhath Puja',
    location: 'Statewide (Major ghats: Patna, Gaya)',
    month: 'October/November',
    description:
      'Chhath Puja is the most celebrated folk festival of Bihar, dedicated to the Sun God (Surya) and Chhathi Maiya. Celebrated over four days, devotees offer prayers at riverbanks during sunrise and sunset. It is one of the most environmentally friendly festivals, with no use of idols or synthetic colors.',
    images: [
      '/destinations/patna.png',
    ],
  },
  {
    name: 'Sonepur Mela',
    location: 'Sonepur, Saran district',
    month: 'November',
    description:
      'Sonepur Mela, held at the confluence of the Ganga and Gandak rivers, is one of the largest livestock and trade fairs in Asia. Traditionally held after Kartik Purnima, it runs for about a month and attracts traders, artisans, performers, and tourists from across India and the world.',
    images: [
      '/destinations/vaishali.png',
    ],
  },
  {
    name: 'Rajgir Mahotsav',
    location: 'Rajgir, Nalanda district',
    month: 'October',
    description:
      'Rajgir Mahotsav is a cultural extravaganza organized by the Bihar government to showcase the art, music, dance, and cultural heritage of Bihar. Held amid the ancient hills of Rajgir, the three-day festival features folk performances, classical music, and artisan markets.',
    images: [
      '/destinations/rajgir.png',
    ],
  },
  {
    name: 'Buddha Purnima',
    location: 'Bodh Gaya, Gaya district',
    month: 'May',
    description:
      'Buddha Purnima marks the birth, enlightenment, and death of Gautama Buddha and is celebrated with great devotion in Bodh Gaya. Thousands of Buddhist pilgrims from Tibet, Japan, Sri Lanka, Thailand, and around the world visit the Mahabodhi Temple to offer prayers and meditate.',
    images: [
      '/destinations/bodh_gaya.png',
    ],
  },
];

const ecoSites = [
  {
    name: 'Valmiki Tiger Reserve',
    wildlife: [
      'Bengal Tiger',
      'Leopard',
      'Asian Elephant',
      'Gharial',
      'Sloth Bear',
      'Wild Boar',
      'Spotted Deer',
      'Indian Bison',
    ],
    ecoActivities: [
      'Jeep Safari',
      'Elephant Safari',
      'Bird Watching',
      'Nature Walks',
      'River Rafting on Gandak',
      'Wildlife Photography',
    ],
    parkType: 'Tiger Reserve & National Park',
    location: 'West Champaran district, Bihar',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Valmiki_Tiger_Reserve.jpg/1280px-Valmiki_Tiger_Reserve.jpg',
    ],
  },
  {
    name: 'Kawar Lake Bird Sanctuary',
    wildlife: [
      'Siberian Crane',
      'Bar-headed Goose',
      'Northern Pintail',
      'Common Pochard',
      'Gadwall',
      'Eurasian Wigeon',
      'Indian Spot-billed Duck',
    ],
    ecoActivities: [
      'Bird Watching',
      'Boat Rides',
      'Nature Photography',
      'Wetland Ecology Tours',
    ],
    parkType: 'Bird Sanctuary & Ramsar Wetland',
    location: 'Begusarai district, Bihar',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kawar_Lake.jpg/1280px-Kawar_Lake.jpg',
    ],
  },
  {
    name: 'Bhimbandh Wildlife Sanctuary',
    wildlife: [
      'Leopard',
      'Nilgai',
      'Wild Boar',
      'Indian Python',
      'Porcupine',
      'Sambar Deer',
      'Jackal',
    ],
    ecoActivities: [
      'Nature Trekking',
      'Hot Spring Bathing',
      'Wildlife Safari',
      'Bird Watching',
      'Rock Climbing',
    ],
    parkType: 'Wildlife Sanctuary',
    location: 'Munger district, Bihar',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Bhimbandh.jpg/1280px-Bhimbandh.jpg',
    ],
  },
];

module.exports = { destinations, festivals, ecoSites };
