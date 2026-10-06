const dns = require("dns");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Vehicle = require("./models/Vehicle");

dotenv.config();
dns.setServers(["8.8.8.8"]);

const sampleVehicles = [
  {
    title: "Tata 1613 Truck",
    brand: "Tata",
    model: "1613",
    year: 2023,
    price: 1850000,
    category: "Truck",
    kilometers: 84000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Nashik",
    status: "Available",
    isBestSeller: true,
    description:
      "Reliable heavy-duty Tata 1613 truck for logistics and transport operations. Well maintained and ready for commercial use.",
    images: [{
      url: "https://images.unsplash.com/photo-1605559424843-9e4c1794d1d6?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-1613",
    }],
  },
  {
    title: "Tata 1612 LPT",
    brand: "Tata",
    model: "1612 LPT",
    year: 2022,
    price: 1720000,
    category: "Truck",
    kilometers: 91000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Pune",
    status: "Available",
    isBestSeller: true,
    description:
      "Tata 1612 LPT for medium haul transport. Strong engine, comfortable cabin, and dependable performance for daily business work.",
    images: [{
      url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-1612",
    }],
  },
  {
    title: "Tata 1618 Truck",
    brand: "Tata",
    model: "1618",
    year: 2021,
    price: 1960000,
    category: "Truck",
    kilometers: 103000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Aurangabad",
    status: "Available",
    isBestSeller: true,
    description:
      "High-capacity Tata 1618 truck built for cargo movement with rugged durability and efficient diesel performance.",
    images: [{
      url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-1618",
    }],
  },
  {
    title: "Ashok Leyland 1616",
    brand: "Ashok Leyland",
    model: "1616",
    year: 2020,
    price: 1880000,
    category: "Truck",
    kilometers: 98000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Nagpur",
    status: "Available",
    isBestSeller: false,
    description:
      "Ashok Leyland 1616 is a dependable heavy-goods vehicle with a strong chassis and hassle-free operating efficiency.",
    images: [{
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-ashok-1616",
    }],
  },
  {
    title: "BharatBenz 1617",
    brand: "BharatBenz",
    model: "1617",
    year: 2023,
    price: 2140000,
    category: "Truck",
    kilometers: 62000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Mumbai",
    status: "Available",
    isBestSeller: true,
    description:
      "Premium BharatBenz 1617 truck with excellent power delivery, low maintenance and strong earning potential for logistics businesses.",
    images: [{
      url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-benz-1617",
    }],
  },
  {
    title: "Tata 407",
    brand: "Tata",
    model: "407",
    year: 2019,
    price: 890000,
    category: "Mini Truck",
    kilometers: 112000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Indore",
    status: "Available",
    isBestSeller: false,
    description:
      "Compact and efficient Tata 407 ideal for urban transport, last-mile delivery, and multiple commercial applications.",
    images: [{
      url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-407",
    }],
  },
  {
    title: "Tata Ace Gold",
    brand: "Tata",
    model: "Ace Gold",
    year: 2024,
    price: 650000,
    category: "Mini Truck",
    kilometers: 28000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Jaipur",
    status: "Available",
    isBestSeller: false,
    description:
      "High-efficiency Tata Ace Gold mini truck offering excellent mileage and practical utility for small business operators.",
    images: [{
      url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-ace-gold",
    }],
  },
  {
    title: "Mahindra Bolero Pickup",
    brand: "Mahindra",
    model: "Bolero Pickup",
    year: 2022,
    price: 940000,
    category: "Pickup Truck",
    kilometers: 76000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Bhopal",
    status: "Available",
    isBestSeller: false,
    description:
      "Mahindra Bolero pickup designed for rugged fieldwork, logistics movement, and reliable everyday commercial use.",
    images: [{
      url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-bolero-pickup",
    }],
  },
  {
    title: "Tata Signa 3525",
    brand: "Tata",
    model: "Signa 3525",
    year: 2023,
    price: 3450000,
    category: "Truck",
    kilometers: 52000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Delhi",
    status: "Available",
    isBestSeller: true,
    description:
      "Heavy-duty Tata Signa 3525 with powerful performance and a premium cabin suited for long-haul freight operations.",
    images: [{
      url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-signa-3525",
    }],
  },
  {
    title: "Ashok Leyland 2820",
    brand: "Ashok Leyland",
    model: "2820",
    year: 2021,
    price: 2270000,
    category: "Truck",
    kilometers: 89000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Vadodara",
    status: "Available",
    isBestSeller: false,
    description:
      "Ashok Leyland 2820 is a tough and versatile truck known for dependable performance in heavy commercial usage.",
    images: [{
      url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-ashok-2820",
    }],
  },
  {
    title: "Tata Prima",
    brand: "Tata",
    model: "Prima",
    year: 2022,
    price: 2950000,
    category: "Truck",
    kilometers: 66000,
    fuelType: "Diesel",
    transmission: "Automatic",
    location: "Ahmedabad",
    status: "Available",
    isBestSeller: false,
    description:
      "Tata Prima combines premium comfort, strong engine output and efficiency to support larger transport operations smoothly.",
    images: [{
      url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-prima",
    }],
  },
  {
    title: "BharatBenz 2823",
    brand: "BharatBenz",
    model: "2823",
    year: 2021,
    price: 2460000,
    category: "Truck",
    kilometers: 70000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Surat",
    status: "Available",
    isBestSeller: false,
    description:
      "BharatBenz 2823 is a sturdy logistics truck with a proven powertrain and reliable performance on long routes.",
    images: [{
      url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-benz-2823",
    }],
  },
  {
    title: "Tata Tipper",
    brand: "Tata",
    model: "Tipper",
    year: 2020,
    price: 2380000,
    category: "Tipper",
    kilometers: 121000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Raipur",
    status: "Available",
    isBestSeller: false,
    description:
      "Tata tipper built for mining and material transport with a rugged body, strong lifting capability and reliable maintenance record.",
    images: [{
      url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-tipper",
    }],
  },
  {
    title: "Ashok Leyland Tipper",
    brand: "Ashok Leyland",
    model: "Tipper",
    year: 2021,
    price: 2490000,
    category: "Tipper",
    kilometers: 108000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Kolhapur",
    status: "Available",
    isBestSeller: false,
    description:
      "Ashok Leyland tipper suited for earth-moving and quarry work with dependable payload capacity and durable build.",
    images: [{
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-ashok-tipper",
    }],
  },
  {
    title: "Tata Transit Mixer",
    brand: "Tata",
    model: "Transit Mixer",
    year: 2022,
    price: 3860000,
    category: "Transit Mixer",
    kilometers: 47000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Hyderabad",
    status: "Available",
    isBestSeller: true,
    description:
      "Efficient Tata transit mixer built for concrete delivery with smooth operation, strong mixing performance and dependable uptime.",
    images: [{
      url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-transit-mixer",
    }],
  },
  {
    title: "Tata 407 HD",
    brand: "Tata",
    model: "407 HD",
    year: 2018,
    price: 820000,
    category: "Mini Truck",
    kilometers: 130000,
    fuelType: "Diesel",
    transmission: "Manual",
    location: "Gwalior",
    status: "Reserved",
    isBestSeller: false,
    description:
      "Highly useful Tata 407 HD commercial vehicle with a trusted engine and strong utility for fleet operations.",
    images: [{
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed-tata-407-hd",
    }],
  },
];

const seedVehicles = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required. Set it in your environment before running this script.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const count = await Vehicle.countDocuments();
  if (count > 0) {
    console.log(`Vehicles already exist in MongoDB (${count}). Seed skipped.`);
    await mongoose.disconnect();
    return;
  }

  await Vehicle.insertMany(sampleVehicles);
  console.log(`Seeded ${sampleVehicles.length} vehicles successfully.`);
  await mongoose.disconnect();
};

seedVehicles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Vehicle seed failed:", error.message);
    process.exit(1);
  });
