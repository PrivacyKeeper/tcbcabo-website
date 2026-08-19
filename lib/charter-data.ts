const BASIC_MENU = [
  'Bottled water & assorted soft drinks',
  'Beer & margaritas',
  'Sandwiches, chips & snacks',
  'Fresh fruit',
];

const MENU_UPGRADE_NOTE = 'Want more? Ask about premium menu upgrades — gourmet platters, private chef service, and specialty drinks — when you book.';

export const CHARTER_PACKAGES = {
  fishing: {
    name: 'Fishing Charters',
    description: 'World-class sportfishing aboard our 58\' Viking',
    options: [
      { duration: '5 Hours', price: 4250, startTime: '6:00 AM', details: 'Half-day adventure targeting marlin, tuna, dorado & wahoo' },
      { duration: '8 Hours', price: 6800, startTime: '6:00 AM', details: 'Full-day expedition with maximum fishing time' },
    ],
    inclusions: [
      'All tackle',
      'Premium lures & rigging',
      'Professional filleting & vacuum sealing (up to 25 lbs)',
      'Experienced crew',
      'Ice & coolers',
    ],
    menu: BASIC_MENU,
    menuUpgradeNote: MENU_UPGRADE_NOTE,
    notes: [
      'Live bait is not included.',
      'Filleting & vacuum sealing included up to 25 lbs; additional weight available for an extra charge.',
      'Fishing license is NOT included — required for every angler. We\'re happy to help you obtain one.',
      'Fighting chair deployed as needed at the captain\'s discretion.',
    ],
  },
  whaleWatching: {
    name: 'Whale Watching',
    description: 'Witness majestic humpback & gray whales in their natural habitat',
    options: [
      { duration: '3 Hours', price: 2500, startTime: 'AM or PM departure', details: 'Fixed-price seasonal excursion (Dec–Apr), up to 6 guests' },
    ],
    inclusions: [
      'Up to 6 guests',
      'Expert whale identification guide',
      'Professional photography assistance',
    ],
    menu: BASIC_MENU,
    menuUpgradeNote: MENU_UPGRADE_NOTE,
    seasonal: 'December through April',
  },
  sunset: {
    name: 'Sunset Cruises',
    description: 'Unforgettable evenings on the Sea of Cortez',
    options: [
      { duration: 'Sunset Cruise', price: 3200, startTime: 'Departs before sunset (seasonal)', details: 'Fixed price, up to 6 guests' },
    ],
    inclusions: [
      'Up to 6 guests',
      'Premium sound system',
      'Scenic route past Land\'s End & El Arco',
    ],
    menu: BASIC_MENU,
    menuUpgradeNote: MENU_UPGRADE_NOTE,
  },
  bachelor: {
    name: 'Bachelor & Bachelorette',
    description: 'Celebrate in style on the open water',
    options: [
      { duration: '4 Hours', price: 3500, startTime: 'Flexible', details: 'Fixed price, up to 6 guests. Larger groups by arrangement with the captain.' },
    ],
    inclusions: [
      'Up to 6 guests',
      'Premium sound system & Bluetooth',
      'Custom itinerary',
      'Photo opportunities at El Arco',
    ],
    menu: BASIC_MENU,
    menuUpgradeNote: MENU_UPGRADE_NOTE,
  },
};

export const BOAT_AMENITIES = [
  { name: 'Fish Finder', icon: 'Radar' },
  { name: 'GPS Navigation', icon: 'Navigation' },
  { name: 'Flybridge', icon: 'Ship' },
  { name: 'Bathrooms', icon: 'Bath' },
  { name: 'Starlink Internet', icon: 'Wifi' },
  { name: 'Fighting Chair', icon: 'Armchair' },
  { name: 'Top-of-the-Line Equipment', icon: 'Award' },
  { name: 'Premium Sound System', icon: 'Music' },
];

