import { Person, Moment, Mood } from '../types';

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 'abubakar',
    name: 'Abubakar Al-Mansoor',
    username: '@abubakar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Capturing the in-between moments, architectural shadows, and weekend espresso walks. Curator of this journal.',
    location: 'London & Kyoto',
    accentColor: '#d97706', // amber-600
    joinedDate: 'January 2026',
    role: 'Journal Curator'
  },
  {
    id: 'amina',
    name: 'Amina Idris',
    username: '@amina.lens',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: '35mm film lover, coastal botanist, and documenting slow Sunday mornings.',
    location: 'Brighton, UK',
    accentColor: '#059669', // emerald-600
    joinedDate: 'February 2026',
    role: 'Contributor'
  },
  {
    id: 'tariq',
    name: 'Tariq Hassan',
    username: '@tariq.draws',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Urban sketcher, cyclist, and chasing rooftop golden hours with a sketchbook and Leica.',
    location: 'Valencia, Spain',
    accentColor: '#2563eb', // blue-600
    joinedDate: 'January 2026',
    role: 'Contributor'
  },
  {
    id: 'zainab',
    name: 'Zainab Qasim',
    username: '@zainab.eats',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    bio: 'Culinary explorer, sourdough experimenter, and ceramic collector.',
    location: 'Istanbul, Turkey',
    accentColor: '#db2777', // pink-600
    joinedDate: 'March 2026',
    role: 'Contributor'
  },
  {
    id: 'omar',
    name: 'Omar Farooq',
    username: '@omar.wander',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Alpine trails, film cameras, sunrise trail runs, and campfire acoustic notes.',
    location: 'Bergen, Norway',
    accentColor: '#7c3aed', // violet-600
    joinedDate: 'January 2026',
    role: 'Contributor'
  },
  {
    id: 'fatima',
    name: 'Fatima Zahra',
    username: '@fatima.reads',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    bio: 'Book club founder, rainy cafe seeker, and matcha connoisseur.',
    location: 'Edinburgh, Scotland',
    accentColor: '#0891b2', // cyan-600
    joinedDate: 'February 2026',
    role: 'Contributor'
  }
];

export const MOODS: Mood[] = [
  { id: 'serene', label: 'Serene & Peaceful', emoji: '🌿', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'golden', label: 'Golden Hour', emoji: '🌅', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'cozy', label: 'Warm & Cozy', emoji: '☕', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'creative', label: 'Creative Spark', emoji: '🎨', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'adventure', label: 'Adventurous', emoji: '🏔️', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'celebration', label: 'Joyful & Festivity', emoji: '✨', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'reflective', label: 'Quiet Reflection', emoji: '📖', color: 'bg-stone-100 text-stone-700 border-stone-300' }
];

export const SAMPLE_PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    title: 'Alpine Lake Mist',
    aspect: 'landscape' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80',
    title: 'Summer Portrait',
    aspect: 'portrait' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
    title: 'Morning Pour-over Coffee',
    aspect: 'square' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
    title: 'Pine Forest Sunlight',
    aspect: 'landscape' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80',
    title: 'Fresh Garden Salad Lunch',
    aspect: 'portrait' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    title: 'Foggy Sunrise Ridges',
    aspect: 'landscape' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    title: 'Candid Celebration Dinner',
    aspect: 'landscape' as const
  },
  {
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80',
    title: 'Cinque Terre Terrace Walk',
    aspect: 'portrait' as const
  }
];

