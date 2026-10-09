// Fleet Database for VELOCITY Luxury Car Rental
const CARS_DATA = [
  {
    id: "porsche-gt3-rs",
    name: "Porsche 911 GT3 RS",
    brand: "Porsche",
    year: 2024,
    category: "supercar",
    tagline: "Track-bred aerodynamic masterpiece with atmospheric flat-six roar.",
    pricePerDay: 850,
    deposit: 1500,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.98,
    reviewsCount: 84,
    badge: "Most Popular",
    specs: {
      power: "518 HP",
      acceleration: "3.0s",
      topSpeed: "184 mph",
      transmission: "Automatic (PDK)",
      seats: 2,
      fuel: "Gasoline (V6 4.0L)",
      luggage: "1 Large Bag",
      driveTrain: "RWD"
    },
    features: [
      "Weissach Package Carbon aero",
      "DRS Drag Reduction System",
      "Bose Surround Audio",
      "Apple CarPlay & Navigation",
      "Full Ceramic Composite Brakes (PCCB)",
      "Club Sport Roll Cage"
    ],
    popular: true
  },
  {
    id: "ferrari-f8-tributo",
    name: "Ferrari F8 Tributo",
    brand: "Ferrari",
    year: 2023,
    category: "supercar",
    tagline: "710 horsepower twin-turbo V8 Italian thoroughbred.",
    pricePerDay: 1250,
    deposit: 2500,
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 5.0,
    reviewsCount: 62,
    badge: "Exotic Star",
    specs: {
      power: "710 HP",
      acceleration: "2.8s",
      topSpeed: "211 mph",
      transmission: "7-Speed Dual Clutch",
      seats: 2,
      fuel: "Gasoline (3.9L Twin-Turbo)",
      luggage: "2 Carry-ons",
      driveTrain: "RWD"
    },
    features: [
      "JBL High-End Sound System",
      "Carbon Fibre Steering Wheel with Shift LEDs",
      "Passenger Display Screen",
      "Titanium Sports Exhaust",
      "Front Suspension Lifter"
    ],
    popular: true
  },
  {
    id: "lamborghini-huracan-evo",
    name: "Lamborghini Huracán EVO Spyder",
    brand: "Lamborghini",
    year: 2024,
    category: "convertible",
    tagline: "Unadulterated naturally aspirated V10 open-air symphony.",
    pricePerDay: 1390,
    deposit: 2500,
    image: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.96,
    reviewsCount: 71,
    badge: "Open Top",
    specs: {
      power: "631 HP",
      acceleration: "3.1s",
      topSpeed: "202 mph",
      transmission: "7-Speed LDF Dual Clutch",
      seats: 2,
      fuel: "Gasoline (5.2L V10)",
      luggage: "1 Carry-on",
      driveTrain: "AWD"
    },
    features: [
      "Sensonum 390W Audio",
      "Electro-hydraulic Soft Top (17s deployment)",
      "LDVI Predictive Vehicle Dynamics",
      "Sport Exhaust System",
      "Alcantara Sportivo Interior"
    ],
    popular: true
  },
  {
    id: "mercedes-amg-g63",
    name: "Mercedes-AMG G 63 'G-Wagon'",
    brand: "Mercedes-Benz",
    year: 2024,
    category: "suv",
    tagline: "Iconic military-grade luxury road presence with twin-turbo punch.",
    pricePerDay: 680,
    deposit: 1200,
    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.94,
    reviewsCount: 110,
    badge: "Celebrity Favorite",
    specs: {
      power: "577 HP",
      acceleration: "4.4s",
      topSpeed: "149 mph",
      transmission: "9-Speed AMG SPEEDSHIFT",
      seats: 5,
      fuel: "Gasoline (4.0L Bi-Turbo)",
      luggage: "4 Large Suitcases",
      driveTrain: "AWD (3 Differential Locks)"
    },
    features: [
      "Burmester 15-Speaker 3D Surround",
      "Massaging & Heated Nappa Seats",
      "Dual 12.3-inch Cockpit Displays",
      "AMG Performance Side-Exit Exhaust",
      "Adaptive Damping Suspension"
    ],
    popular: true
  },
  {
    id: "rolls-royce-ghost",
    name: "Rolls-Royce Ghost Series II",
    brand: "Rolls-Royce",
    year: 2024,
    category: "sedan",
    tagline: "The pinnacle of effortless bespoke tranquility and whispered power.",
    pricePerDay: 1650,
    deposit: 3000,
    image: "https://images.unsplash.com/photo-1631295868223-63265840d001?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631295868223-63265840d001?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 5.0,
    reviewsCount: 39,
    badge: "Ultra Luxury",
    specs: {
      power: "563 HP",
      acceleration: "4.6s",
      topSpeed: "155 mph",
      transmission: "Satellite-Aided 8-Speed",
      seats: 5,
      fuel: "Gasoline (6.75L Twin-Turbo V12)",
      luggage: "4 Large Suitcases",
      driveTrain: "AWD"
    },
    features: [
      "Starlight Headliner with Shooting Stars",
      "Effortless Power-Assist Suicide Doors",
      "Rear Theater Entertainment",
      "Champagne Chiller with Crystal Flutes",
      "Planar Suspension 'Magic Carpet Ride'"
    ],
    popular: true
  },
  {
    id: "tesla-model-s-plaid",
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    year: 2024,
    category: "electric",
    tagline: "Tri-motor electric titan delivering unreal sub-2 second acceleration.",
    pricePerDay: 390,
    deposit: 800,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.91,
    reviewsCount: 145,
    badge: "Fastest EV",
    specs: {
      power: "1,020 HP",
      acceleration: "1.99s",
      topSpeed: "200 mph",
      transmission: "Direct Drive 1-Speed",
      seats: 5,
      fuel: "Electric (396 mi range)",
      luggage: "3 Large Suitcases + Frunk",
      driveTrain: "Tri-Motor AWD"
    },
    features: [
      "Full Self-Driving (Supervised) Hardware 4",
      "22-Speaker 960W Audio with Active Road Noise Cancelling",
      "17-inch Cinematic OLED Gaming Screen",
      "Free Supercharging Included",
      "Yoke Steering with Yoke Haptics"
    ],
    popular: true
  },
  {
    id: "mclaren-720s",
    name: "McLaren 720S Spider",
    brand: "McLaren",
    year: 2023,
    category: "convertible",
    tagline: "Dihedral doors, carbon Monocage II, and fighter jet cockpit.",
    pricePerDay: 1450,
    deposit: 2800,
    image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.97,
    reviewsCount: 48,
    badge: "Supercar",
    specs: {
      power: "710 HP",
      acceleration: "2.8s",
      topSpeed: "212 mph",
      transmission: "7-Speed Dual Clutch SSG",
      seats: 2,
      fuel: "Gasoline (4.0L Twin-Turbo V8)",
      luggage: "2 Soft Bags",
      driveTrain: "RWD"
    },
    features: [
      "Electrochromic Retractable Glass Roof",
      "Proactive Chassis Control II",
      "Bowers & Wilkins 12-Speaker Sound",
      "Folding Driver Display Screen",
      "Variable Drift Control"
    ],
    popular: false
  },
  {
    id: "range-rover-autobiography",
    name: "Range Rover Autobiography LWB",
    brand: "Land Rover",
    year: 2024,
    category: "suv",
    tagline: "First-class peerless comfort with peerless off-road authority.",
    pricePerDay: 550,
    deposit: 1000,
    image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.92,
    reviewsCount: 88,
    badge: "Executive Comfort",
    specs: {
      power: "523 HP",
      acceleration: "4.5s",
      topSpeed: "155 mph",
      transmission: "8-Speed Automatic",
      seats: 5,
      fuel: "Gasoline (4.4L Twin-Turbo V8)",
      luggage: "5 Large Bags",
      driveTrain: "All-Wheel Steering AWD"
    },
    features: [
      "Executive Rear Class Reclining Seats with Calf Rest",
      "Meridian 35-Speaker Signature Sound",
      "Electronic Air Suspension with Dynamic Response Pro",
      "Tailgate Event Suite with Leather Cushions",
      "Cabin Air Purification Pro"
    ],
    popular: false
  },
  {
    id: "porsche-taycan-turbo-s",
    name: "Porsche Taycan Turbo S",
    brand: "Porsche",
    year: 2024,
    category: "electric",
    tagline: "Pure Porsche soul electrified with launch control overboost.",
    pricePerDay: 480,
    deposit: 1000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.95,
    reviewsCount: 93,
    badge: "Zero Emission",
    specs: {
      power: "750 HP",
      acceleration: "2.6s",
      topSpeed: "161 mph",
      transmission: "2-Speed Rear / 1-Speed Front",
      seats: 4,
      fuel: "Electric (280 mi range)",
      luggage: "3 Bags (Frunk + Trunk)",
      driveTrain: "Dual-Motor AWD"
    },
    features: [
      "800-Volt Architecture (5% to 80% in 18 min)",
      "Porsche Electric Sport Sound",
      "Burmester 3D High-End Surround Sound",
      "Panoramic Fixed Glass Roof",
      "Rear-Axle Steering with Power Steering Plus"
    ],
    popular: false
  },
  {
    id: "bmw-m4-competition",
    name: "BMW M4 Competition xDrive",
    brand: "BMW",
    year: 2024,
    category: "supercar",
    tagline: "High-revving precision carving instrument with aggressive stance.",
    pricePerDay: 420,
    deposit: 900,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.89,
    reviewsCount: 112,
    badge: "Track Ready",
    specs: {
      power: "503 HP",
      acceleration: "3.4s",
      topSpeed: "180 mph",
      transmission: "8-Speed M Steptronic",
      seats: 4,
      fuel: "Gasoline (3.0L TwinPower Turbo)",
      luggage: "2 Large Suitcases",
      driveTrain: "M xDrive AWD / RWD Mode"
    },
    features: [
      "M Carbon Bucket Seats",
      "M Drive Professional with 10-Stage Traction Control",
      "Harman Kardon Surround Sound System",
      "Head-Up Display with M-Specific Graphics",
      "Iconic Carbon Roof"
    ],
    popular: false
  },
  {
    id: "audi-rs6-avant",
    name: "Audi RS6 Avant Performance",
    brand: "Audi",
    year: 2024,
    category: "sedan",
    tagline: "The ultimate supercar killer disguised as an aggressive estate wagon.",
    pricePerDay: 510,
    deposit: 1000,
    image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.93,
    reviewsCount: 76,
    badge: "Versatile Beast",
    specs: {
      power: "621 HP",
      acceleration: "3.3s",
      topSpeed: "190 mph",
      transmission: "8-Speed Tiptronic",
      seats: 5,
      fuel: "Gasoline (4.0L Bi-Turbo V8)",
      luggage: "4 Large Suitcases",
      driveTrain: "Quattro All-Wheel Drive"
    },
    features: [
      "Bang & Olufsen 3D Advanced Sound System",
      "RS Ceramic Brakes with Red Calipers",
      "HD Matrix LED Headlights with Laser Light",
      "Dynamic All-Wheel Steering",
      "RS Sport Exhaust with Black Oval Tips"
    ],
    popular: false
  },
  {
    id: "aston-martin-db11",
    name: "Aston Martin DB11 V8 Volante",
    brand: "Aston Martin",
    year: 2023,
    category: "convertible",
    tagline: "Timeless British grandeur with captivating silhouette and roar.",
    pricePerDay: 920,
    deposit: 1800,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.96,
    reviewsCount: 53,
    badge: "Pure Elegance",
    specs: {
      power: "528 HP",
      acceleration: "4.0s",
      topSpeed: "192 mph",
      transmission: "8-Speed ZF Automatic",
      seats: 4,
      fuel: "Gasoline (4.0L Twin-Turbo V8)",
      luggage: "2 Bags",
      driveTrain: "RWD"
    },
    features: [
      "K-Fold Heated Acoustic Convertible Hood",
      "Hand-stitched Bridge of Weir Leather",
      "Aston Martin Premium Audio",
      "360-Degree Camera with Parking Assist",
      "Aeroblade Virtual Spoiler Technology"
    ],
    popular: false
  }
];

