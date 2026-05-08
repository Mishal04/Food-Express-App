import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================
// MENU ITEMS SERVICE
// ============================================

export const menuService = {
  // Get all menu items from Firestore
  async getAllMenuItems() {
    try {
      console.log("📡 Fetching menu items from Firestore...");
      
      const menuItemsRef = collection(db, 'menuItems');
      const querySnapshot = await getDocs(menuItemsRef);
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ ${items.length} menu items fetched successfully`);
      return items;
      
    } catch (error) {
      console.error("❌ Error fetching menu items:", error);
      
      // Fallback to local data if Firestore fails
      console.log("🔄 Using fallback menu data...");
      return getFallbackMenuItems();
    }
  },
  
  // Get menu items by category
  async getMenuItemsByCategory(category) {
    try {
      const menuItemsRef = collection(db, 'menuItems');
      const q = query(menuItemsRef, where('category', '==', category));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      return [];
    }
  },
  
  // Add new menu item
  async addMenuItem(item) {
    try {
      const docRef = await addDoc(collection(db, 'menuItems'), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("✅ Menu item added with ID:", docRef.id);
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  },
  
  // Update menu item
  async updateMenuItem(id, updates) {
    try {
      const docRef = doc(db, 'menuItems', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log("✅ Menu item updated:", id);
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  },
  
  // Delete menu item
  async deleteMenuItem(id) {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      console.log("✅ Menu item deleted:", id);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }
};

// ============================================
// ORDERS SERVICE
// ============================================

export const orderService = {
  // Create new order
  async createOrder(orderData, userId) {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        userId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("✅ Order created with ID:", orderRef.id);
      return orderRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  
  // Get user orders
  async getUserOrders(userId) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  },

  // Get all orders (for Admin)
  async getAllOrders() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
  }
};

// ============================================
// FALLBACK DATA (if Firestore fails)
// ============================================

const getFallbackMenuItems = () => {
  return [
    {
      id: '1',
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300",
      category: "pizza",
      isVegetarian: true
    },
    {
      id: '2',
      name: "Cheeseburger",
      description: "Juicy beef patty with cheese, lettuce, and special sauce",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
      category: "burger",
      isVegetarian: false
    }
    // Add more fallback items as needed
  ];
};