export const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'moment-1',
    personId: 'abubakar',
    weekNumber: 35,
    year: 2026,
    weekLabel: 'Week 35 • Aug 24–30',
    date: '2026-08-29T18:45:00',
    title: 'Golden reflections along the Southbank & evening tea',
    description: 'Spent the final Saturday of August walking down the river path with the medium format camera. The light bounced off the glass bridges in the warmest gradient. Wrapped up with mint tea and notebook debriefs.',
    photos: [
      {
        id: 'p-1',
        url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80',
        caption: 'Tower Bridge framed during golden hour',
        aspectRatio: 'landscape',
        location: 'London Bridge'
      },
      {
        id: 'p-2',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
        caption: 'Specialty pour-over at the corner atelier',
        aspectRatio: 'portrait',
        location: 'Monmouth Coffee'
      },
      {
        id: 'p-3',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
        caption: 'Night falls over the river reflections',
        aspectRatio: 'landscape'
      }
    ],
    location: {
      name: 'Southbank Walkways',
      city: 'London',
      country: 'UK'
    },
    mood: MOODS[1], // Golden Hour
    tags: ['Photography', 'Architecture', 'Weekend Walk', 'GoldenHour'],
    reactions: {
      '❤️': 14,
      '✨': 9,
      '🔥': 5,
      '☕': 8
    },
    userReacted: {
      '❤️': true
    },
    comments: [
      {
        id: 'c-1',
        personId: 'amina',
        authorName: 'Amina Idris',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        text: 'That golden hour tone on the bridge is sublime Abubakar! What film stock did you take?',
        createdAt: '2026-08-29T20:15:00'
      },
      {
        id: 'c-2',
        personId: 'tariq',
        authorName: 'Tariq Hassan',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        text: 'Adding that coffee corner to my London sketch list next month.',
        createdAt: '2026-08-30T08:30:00'
      }
    ],
    isHighlight: true,
    audioNote: {
      duration: '0:42',
      label: 'River wind & bells chime at sunset'
    }
  },
  {
    id: 'moment-2',
    personId: 'amina',
    weekNumber: 35,
    year: 2026,
    weekLabel: 'Week 35 • Aug 24–30',
    date: '2026-08-28T14:20:00',
    title: 'Preserving wild coastal chamomile and lavender sheaves',
    description: 'Harvested botanical specimens from the cliff edges before the late summer rains roll in. The greenhouse smells like dried honey and sea salt.',
    photos: [
      {
        id: 'p-4',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        caption: 'Herbal bundles hanging to cure',
        aspectRatio: 'portrait'
      },
      {
        id: 'p-5',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
        caption: 'The cliff trail under soft afternoon fog',
        aspectRatio: 'landscape'
      }
    ],
    location: {
      name: 'Seven Sisters Cliffs',
      city: 'East Sussex',
      country: 'UK'
    },
    mood: MOODS[0], // Serene
    tags: ['Botanicals', 'SlowLiving', 'Nature', 'Coastal'],
    reactions: {
      '❤️': 18,
      '🌿': 12,
      '✨': 7
    },
    userReacted: {
      '🌿': true
    },
    comments: [
      {
        id: 'c-3',
        personId: 'fatima',
        authorName: 'Fatima Zahra',
        authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
        text: 'Save a tiny jar of that lavender for our next tea gathering please!',
        createdAt: '2026-08-28T16:40:00'
      }
    ],
    isHighlight: true
  },
  {
    id: 'moment-3',
    personId: 'tariq',
    weekNumber: 35,
    year: 2026,
    weekLabel: 'Week 35 • Aug 24–30',
    date: '2026-08-27T19:10:00',
    title: 'Rooftop sketchbook session over the terracotta tiles',
    description: '35°C in the afternoon, but once 7 PM strikes, the Mediterranean breeze turns Valencia into pure poetry. Filled six pages with fountain sketches and passersby.',
    photos: [
      {
        id: 'p-6',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
        caption: 'Terracotta roofs catching the fading sun',
        aspectRatio: 'landscape'
      },
      {
        id: 'p-7',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
        caption: 'Inks, brushes, and today’s study',
        aspectRatio: 'square'
      }
    ],
    location: {
      name: 'Barrio del Carmen',
      city: 'Valencia',
      country: 'Spain'
    },
    mood: MOODS[3], // Creative Spark
    tags: ['Sketching', 'Rooftops', 'Illustration', 'GoldenHour'],
    reactions: {
      '❤️': 11,
      '🎨': 15,
      '🔥': 8
    },
    userReacted: {},
    comments: [
      {
        id: 'c-4',
        personId: 'abubakar',
        authorName: 'Abubakar Al-Mansoor',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        text: 'The warm light on the ceramic tiles in your study is remarkable Tariq. Great perspective work!',
        createdAt: '2026-08-27T21:00:00'
      }
    ],
    isHighlight: false
  },
  {
    id: 'moment-4',
    personId: 'zainab',
    weekNumber: 35,
    year: 2026,
    weekLabel: 'Week 35 • Aug 24–30',
    date: '2026-08-26T12:30:00',
    title: 'Fig & rosemary sourdough loaves for the neighborhood table',
    description: '80% hydration with heirloom flour from Thrace. The blistered crust and fresh figs with salted butter made the entire house smell incredible.',
    photos: [
      {
        id: 'p-8',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
        caption: 'Freshly baked sourdough boules out of the hearth',
        aspectRatio: 'landscape'
      },
      {
        id: 'p-9',
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80',
        caption: 'Heirloom figs & whipped butter spread',
        aspectRatio: 'portrait'
      }
    ],
    location: {
      name: 'Kuzguncuk',
      city: 'Istanbul',
      country: 'Turkey'
    },
    mood: MOODS[2], // Warm & Cozy
    tags: ['Baking', 'Sourdough', 'NeighborhoodTable', 'Heirloom'],
    reactions: {
      '❤️': 21,
      '✨': 14,
      '☕': 12
    },
    userReacted: {
      '❤️': true
    },
    comments: [],
    isHighlight: true
  },
  {
    id: 'moment-5',
    personId: 'omar',
    weekNumber: 34,
    year: 2026,
    weekLabel: 'Week 34 • Aug 17–23',
    date: '2026-08-22T06:15:00',
    title: 'Sunrise ridge scramble above the fjords',
    description: 'Camped at 900 meters to catch first light hitting the glacial water below. Temperatures dropped to 4°C, but boiling fresh aeropress coffee while the fog burned off was unbeatable.',
    photos: [
      {
        id: 'p-10',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
        caption: 'The ridge trail winding into morning glow',
        aspectRatio: 'landscape'
      },
      {
        id: 'p-11',
        url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&auto=format&fit=crop&q=80',
        caption: 'Camp setup overlooking Hardangerfjord',
        aspectRatio: 'portrait'
      }
    ],
    location: {
      name: 'Hardanger Fjord',
      city: 'Vestland',
      country: 'Norway'
    },
    mood: MOODS[4], // Adventurous
    tags: ['Mountains', 'WildCamp', 'Norway', 'Aeropress'],
    reactions: {
      '❤️': 25,
      '🏔️': 19,
      '🔥': 14
    },
    userReacted: {
      '🏔️': true
    },
    comments: [
      {
        id: 'c-5',
        personId: 'abubakar',
        authorName: 'Abubakar Al-Mansoor',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        text: 'That scale is breathtaking Omar. What a way to wake up.',
        createdAt: '2026-08-22T09:45:00'
      }
    ],
    isHighlight: true
  },
  {
    id: 'moment-6',
    personId: 'fatima',
    weekNumber: 34,
    year: 2026,
    weekLabel: 'Week 34 • Aug 17–23',
    date: '2026-08-20T16:00:00',
    title: 'Rainy afternoon chapter notes & antique bookstore find',
    description: 'Found a 1954 clothbound edition of Scottish folklore in the corner of an old wynd bookshop. Listened to the downpour drum against the leaded glass windows for three hours.',
    photos: [
      {
        id: 'p-12',
        url: 'https://images.unsplash.com/photo-1507842229451-4f810141f5ca?w=1200&auto=format&fit=crop&q=80',
        caption: 'Towering shelves smelling of oak and cedar',
        aspectRatio: 'landscape'
      },
      {
        id: 'p-13',
        url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
        caption: 'The clothbound spine and handwritten margin notes',
        aspectRatio: 'square'
      }
    ],
    location: {
      name: 'Old Town Wynds',
      city: 'Edinburgh',
      country: 'Scotland'
    },
    mood: MOODS[6], // Quiet Reflection
    tags: ['Books', 'RainyDays', 'OldTown', 'Reading'],
    reactions: {
      '❤️': 16,
      '📖': 13,
      '☕': 18
    },
    userReacted: {},
    comments: [],
    isHighlight: false
  },
  {
    id: 'moment-7',
    personId: 'abubakar',
    weekNumber: 33,
    year: 2026,
    weekLabel: 'Week 33 • Aug 10–16',
    date: '2026-08-14T20:30:00',
    title: 'Summer lantern festival & communal outdoor cinema',
    description: 'Set up the projector on the whitewashed courtyard wall. Everyone brought dishes from their home kitchens, and we watched vintage cinema under the starry sky until midnight.',
    photos: [
      {
        id: 'p-14',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
        caption: 'Courtyard lights strung between olive trees',
        aspectRatio: 'landscape'
      },
      {
        id: 'p-15',
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80',
        caption: 'Gathered friends sharing homemade dishes',
        aspectRatio: 'portrait'
      }
    ],
    location: {
      name: 'Courtyard Pavilion',
      city: 'Granada',
      country: 'Spain'
    },
    mood: MOODS[5], // Joyful & Festivity
    tags: ['Community', 'SummerNights', 'Cinema', 'Feast'],
    reactions: {
      '❤️': 32,
      '✨': 22,
      '🔥': 11
    },
    userReacted: {
      '❤️': true,
      '✨': true
    },
    comments: [
      {
        id: 'c-6',
        personId: 'zainab',
        authorName: 'Zainab Qasim',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        text: 'The best night of August! Still thinking about those roasted spiced peaches.',
        createdAt: '2026-08-15T11:00:00'
      }
    ],
    isHighlight: true
  }
];