export const SPECIES_DATA: Record<string, any> = {
  marlin: {
    name: 'Blue Marlin',
    scientific: 'Makaira nigricans',
    slug: 'marlin',
    type: 'fish',
    image: '/images/species/blue-marlin.jpg',
    size: '200–400+ lbs (granders exceed 1,000 lbs)',
    season: 'June – November (peak Sep–Oct)',
    techniques: 'Trolling skirted lures at 7–10 knots, live bait with circle hooks on the outriggers',
    description: `Fishing for the mighty Blue Marlin in the sunlit waters of Cabo San Lucas is widely regarded as one of offshore angling\'s greatest challenges. Their cobalt-blue backs contrast beautifully against white underbellies, and when hooked, they deliver spectacular aerial displays that can last for hours.\n\nCabo San Lucas holds the title of "Marlin Capital of the World," home to legendary events like Bisbee\'s Black & Blue tournament. When a massive Blue crashes onto your lure and peels several hundred yards of line in a fiery instant, it\'s a lifetime fishing milestone that transforms an ordinary charter into an ocean legend.`,
    facts: [
      'Can reach speeds of 50+ mph',
      'Only females grow beyond 300 lbs — nearly all trophy marlins are hens',
      'Cabo is the "Marlin Capital of the World"',
      'Granders (1,000+ lbs) are caught every season in Cabo waters',
    ],
    seoKeywords: 'Cabo blue marlin fishing, marlin capital of the world, catch blue marlin Cabo San Lucas, deep sea marlin fishing Baja',
  },
  tuna: {
    name: 'Yellowfin Tuna',
    scientific: 'Thunnus albacares',
    slug: 'tuna',
    type: 'fish',
    image: '/images/species/yellowfin-tuna.jpg',
    size: '30–150 lbs (cows exceed 200+ lbs)',
    season: 'June – November (peak Jul–Oct)',
    techniques: 'Chunk & chum drifting, kite fishing with live bait, targeting dolphin-associated schools',
    description: `Yellowfin Tuna are renowned both for pristine sushi-grade quality and punishing fights at the end of a sportfishing rod. Identifiable by iconic long yellow sickle fins, an adult Yellowfin is virtually a bullet of raw muscle designed by evolution for pure hydrodynamic acceleration.\n\nEngaging these powerful fish brings intense, rod-doubling vertical battles near the coastal drop-offs and sea mounts around Los Cabos. Cabo waters hold legendary benchmarks including past IGFA records exceeding 400 pounds. Chasing a "cow" tuna demands grit and seasoned tactics perfectly matched against these pelagic freight trains.`,
    facts: [
      'Warm-blooded — one of few fish species with this trait',
      'Can reach speeds of 47 mph',
      'Grow to over 100 lbs before age 4',
      'Highly prized for sashimi and sushi',
    ],
    seoKeywords: 'Yellowfin tuna sportfishing Cabo, cow tuna Cabo San Lucas, big game tuna fishing Mexico',
  },
  dorado: {
    name: 'Dorado (Mahi-Mahi)',
    scientific: 'Coryphaena hippurus',
    slug: 'dorado',
    type: 'fish',
    image: '/images/species/dorado-mahi-mahi.jpg',
    size: '15–40 lbs (bulls exceed 50+ lbs)',
    season: 'June – November',
    techniques: 'Trolling feathers near floating debris, sight-casting poppers into feeding schools',
    description: `Few fish embody the visual theater of deep-sea fishing quite like the iridescent Dorado. These prolific predators flash dynamic greens, blues, and electric golds while hunting — a spectacle that fades rapidly once they leave the water.\n\nAnglers targeting Dorado off Cabo fall deeply in love with their furious acrobatic spirit. Once hooked, they explode into towering aerial leaps, shaking brilliant emerald bodies over the wake. Yielding tender, incredibly mild fillets, Dorado consistently rank as both a visually stunning game fish and one of the most delightful post-adventure dinners brought dockside.`,
    facts: [
      'Males ("bulls") have distinctive blunt foreheads',
      'One of the fastest-growing fish in the ocean',
      'Congregate under floating debris and weed lines',
      'Colors change dramatically when caught — from vibrant to muted',
    ],
    seoKeywords: 'Dorado fishing Cabo San Lucas, mahi-mahi charter Baja, catch dorado Cabo, Cabo dorado season',
  },
  wahoo: {
    name: 'Wahoo',
    scientific: 'Acanthocybium solandri',
    slug: 'wahoo',
    type: 'fish',
    image: '/images/species/wahoo.jpg',
    size: '30–80 lbs (record: 184 lbs)',
    season: 'September – November',
    techniques: 'High-speed trolling (14–22 knots), wire leaders, heavy skirted lures',
    description: `Shaped like an underwater javelin with tiger-patterned flanks that light up in radiant zebra-blue, the Wahoo lives and breathes speed. Operating near ocean drop-offs and dramatic pinnacles like the legendary Gordo Banks, these apex predators attack with horrifying force.\n\nHitting 60 mph comes naturally for this lunate-tailed ambush predator — every bite translates to screaming drag and reels dumping at speeds novice fishermen struggle to comprehend. Wahoo forces charter captains into pulling heavy artillery at incredible velocities, delivering adrenaline-packed pursuits that combine raw power with razor-sharp ocean finesse.`,
    facts: [
      'Can reach 60 mph — one of the ocean\'s fastest fish',
      'Lacks a swim bladder, allowing rapid depth changes',
      'Has no close evolutionary relatives',
      'Cabo holds a historic 184-lb record',
    ],
    seoKeywords: 'Wahoo fishing Cabo, speed trolling wahoo Baja, catch wahoo Cabo San Lucas, Cabo wahoo season',
  },
  'humpback-whale': {
    name: 'Humpback Whale',
    scientific: 'Megaptera novaeangliae',
    slug: 'humpback-whale',
    type: 'whale',
    image: '/images/species/humpback-whale.jpg',
    size: '45–60 feet, 40+ metric tons',
    season: 'December – April (peak Jan–Mar)',
    techniques: 'Early morning licensed SEMARNAT charters, hydrophone listening, maintaining 100-ft observation distance',
    description: `Escaping harsh Arctic conditions, majestic Humpback whale pods migrate to the warm waters near Cabo San Lucas to nurse their calves. With massive pectoral fins spanning over a third of their 50-foot bodies, they navigate these coastal waters with remarkable grace.\n\nHumpback whales deliver nature\'s finest show — dramatic surface breaches that send fifty tons of whale rocketing out of Pacific spray. Supported by Mexican 100-foot buffer guidelines, embarking among them feels like being invited inside an ancient gentle giant kingdom peacefully passing through on their long azure migration.`,
    facts: [
      'Male songs are audible for hundreds of miles underwater',
      'Tail flukes are unique like fingerprints',
      'Migrate over 5,000 miles to reach Cabo waters',
      'Calves gain 100 pounds per day nursing',
    ],
    seoKeywords: 'Humpback whale watching Cabo, whale tours Cabo San Lucas, Baja whale season, see whales Cabo Mexico',
  },
  'gray-whale': {
    name: 'Gray Whale',
    scientific: 'Eschrichtius robustus',
    slug: 'gray-whale',
    type: 'whale',
    image: '/images/species/gray-whale.jpg',
    size: '40–50 feet, 35–45 tons',
    season: 'December – March (peak Jan–Mar)',
    techniques: 'Offshore observation near Cabo headlands, multi-day excursions to Magdalena Bay or San Ignacio Lagoon',
    description: `The Gray Whale\'s epic migration traces right past the rocky bluffs of Cabo — a crucial highway on their staggering 10,000+ mile commute from Alaskan feeding grounds to warm Baja Mexican lagoons. These slate-marbled beauties drift quietly like ghostly submarines covered in barnacles and battle scars.\n\nGray whales harbor perhaps the most awe-inspiring interaction potential in all of wildlife tourism. In calm Mexican nursery lagoons north of Cabo, they repeatedly present infant calves alongside gentle approaching boats — an unbelievable spectacle bridging centuries of whaling history, now replaced by shared curiosity that spans profoundly across species.`,
    facts: [
      'Complete a 10,000+ mile annual migration',
      'Covered in barnacles — each pattern unique',
      'Bottom feeders — scoop mud to filter crustaceans',
      'Known as "friendly whales" in Baja lagoons',
    ],
    seoKeywords: 'Gray whale watching Baja, Cabo gray whale migration, Magdalena Bay whale tours, friendly whale encounters Mexico',
  },
};

