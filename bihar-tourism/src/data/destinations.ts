export interface Destination {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  category: 'eco' | 'cultural' | 'both';
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  highlights: string[];
  bestTimeToVisit: string;
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: 'Bodh Gaya',
    location: 'Gaya District, Bihar',
    description: 'The sacred place where Lord Buddha attained enlightenment under the Bodhi Tree. One of the most important Buddhist pilgrimage sites in the world.',
    image: 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80',
    category: 'cultural',
    rating: 4.8,
    coordinates: { lat: 24.6951, lng: 84.9914 },
    highlights: ['Mahabodhi Temple', 'Bodhi Tree', 'Great Buddha Statue', 'Monasteries'],
    bestTimeToVisit: 'October to March'
  },
  {
    id: 2,
    name: 'Valmiki Tiger Reserve',
    location: 'West Champaran District, Bihar',
    description: 'A pristine wildlife sanctuary and tiger reserve nestled in the Himalayan foothills, home to diverse flora and fauna.',
    image: 'https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80',
    category: 'eco',
    rating: 4.6,
    coordinates: { lat: 27.0544, lng: 84.0355 },
    highlights: ['Tiger Safari', 'Bird Watching', 'Nature Trails', 'River Gandak'],
    bestTimeToVisit: 'November to April'
  },
  {
    id: 3,
    name: 'Nalanda University Ruins',
    location: 'Nalanda District, Bihar',
    description: 'Ancient seat of learning and one of the world\'s first residential universities, dating back to the 5th century CE.',
    image: 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80',
    category: 'cultural',
    rating: 4.7,
    coordinates: { lat: 25.1381, lng: 85.4422 },
    highlights: ['Archaeological Site', 'Nalanda Museum', 'Hiuen Tsang Memorial', 'Ancient Viharas'],
    bestTimeToVisit: 'October to March'
  },
  {
    id: 4,
    name: 'Kanha Wildlife Sanctuary',
    location: 'Siwan District, Bihar',
    description: 'A lush forest reserve known for its rich biodiversity, including various species of deer, birds, and other wildlife.',
    image: 'https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80',
    category: 'eco',
    rating: 4.5,
    coordinates: { lat: 26.3041, lng: 84.3567 },
    highlights: ['Wildlife Safari', 'Bird Sanctuary', 'Forest Trekking', 'Photography'],
    bestTimeToVisit: 'December to May'
  },
  {
    id: 5,
    name: 'Vikramshila University',
    location: 'Bhagalpur District, Bihar',
    description: 'Historic Buddhist university established by King Dharmapala, once a renowned center of Buddhist learning.',
    image: 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80',
    category: 'cultural',
    rating: 4.4,
    coordinates: { lat: 25.3333, lng: 86.9667 },
    highlights: ['Excavation Site', 'Buddhist Artifacts', 'Temple Remains', 'Museum'],
    bestTimeToVisit: 'October to February'
  },
  {
    id: 6,
    name: 'Bhimbandh Wildlife Sanctuary',
    location: 'Munger District, Bihar',
    description: 'A beautiful wildlife sanctuary surrounded by hills and forests, offering excellent opportunities for nature lovers.',
    image: 'https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80',
    category: 'eco',
    rating: 4.3,
    coordinates: { lat: 25.1167, lng: 86.1833 },
    highlights: ['Wildlife Spotting', 'Hot Springs', 'Hilly Terrain', 'Picnic Spots'],
    bestTimeToVisit: 'November to March'
  },
  {
    id: 7,
    name: 'Patna Sahib Gurudwara',
    location: 'Patna, Bihar',
    description: 'A sacred Sikh shrine marking the birthplace of Guru Gobind Singh Ji, the tenth Sikh Guru. A major pilgrimage destination.',
    image: 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80',
    category: 'cultural',
    rating: 4.9,
    coordinates: { lat: 25.6093, lng: 85.5355 },
    highlights: ['Main Shrine', 'Community Kitchen', 'Historical Artifacts', 'Prayer Halls'],
    bestTimeToVisit: 'Year-round'
  },
  {
    id: 8,
    name: 'Rajgir',
    location: 'Nalanda District, Bihar',
    description: 'Ancient city that was the capital of Magadha kingdom, significant in Buddhist and Jain history with hot springs and hills.',
    image: 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80',
    category: 'both',
    rating: 4.6,
    coordinates: { lat: 25.0333, lng: 85.4167 },
    highlights: ['Venu Vihara', 'Hot Springs', 'Gridhakuta Hill', 'Peace Pagoda'],
    bestTimeToVisit: 'October to March'
  },
  {
    id: 9,
    name: 'Kaimur Wildlife Sanctuary',
    location: 'Rohtas District, Bihar',
    description: 'Expansive wildlife sanctuary featuring dense forests, waterfalls, and diverse wildlife including leopards and sambhar.',
    image: 'https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80',
    category: 'eco',
    rating: 4.4,
    coordinates: { lat: 24.9167, lng: 84.0833 },
    highlights: ['Waterfalls', 'Cave Paintings', 'Wildlife Photography', 'Trekking'],
    bestTimeToVisit: 'October to June'
  },
  {
    id: 10,
    name: 'Vaishali',
    location: 'Muzaffarpur District, Bihar',
    description: 'Ancient city where Lord Buddha delivered his last sermon and announced his Mahaparinirvana. Important archaeological site.',
    image: 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80',
    category: 'cultural',
    rating: 4.5,
    coordinates: { lat: 25.9833, lng: 85.0833 },
    highlights: ['Ashoka Pillar', 'Buddhist Stupa', 'Jain Temple', 'Archaeological Museum'],
    bestTimeToVisit: 'November to February'
  }
];

export const featuredDestinations = destinations.filter(d => d.rating >= 4.6);

export const ecoTourismDestinations = destinations.filter(d => d.category === 'eco' || d.category === 'both');

export const culturalDestinations = destinations.filter(d => d.category === 'cultural' || d.category === 'both');
