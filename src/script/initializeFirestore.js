import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const sampleMenuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300",
    category: "pizza",
    isVegetarian: true,
    createdAt: new Date()
  },
  {
    name: "Cheeseburger",
    description: "Juicy beef patty with cheese, lettuce, and special sauce",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    category: "burger",
    isVegetarian: false,
    createdAt: new Date()
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300",
    category: "salad",
    isVegetarian: true,
    createdAt: new Date()
  },
  {
    name: "Pasta Carbonara",
    description: "Spaghetti with creamy egg sauce and pancetta",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=300",
    category: "pasta",
    isVegetarian: false,
    createdAt: new Date()
  }
];

export const initializeDatabase = async () => {
  try {
    // Check if menu items already exist
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    
    if (querySnapshot.empty) {
      console.log('Initializing database with sample data...');
      
      // Add sample menu items
      for (const item of sampleMenuItems) {
        await addDoc(collection(db, 'menuItems'), item);
      }
      
      console.log('Database initialized successfully!');
    } else {
      console.log('Database already initialized.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};