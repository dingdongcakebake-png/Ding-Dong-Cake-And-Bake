import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Chocolate Truffle Cake',
    description: 'Rich and decadent chocolate cake layered with truffle cream',
    price: 450,
    category: 'cakes',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 10,
  },
  {
    name: 'Vanilla Sponge Cake',
    description: 'Light and fluffy vanilla sponge cake with buttercream frosting',
    price: 350,
    category: 'cakes',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 15,
  },
  {
    name: 'Red Velvet Cake',
    description: 'Classic red velvet cake with cream cheese frosting',
    price: 500,
    category: 'cakes',
    image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 8,
  },
  {
    name: 'Chocolate Croissant',
    description: 'Flaky pastry filled with rich chocolate',
    price: 80,
    category: 'pastries',
    image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 25,
  },
  {
    name: 'Blueberry Muffin',
    description: 'Freshly baked muffin loaded with juicy blueberries',
    price: 65,
    category: 'pastries',
    image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 30,
  },
  {
    name: 'Chocolate Chip Cookies',
    description: 'Crispy cookies loaded with chocolate chips',
    price: 120,
    category: 'cookies',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 40,
  },
  {
    name: 'Oatmeal Raisin Cookies',
    description: 'Healthy oatmeal cookies with sweet raisins',
    price: 100,
    category: 'cookies',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 35,
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Fresh baked whole wheat bread loaf',
    price: 45,
    category: 'breads',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 20,
  },
  {
    name: 'Garlic Bread',
    description: 'Crispy bread with garlic butter and herbs',
    price: 85,
    category: 'breads',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 15,
  },
  {
    name: 'Tiramisu Cup',
    description: 'Classic Italian dessert in individual serving',
    price: 150,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/1120575/pexels-photo-1120575.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 12,
  },
  {
    name: 'Strawberry Cheesecake',
    description: 'Creamy cheesecake topped with fresh strawberries',
    price: 180,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/1120575/pexels-photo-1120575.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 10,
  },
  {
    name: 'Black Forest Cake',
    description: 'Traditional black forest cake with cherries and cream',
    price: 520,
    category: 'cakes',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 6,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();