export const GALLERY_IMAGES = [
  { src: '/images/gallery/tcb-stern.jpg', alt: 'TCB stern view showing hull and logo', category: 'boat' },
  { src: '/images/gallery/fishing-equipment.jpg', alt: 'Premium fishing rods and tackle on deck', category: 'fishing' },
  { src: '/images/gallery/tournament-win.jpg', alt: 'TCB crew with $37,200 tournament winning check', category: 'tournament' },
  { src: '/images/gallery/interior-dining.jpg', alt: 'Luxury interior dining with fresh sushi aboard TCB', category: 'dining' },
  { src: '/images/gallery/boat-aerial.jpg', alt: 'TCB 58\' Viking at sea - aerial view', category: 'boat' },
  { src: '/images/gallery/boat-marina.jpg', alt: 'TCB docked at Cabo San Lucas marina', category: 'boat' },
  { src: '/images/gallery/boat-night-leds.jpg', alt: 'TCB illuminated with blue LEDs at night dock', category: 'boat' },
  { src: '/images/gallery/fishing-rods-closeup.jpg', alt: 'Close-up of professional fishing rod setup', category: 'fishing' },
];

// Cash Flow is paid through Captain Paco's Clip account (not Stripe).
// clipPrice = the exact USD amount of the fixed Clip payment link (already
// grossed up for Clip's fee of 2.99% + $1 MXN + IVA so Paco nets the cash
// price). clipUrl = the fixed-amount Clip link Paco creates in the Clip app.
// TODO: replace the two placeholder URLs below with the real links from Paco.
export const CASH_FLOW_CLIP_PLACEHOLDER = 'CLIP_LINK_PENDING';

export const CASH_FLOW_PACKAGE = {
  name: "Cash Flow — 26' Angler",
  description: 'Private fishing charters for up to 4 guests',
  options: [
    {
      duration: '5 Hours',
      price: 950,
      clipPrice: 985,
      clipUrl: CASH_FLOW_CLIP_PLACEHOLDER, // TODO: Paco's $985 USD Clip link
      startTime: '6:00 AM',
      details: 'Half-day private fishing charter',
    },
    {
      duration: '8 Hours',
      price: 1400,
      clipPrice: 1451,
      clipUrl: CASH_FLOW_CLIP_PLACEHOLDER, // TODO: Paco's $1,451 USD Clip link
      startTime: '6:00 AM',
      details: 'Full-day private fishing charter',
    },
  ],
  inclusions: [
    'Professional captain and crew',
    'Fishing equipment',
    'Bait and terminal tackle',
    'Catch cleaning',
  ],
  notes: [
    'Maximum capacity: 4 guests.',
    'Cash Flow is available for fishing charters only.',
    'A 50% deposit secures the reservation when booking 30 or more days in advance.',
  ],
};