// Available Locations
const LOCATIONS = [
  { id: "lax", name: "Los Angeles - LAX VIP Terminal", city: "Los Angeles", address: "1 World Way, Los Angeles, CA" },
  { id: "beverly", name: "Beverly Hills Flagship Showroom", city: "Los Angeles", address: "9600 Wilshire Blvd, Beverly Hills, CA" },
  { id: "jfk", name: "New York - JFK Terminal 4 Concierge", city: "New York", address: "Queens, NY 11430" },
  { id: "manhattan", name: "Manhattan Hudson Yards Lounge", city: "New York", address: "500 W 33rd St, New York, NY" },
  { id: "mia", name: "Miami International VIP Valet", city: "Miami", address: "2100 NW 42nd Ave, Miami, FL" },
  { id: "southbeach", name: "South Beach Ocean Drive Hub", city: "Miami", address: "1100 Ocean Dr, Miami Beach, FL" },
  { id: "dxb", name: "Dubai International Airport Terminal 3", city: "Dubai", address: "Airport Rd, Dubai, UAE" },
  { id: "lhr", name: "London Heathrow VIP Windsor Suite", city: "London", address: "Hounslow TW6 2GW, UK" }
];

// Insurance Protection Tiers
const PROTECTION_PLANS = [
  {
    id: "basic",
    name: "Essential Cover",
    pricePerDay: 0,
    liability: "$3,000 Excess",
    features: ["Third-party liability", "Basic mechanical breakdown support", "Standard roadside recovery"]
  },
  {
    id: "premium",
    name: "Velocity Shield",
    pricePerDay: 45,
    popular: true,
    liability: "$500 Excess",
    features: ["Zero glass & tire excess", "24/7 dedicated dispatch", "Emergency replacement car", "Theft & collision waiver"]
  },
  {
    id: "vip",
    name: "Royal Concierge VIP",
    pricePerDay: 85,
    liability: "$0 Zero Liability",
    features: ["100% Zero excess & zero deposit option", "Private chauffeur backup on call", "Complimentary tank of fuel", "Doorstep pickup & return anywhere"]
  }
];

// Add-ons
const ADDONS = [
  { id: "additional_driver", name: "Additional Certified Driver", price: 25, per: "day", desc: "Allow a secondary qualified driver behind the wheel." },
  { id: "wifi_starlink", name: "Starlink On-board High-Speed Wi-Fi", price: 15, per: "day", desc: "Ultra-fast connection throughout your trip." },
  { id: "child_seat", name: "Recaro Ergonomic Child / Baby Seat", price: 18, per: "day", desc: "Premium ISOFIX high-safety comfort seat." },
  { id: "delivery_valet", name: "White-Glove Hotel Delivery & Collection", price: 95, per: "one-time", desc: "We bring the car directly to your hotel lobby." }
];

// Currency Rates relative to USD
const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, code: "USD" },
  EUR: { symbol: "€", rate: 0.92, code: "EUR" },
  GBP: { symbol: "£", rate: 0.79, code: "GBP" },
  AED: { symbol: "AED ", rate: 3.67, code: "AED" }
};
