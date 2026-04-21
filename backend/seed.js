import bcrypt from 'bcryptjs';
import Listing from './models/listingModel.js';
import User from './models/userModel.js';

const DEMO_SELLER = {
  name: 'Demo Seller',
  email: 'demo@carmarketplace.com',
  password: 'demo1234',
  authProvider: 'local',
};

const DEMO_LISTINGS = [
  {
    title: '2022 Toyota Camry – Clean & Reliable',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 24500,
    mileage: 28000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Mogadishu',
    description:
      'Well-maintained 2022 Toyota Camry with full service history. One careful owner. Excellent fuel economy and comfortable ride. Perfect for daily commuting in city or highway. No accidents, no paint work.',
    images: [],
    status: 'active',
  },
  {
    title: '2020 Honda Civic – Sporty & Efficient',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 18900,
    mileage: 45000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Hargeisa',
    description:
      'Sporty 2020 Honda Civic in excellent condition. Recently serviced with new tires. Great fuel economy for both city and highway driving. No accidents, clean title.',
    images: [],
    status: 'active',
  },
  {
    title: '2021 Toyota RAV4 – Spacious Family SUV',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    price: 32000,
    mileage: 31000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Bosaso',
    description:
      'Spacious 2021 Toyota RAV4 perfect for families. All-wheel drive capability, panoramic sunroof, and advanced safety features. Very well maintained with all service records available.',
    images: [],
    status: 'active',
  },
  {
    title: '2019 Nissan Altima – Excellent Value',
    make: 'Nissan',
    model: 'Altima',
    year: 2019,
    price: 16500,
    mileage: 62000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Kismayo',
    description:
      'Solid 2019 Nissan Altima offering great value for money. Spacious interior, reliable engine, and a smooth comfortable ride. Well-maintained with regular oil changes on schedule.',
    images: [],
    status: 'active',
  },
  {
    title: '2023 Hyundai Tucson – Modern & Loaded',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2023,
    price: 28000,
    mileage: 12000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Mogadishu',
    description:
      'Nearly new 2023 Hyundai Tucson loaded with features. Touchscreen infotainment, heated seats, blind spot monitoring, lane keep assist, and more. One of the best buys in its class.',
    images: [],
    status: 'active',
  },
  {
    title: '2018 Toyota Land Cruiser V8 – Desert Ready',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2018,
    price: 55000,
    mileage: 89000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Mogadishu',
    description:
      'Powerful 2018 Toyota Land Cruiser V8 diesel. Perfect for any terrain. Fully equipped with leather seats, navigation, rear camera, and premium audio. Meticulously maintained throughout its life.',
    images: [],
    status: 'active',
  },
];

async function seedDatabase() {
  try {
    const listingCount = await Listing.countDocuments();

    if (listingCount > 0) {
      console.log(`Seed skipped — database already has ${listingCount} listings.`);
      return;
    }

    console.log('Seeding demo listings...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_SELLER.password, salt);

    let seller = await User.findOne({ email: DEMO_SELLER.email });

    if (!seller) {
      seller = await User.create({ ...DEMO_SELLER, password: hashedPassword });
      console.log(`Demo seller created: ${seller.email}`);
    }

    const listingsWithOwner = DEMO_LISTINGS.map((listing) => ({
      ...listing,
      owner: seller._id,
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log(`${DEMO_LISTINGS.length} demo listings seeded successfully.`);
  } catch (error) {
    console.error('Seed error:', error.message);
  }
}

export default seedDatabase;
