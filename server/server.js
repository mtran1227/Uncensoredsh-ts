const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ===== CHECK ENV =====
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI missing in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET missing in .env");
  process.exit(1);
}

console.log("📡 Connecting to MongoDB:", process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Bathroom = require('./models/Bathroom');
const Rating = require('./models/Rating');
const app = express();

// Function to seed bathrooms
async function seedBathrooms() {
  try {
    const bathroomCount = await Bathroom.countDocuments();
    if (bathroomCount > 0) {
      console.log("📊 Bathrooms already exist, skipping seed");
      return;
    }

    console.log("🌱 Seeding bathrooms...");
    const bathrooms = [
      { name: "Bobst Library 4th Floor", location: "70 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997199, 40.729453], address: "70 Washington Square S" }, averageRating: 3.5, images: [{ url: "/bathroomphotos/bobst4th.png" }] },
      { name: "Kimmel Center 2nd Floor", location: "60 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997440, 40.729168], address: "60 Washington Square S" }, averageRating: 4.0, images: [{ url: "/bathroomphotos/kimmel2nd.png" }] },
      { name: "Palladium 2nd Floor", location: "140 E 14th St", geoLocation: { type: "Point", coordinates: [-73.987628, 40.732810], address: "140 E 14th St" }, averageRating: 4.2, images: [{ url: "/bathroomphotos/palladium2nd.png" }] },
      { name: "2 MetroTech 8th Floor", location: "2 MetroTech Center", geoLocation: { type: "Point", coordinates: [-73.985839, 40.693382], address: "2 MetroTech Center" }, averageRating: 4.9, images: [{ url: "/bathroomphotos/2metrotech8thfloor.png" }] },
      { name: "Silver Center 6th Floor", location: "100 Washington Square E", geoLocation: { type: "Point", coordinates: [-73.995680, 40.729574], address: "100 Washington Square E" }, averageRating: 3.8, images: [{ url: "/bathroomphotos/silvercenter.png" }] },
      { name: "Bobst Library LL1", location: "70 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997199, 40.729453], address: "70 Washington Square S" }, averageRating: 3.6, images: [{ url: "/bathroomphotos/bobstll1.png" }] },
      { name: "Bobst Library 2nd Floor", location: "70 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997199, 40.729453], address: "70 Washington Square S" }, averageRating: 3.7, images: [{ url: "/bathroomphotos/bobst2nd.png" }] },
      { name: "Bobst Library 5th Floor", location: "70 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997199, 40.729453], address: "70 Washington Square S" }, averageRating: 3.9, images: [{ url: "/bathroomphotos/bobst5th.png" }] },
      { name: "Bobst Library 7th Floor", location: "70 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997199, 40.729453], address: "70 Washington Square S" }, averageRating: 4.1, images: [{ url: "/bathroomphotos/bobst7th.png" }] },
      { name: "Kimmel Center 8th Floor", location: "60 Washington Square S", geoLocation: { type: "Point", coordinates: [-73.997440, 40.729168], address: "60 Washington Square S" }, averageRating: 4.3, images: [{ url: "/bathroomphotos/kimmel8th.png" }] },
      { name: "Stern 4th Floor", location: "44 W 4th St", geoLocation: { type: "Point", coordinates: [-73.999222, 40.730341], address: "44 W 4th St" }, averageRating: 3.8, images: [{ url: "/bathroomphotos/stern4th.png" }] },
      { name: "StudentLink Center", location: "383 Lafayette St", geoLocation: { type: "Point", coordinates: [-73.992390, 40.729150], address: "383 Lafayette St" }, averageRating: 3.7, images: [{ url: "/bathroomphotos/studentlink.png" }] },
      { name: "Kimmel Center for University Life", location: "60 Washington Sq S", geoLocation: { type: "Point", coordinates: [-73.997440, 40.729168], address: "60 Washington Sq S" }, averageRating: 4.0 },
      { name: "Silver Center", location: "100 Washington Square E", geoLocation: { type: "Point", coordinates: [-73.995680, 40.729574], address: "100 Washington Square E" }, averageRating: 4.1 },
      { name: "Bobst Library", location: "70 Washington Sq S", geoLocation: { type: "Point", coordinates: [-73.997199, 40.729453], address: "70 Washington Sq S" }, averageRating: 3.5 },
      { name: "Warren Weaver Hall (Courant Institute)", location: "251 Mercer St", geoLocation: { type: "Point", coordinates: [-73.996960, 40.729820], address: "251 Mercer St" }, averageRating: 3.9 },
      { name: "Brown Building", location: "29 Washington Pl", geoLocation: { type: "Point", coordinates: [-73.995210, 40.729316], address: "29 Washington Pl" }, averageRating: 3.8 },
      { name: "GCASL", location: "238 Thompson St", geoLocation: { type: "Point", coordinates: [-73.998170, 40.729030], address: "238 Thompson St" }, averageRating: 3.7 },
      { name: "King Juan Carlos I Center", location: "53 Washington Sq S", geoLocation: { type: "Point", coordinates: [-73.997010, 40.729100], address: "53 Washington Sq S" }, averageRating: 3.6 },
      { name: "Steinhardt Education Building", location: "35 W 4th St", geoLocation: { type: "Point", coordinates: [-73.999249, 40.729511], address: "35 W 4th St" }, averageRating: 3.6 },
      { name: "Steinhardt Pless Hall", location: "82 Washington Square E", geoLocation: { type: "Point", coordinates: [-73.994763, 40.730195], address: "82 Washington Square E" }, averageRating: 3.7 },
      { name: "Vanderbilt Hall (NYU Law)", location: "40 Washington Sq S", geoLocation: { type: "Point", coordinates: [-73.996376, 40.729239], address: "40 Washington Sq S" }, averageRating: 3.8 },
      { name: "Furman Hall (NYU Law)", location: "245 Sullivan St", geoLocation: { type: "Point", coordinates: [-73.997735, 40.728615], address: "245 Sullivan St" }, averageRating: 3.8 },
      { name: "D'Agostino Hall (NYU Law)", location: "110 W 3rd St", geoLocation: { type: "Point", coordinates: [-73.999454, 40.729934], address: "110 W 3rd St" }, averageRating: 3.9 },
      { name: "SPS Building", location: "7 E 12th St", geoLocation: { type: "Point", coordinates: [-73.992706, 40.735028], address: "7 E 12th St" }, averageRating: 3.7 },
      { name: "Gallatin School", location: "1 Washington Pl", geoLocation: { type: "Point", coordinates: [-73.993900, 40.729430], address: "1 Washington Pl" }, averageRating: 3.6 },
      { name: "Tisch School of the Arts", location: "721 Broadway", geoLocation: { type: "Point", coordinates: [-73.992160, 40.729497], address: "721 Broadway" }, averageRating: 4.0 },
      { name: "Tisch Building (Theatre)", location: "111 2nd Ave", geoLocation: { type: "Point", coordinates: [-73.989524, 40.727917], address: "111 2nd Ave" }, averageRating: 3.8 },
      { name: "Tisch Dance Annex", location: "111 2nd Ave Annex", geoLocation: { type: "Point", coordinates: [-73.989550, 40.727900], address: "111 2nd Ave Annex" }, averageRating: 3.8 },
      { name: "Architecture & Urban Design", location: "370 Jay St, Brooklyn", geoLocation: { type: "Point", coordinates: [-73.987071, 40.692514], address: "370 Jay St" }, averageRating: 3.9 },
      { name: "Stern School of Business – KMC", location: "44 W 4th St", geoLocation: { type: "Point", coordinates: [-73.999222, 40.730341], address: "44 W 4th St" }, averageRating: 3.7 },
      { name: "Stern Tisch Hall", location: "40 W 4th St", geoLocation: { type: "Point", coordinates: [-73.998983, 40.729960], address: "40 W 4th St" }, averageRating: 3.6 },
      { name: "Palladium Athletic Facility", location: "140 E 14th St", geoLocation: { type: "Point", coordinates: [-73.987628, 40.732810], address: "140 E 14th St" }, averageRating: 4.2 },
      { name: "404 Fitness", location: "404 Lafayette St", geoLocation: { type: "Point", coordinates: [-73.992290, 40.729690], address: "404 Lafayette St" }, averageRating: 3.9 },
      { name: "NYU Bookstore", location: "726 Broadway", geoLocation: { type: "Point", coordinates: [-73.992820, 40.729800], address: "726 Broadway" }, averageRating: 3.6 },
      { name: "Academic Resource Center (ARC)", location: "18 Washington Pl", geoLocation: { type: "Point", coordinates: [-73.995271, 40.729917], address: "18 Washington Pl" }, averageRating: 3.7 },
      { name: "Founders Hall", location: "120 E 12th St", geoLocation: { type: "Point", coordinates: [-73.987471, 40.731593], address: "120 E 12th St" }, averageRating: 3.6 },
      { name: "Palladium Hall", location: "140 E 14th St", geoLocation: { type: "Point", coordinates: [-73.987628, 40.732810], address: "140 E 14th St" }, averageRating: 4.1 },
      { name: "Brittany Hall", location: "55 E 10th St", geoLocation: { type: "Point", coordinates: [-73.993310, 40.732088], address: "55 E 10th St" }, averageRating: 3.5 },
      { name: "Goddard Hall", location: "79 Washington Sq E", geoLocation: { type: "Point", coordinates: [-73.995123, 40.730387], address: "79 Washington Sq E" }, averageRating: 3.6 },
      { name: "Lipton Hall", location: "33 Washington Sq W", geoLocation: { type: "Point", coordinates: [-73.999632, 40.730867], address: "33 Washington Sq W" }, averageRating: 3.5 },
      { name: "Third North", location: "75 3rd Ave", geoLocation: { type: "Point", coordinates: [-73.987251, 40.731633], address: "75 3rd Ave" }, averageRating: 3.6 },
      { name: "University Hall", location: "110 E 14th St", geoLocation: { type: "Point", coordinates: [-73.986547, 40.732654], address: "110 E 14th St" }, averageRating: 3.5 },
      { name: "Carlyle Court", location: "25 Union Square W", geoLocation: { type: "Point", coordinates: [-73.992791, 40.736054], address: "25 Union Square W" }, averageRating: 3.7 },
      { name: "Greenwich Hall", location: "536 LaGuardia Pl", geoLocation: { type: "Point", coordinates: [-73.998123, 40.729028], address: "536 LaGuardia Pl" }, averageRating: 3.8 },
      { name: "Rubin Hall", location: "35 Fifth Ave", geoLocation: { type: "Point", coordinates: [-73.993592, 40.734040], address: "35 Fifth Ave" }, averageRating: 3.6 },
      { name: "Weinstein Hall", location: "5 University Pl", geoLocation: { type: "Point", coordinates: [-73.997980, 40.731030], address: "5 University Pl" }, averageRating: 3.7 },
      { name: "Clark Street Residence", location: "55 Clark St, Brooklyn, NY", geoLocation: { type: "Point", coordinates: [-73.992720, 40.697418], address: "55 Clark St, Brooklyn, NY" }, averageRating: 3.5 },
      { name: "Jacobs Academic Building (2 MetroTech)", location: "2 MetroTech Center, Brooklyn, NY 11201", geoLocation: { type: "Point", coordinates: [-73.985839, 40.693382], address: "2 MetroTech Center" }, averageRating: 3.9 },
      { name: "Rogers Hall (6 MetroTech)", location: "6 MetroTech Center, Brooklyn, NY 11201", geoLocation: { type: "Point", coordinates: [-73.986514, 40.694453], address: "6 MetroTech Center" }, averageRating: 3.8 },
      { name: "370 Jay Street", location: "370 Jay St, Brooklyn, NY 11201", geoLocation: { type: "Point", coordinates: [-73.987071, 40.692514], address: "370 Jay St" }, averageRating: 4.0 },
      { name: "5 MetroTech Center", location: "5 MetroTech Center, Brooklyn NY 11201", geoLocation: { type: "Point", coordinates: [-73.985900, 40.693700], address: "5 MetroTech Center" }, averageRating: 3.7 },
      { name: "NYU MakerSpace", location: "6 MetroTech Center, Brooklyn NY 11201", geoLocation: { type: "Point", coordinates: [-73.986514, 40.694453], address: "6 MetroTech Center" }, averageRating: 4.1 },
      { name: "Bern Dibner Library", location: "5 MetroTech Center, Brooklyn NY 11201", geoLocation: { type: "Point", coordinates: [-73.986130, 40.693840], address: "5 MetroTech Center" }, averageRating: 3.8 },
      { name: "Urban Future Lab", location: "15 MetroTech Center, Brooklyn NY", geoLocation: { type: "Point", coordinates: [-73.985200, 40.693240], address: "15 MetroTech Center" }, averageRating: 3.9 },
      { name: "Othmer Residence Hall", location: "101 Johnson St, Brooklyn NY 11201", geoLocation: { type: "Point", coordinates: [-73.985060, 40.694820], address: "101 Johnson St" }, averageRating: 3.6 },
      { name: "Hassenfeld Children's Hospital", location: "160 E 34th St", geoLocation: { type: "Point", coordinates: [-73.976359, 40.744388], address: "160 E 34th St" }, averageRating: 4.0 },
      { name: "Harkness Pavilion", location: "105 E 17th St", geoLocation: { type: "Point", coordinates: [-73.986058, 40.735669], address: "105 E 17th St" }, averageRating: 3.7 },
      { name: "Perelman Center", location: "570 1st Ave", geoLocation: { type: "Point", coordinates: [-73.973204, 40.740258], address: "570 1st Ave" }, averageRating: 3.8 },
      { name: "Skirball Institute", location: "540 1st Ave", geoLocation: { type: "Point", coordinates: [-73.974606, 40.740032], address: "540 1st Ave" }, averageRating: 3.8 },
      { name: "Smilow Research Center", location: "522 1st Ave", geoLocation: { type: "Point", coordinates: [-73.974064, 40.739651], address: "522 1st Ave" }, averageRating: 3.9 },
      { name: "Tisch Hospital", location: "550 1st Ave", geoLocation: { type: "Point", coordinates: [-73.974865, 40.739896], address: "550 1st Ave" }, averageRating: 3.8 },
      { name: "Kimmel Pavilion", location: "30th St & 1st Ave", geoLocation: { type: "Point", coordinates: [-73.974000, 40.741850], address: "30th St & 1st Ave" }, averageRating: 3.7 },
      { name: "Ambulatory Care Center (ACC)", location: "240 E 38th St", geoLocation: { type: "Point", coordinates: [-73.973304, 40.747208], address: "240 E 38th St" }, averageRating: 3.7 },
    ];

    let created = 0;
    for (const bathroomData of bathrooms) {
      try {
        const existing = await Bathroom.findOne({ name: bathroomData.name });
        if (!existing) {
          const bathroom = new Bathroom(bathroomData);
          await bathroom.save();
          console.log(`✅ Created bathroom: ${bathroomData.name}`);
          created++;
        }
      } catch (err) {
        console.log(`⚠️  Error creating ${bathroomData.name}:`, err.message);
      }
    }
    console.log(`✅ Bathrooms seeding complete: ${created} created`);
  } catch (err) {
    console.error("❌ Error seeding bathrooms:", err);
  }
}

// Function to seed reviews for bathrooms
async function seedReviews() {
  try {
    console.log("🌱 Seeding reviews for all bathrooms...");
    
    // Get all bathrooms and users
    const bathrooms = await Bathroom.find();
    const users = await User.find();
    
    if (bathrooms.length === 0 || users.length === 0) {
      console.log("⚠️  No bathrooms or users found, skipping review seed");
      return;
    }

    // Sample review comments - diverse and realistic for demo
    const reviewComments = [
      "i met god here.",
      "so sh*ttable!",
      "Toilet paper so soft I took some home.",
      "No lock. No soap. No dignity.",
      "vibe immaculate.",
      "Best bathroom on campus, hands down.",
      "Clean and spacious, perfect for a quick break.",
      "The stalls are huge, very private.",
      "Smells fresh, well maintained.",
      "Great location, always available.",
      "Could use better ventilation.",
      "Love the automatic sinks!",
      "TP quality is top tier.",
      "Peaceful and quiet.",
      "Worth the walk.",
      "My go-to spot.",
      "Hidden gem.",
      "10/10 would recommend.",
      "Better than my apartment bathroom.",
      "The lighting is perfect for selfies.",
      "Cold and sterile.",
      "old and musty",
      "super nice",
      "Actually decent for once.",
      "Found my new favorite spot.",
      "Way better than expected.",
      "Pretty standard but gets the job done.",
      "The mirrors are huge, great for outfit checks.",
      "Always clean when I visit.",
      "Wish there were more stalls.",
      "Perfect for a quick emergency.",
      "The hand dryers actually work!",
      "Nice and quiet, good for studying breaks.",
      "Could be cleaner but it's okay.",
      "Love the privacy here.",
      "The soap smells amazing.",
      "Best kept secret on campus.",
      "Always empty when I need it.",
      "The stalls have actual locks that work!",
      "Great for avoiding crowds.",
      "The floor is always wet but otherwise fine.",
      "Found a charging port in here once!",
      "The paper towels are always stocked.",
      "Nice view from the window.",
      "The temperature is always perfect.",
    ];

    const usernames = [
      "deanofdump", "flushmaster5000", "stallscout", "toilettaster", 
      "turdtech", "bathboss", "stallveteran", "papertrail", 
      "tilewalker", "porcelainpro", "seatguru", "soapninja",
      "flushfanatic", "tapmaster", "wipewizard", "bathroomhunter",
      "stallseeker", "restroomrater", "lavatorylover", "johnnyjohn",
      "maish*tsnyc", "stern_stinker", "ghostofstall7", "bobstbathroomrat",
      "twoplytuesday", "toiletpaperking", "stallmaster", "bathroomboss"
    ];

    let created = 0;
    let skipped = 0;
    
    // Create 4-7 reviews per bathroom for a more finished look
    for (const bathroom of bathrooms) {
      // Check how many reviews this bathroom already has
      const existingReviewCount = await Rating.countDocuments({ bathroomId: bathroom._id });
      const targetReviewCount = Math.floor(Math.random() * 4) + 4; // 4-7 reviews
      const reviewsNeeded = Math.max(0, targetReviewCount - existingReviewCount);
      
      if (reviewsNeeded === 0) {
        skipped++;
        continue;
      }
      
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
      let addedForThisBathroom = 0;
      
      for (let i = 0; i < shuffledUsers.length && addedForThisBathroom < reviewsNeeded; i++) {
        const user = shuffledUsers[i];
        const overallRating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        const username = usernames[Math.floor(Math.random() * usernames.length)] || user.username;
        
        try {
          // Check if review already exists
          const existing = await Rating.findOne({ 
            bathroomId: bathroom._id, 
            userEmail: user.email 
          });
          
          if (!existing) {
            const rating = new Rating({
              bathroomId: bathroom._id,
              userId: user._id,
              userEmail: user.email,
              userName: username,
              ratings: {
                overall: overallRating,
                cleanliness: Math.max(1, Math.min(5, overallRating + Math.floor(Math.random() * 3) - 1)), // ±1 variation, clamped
                privacy: Math.max(1, Math.min(5, overallRating + Math.floor(Math.random() * 3) - 1)),
                smell: Math.max(1, Math.min(5, overallRating + Math.floor(Math.random() * 3) - 1)),
              },
              comment: comment,
            });
            
            await rating.save();
            created++;
            addedForThisBathroom++;
          }
        } catch (err) {
          console.log(`⚠️  Error creating review for ${bathroom.name}:`, err.message);
        }
      }
    }
    
    // Update bathroom average ratings
    for (const bathroom of bathrooms) {
      const ratings = await Rating.find({ bathroomId: bathroom._id });
      if (ratings.length > 0) {
        const avg = ratings.reduce((sum, r) => sum + r.ratings.overall, 0) / ratings.length;
        await Bathroom.findByIdAndUpdate(bathroom._id, { averageRating: avg });
      }
    }
    
    console.log(`✅ Reviews seeding complete: ${created} created, ${skipped} bathrooms already had enough reviews`);
  } catch (err) {
    console.error("❌ Error seeding reviews:", err);
  }
}

// Function to seed test users
async function seedTestUsers() {
  try {
    console.log("🌱 Checking and seeding test users...");
    const testUsers = [
      { username: "deanofdump", email: "dean@example.com", password: "password123" },
      { username: "flushmaster5000", email: "flush@example.com", password: "password123" },
      { username: "stallscout", email: "stall@example.com", password: "password123" },
      { username: "toilettaster", email: "toilet@example.com", password: "password123" },
      { username: "turdtech", email: "turd@example.com", password: "password123" },
      { username: "bathboss", email: "bath@example.com", password: "password123" },
      { username: "stallveteran", email: "veteran@example.com", password: "password123" },
      { username: "papertrail", email: "paper@example.com", password: "password123" },
      { username: "tilewalker", email: "tile@example.com", password: "password123" },
      { username: "porcelainpro", email: "porcelain@example.com", password: "password123" },
      { username: "seatguru", email: "seat@example.com", password: "password123" },
      { username: "soapninja", email: "soap@example.com", password: "password123" },
      { username: "flushfanatic", email: "fanatic@example.com", password: "password123" },
      { username: "tapmaster", email: "tap@example.com", password: "password123" },
      { username: "wipewizard", email: "wipe@example.com", password: "password123" },
      { username: "bathroomhunter", email: "hunter@example.com", password: "password123" },
      { username: "stallseeker", email: "seeker@example.com", password: "password123" },
      { username: "restroomrater", email: "rater@example.com", password: "password123" },
      { username: "lavatorylover", email: "lover@example.com", password: "password123" },
      { username: "johnnyjohn", email: "johnny@example.com", password: "password123" },
      { username: "pottypatrol", email: "patrol@example.com", password: "password123" },
      { username: "wcwarrior", email: "warrior@example.com", password: "password123" },
      { username: "bathroombuddy", email: "buddy@example.com", password: "password123" },
      { username: "stallstar", email: "star@example.com", password: "password123" },
      { username: "toilettrekker", email: "trekker@example.com", password: "password123" },
      { username: "restroomreviewer", email: "reviewer@example.com", password: "password123" },
      { username: "bathroombeast", email: "beast@example.com", password: "password123" },
      { username: "stallsurfer", email: "surfer@example.com", password: "password123" },
      { username: "toilettourist", email: "tourist@example.com", password: "password123" },
      { username: "bathroombandit", email: "bandit@example.com", password: "password123" },
    ];

    let created = 0;
    let skipped = 0;

    for (const userData of testUsers) {
      try {
        const existing = await User.findOne({ 
          $or: [{ email: userData.email }, { username: userData.username }] 
        });
        
        if (!existing) {
          const user = new User(userData);
          await user.save();
          console.log(`✅ Created user: ${userData.username}`);
          created++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.log(`⚠️  Error creating ${userData.username}:`, err.message);
      }
    }
    console.log(`✅ Test users seeding complete: ${created} created, ${skipped} already existed`);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  }
}

// ===== MIDDLEWARE =====
// Allow both the default CRA port and the current dev port (3002) to reach the API
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// Set up routes before connection (so server can start even if DB fails)
const bathroomRoutes = require('./routes/bathrooms');
const ratingRoutes = require('./routes/rating');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/user");

app.use('/api/bathrooms', bathroomRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);

// ===== CONNECT TO MONGO WITH FULL SETTINGS =====
mongoose.set('bufferCommands', false); // Disable buffering
mongoose.set('strictQuery', false);

// Function to attempt MongoDB connection
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 30000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
    });
    
    console.log("✅ MongoDB connected successfully");
    
    // Wait a bit to ensure connection is fully ready
    setTimeout(() => {
      console.log("✅ MongoDB connection fully established");
      
      // ===== AUTO-SEED TEST USERS (if none exist) =====
      seedTestUsers().catch(err => console.error("Error seeding users:", err));
      
      // ===== AUTO-SEED BATHROOMS (if none exist) =====
      seedBathrooms().catch(err => console.error("Error seeding bathrooms:", err));
      
      // ===== AUTO-SEED REVIEWS (after users and bathrooms are seeded) =====
      setTimeout(() => {
        seedReviews().catch(err => console.error("Error seeding reviews:", err));
      }, 4000); // Wait 4 seconds for users and bathrooms to be seeded
    }, 2000);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    if (err.code === 'ECONNREFUSED' || err.message.includes('querySrv')) {
      console.error("\n💡 DNS/Network Issue Detected:");
      console.error("   This is a network connectivity problem, not a code error.");
      console.error("   The server is running, but cannot reach MongoDB Atlas.");
      console.error("\n💡 Troubleshooting tips:");
      console.error("   1. Check your internet connection");
      console.error("   2. Verify MongoDB Atlas cluster is running (not paused)");
      console.error("   3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)");
      console.error("   4. Verify MONGODB_URI in .env file is correct");
      console.error("   5. Try using direct connection string instead of SRV if DNS issues persist");
      console.error("   6. Check firewall/VPN settings that might block DNS queries");
    }
    console.error("\n⚠️  Server will continue without database connection...");
    console.error("   API endpoints will return errors until MongoDB connects.");
  }
}

// Attempt connection
connectToMongoDB();

// ===== START SERVER (even if DB connection fails) =====
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at: http://localhost:${PORT}`);
  console.log("⚠️  Note: Some features may not work without database connection");
});