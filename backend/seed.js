// ==========================================
// Seed script for MS Footwear
// Run with: npm run seed
//
// Creates:
//  - 5 sample Peshawari Chappal products (with placeholder image URLs)
//  - ONE admin account, using ADMIN_EMAIL / ADMIN_PASSWORD from .env
//
// IMPORTANT: Replace the placeholder image URLs below with real
// ImageKit URLs once you upload real product photos through the
// admin dashboard, or re-run a modified version of this script.
// ==========================================

import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Admin from "./models/Admin.js";

dotenv.config();

// Clearly-labeled placeholder images. Swap these for real ImageKit URLs later.
const placeholderImage = (seed) => ({
  url: `https://ik.imagekit.io/demo/placeholder-peshawari-chappal-${seed}.jpg`,
  fileId: null,
});

const products = [
  {
    name: "Classic Brown Peshawari Chappal",
    description:
      "Handcrafted classic brown Peshawari Chappal made from genuine leather. A timeless traditional design offering all-day comfort with a durable sole, perfect for everyday wear.",
    price: 2500,
    originalPrice: null,
    category: "Classic",
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 25,
    featured: true,
    images: [placeholderImage("brown-1"), placeholderImage("brown-2")],
  },
  {
    name: "Premium Black Peshawari Chappal",
    description:
      "Premium black Peshawari Chappal crafted with fine leather and reinforced stitching. A sleek, versatile pair that pairs traditional craftsmanship with a modern, refined finish.",
    price: 3000,
    originalPrice: 3400,
    category: "Premium",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    stock: 20,
    featured: true,
    images: [placeholderImage("black-1"), placeholderImage("black-2")],
  },
  {
    name: "Traditional Tan Peshawari Chappal",
    description:
      "Traditional tan Peshawari Chappal, handmade by skilled artisans using time-honored techniques. Lightweight, breathable, and built to age beautifully with wear.",
    price: 2800,
    originalPrice: null,
    category: "Classic",
    sizes: [40, 41, 42, 43, 44],
    stock: 18,
    featured: false,
    images: [placeholderImage("tan-1"), placeholderImage("tan-2")],
  },
  {
    name: "Leather Classic Peshawari Chappal",
    description:
      "A true classic, this leather Peshawari Chappal features a hand-stitched upper and a sturdy traditional sole, designed for lasting comfort and authentic style.",
    price: 3200,
    originalPrice: 3600,
    category: "Classic",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    stock: 15,
    featured: false,
    images: [placeholderImage("leather-classic-1"), placeholderImage("leather-classic-2")],
  },
  {
    name: "Premium Handmade Peshawari Chappal",
    description:
      "Our finest offering: a fully handmade Peshawari Chappal using premium leather and traditional Peshawari craftsmanship, finished for a luxurious look and superior durability.",
    price: 3500,
    originalPrice: 4000,
    category: "Handmade",
    sizes: [40, 41, 42, 43, 44],
    stock: 12,
    featured: true,
    images: [placeholderImage("handmade-1"), placeholderImage("handmade-2")],
  },
];

const seedProducts = async () => {
  await Product.deleteMany();

  const withSlugs = products.map((p) => ({
    ...p,
    slug: slugify(p.name, { lower: true, strict: true }),
  }));

  await Product.insertMany(withSlugs);
  console.log(`Seeded ${withSlugs.length} products.`);
};

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "MS Footwear Admin";

  if (!email || !password) {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin creation. Set them and re-run `npm run seed`."
    );
    return;
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin account already exists for ${email}. Skipping creation.`);
    return;
  }

  // Enforce single-admin rule
  const anyAdmin = await Admin.findOne();
  if (anyAdmin) {
    console.log("An admin account already exists in the database. Only one admin is allowed. Skipping.");
    return;
  }

  await Admin.create({ name, email: email.toLowerCase(), password });
  console.log(`Admin account created for ${email}. (Password was securely hashed.)`);
};

const run = async () => {
  try {
    await connectDB();
    await seedProducts();
    await seedAdmin();
    console.log("Seeding complete.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
