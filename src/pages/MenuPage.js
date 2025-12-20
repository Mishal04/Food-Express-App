import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import MenuItem from '../components/Menu/MenuItem';

// COMPLETE MENU ITEMS - 20 Delicious Food Items
const sampleMenuItems = [
  // 🍕 PIZZAS
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with fresh tomato sauce, mozzarella, and basil leaves",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "pizza",
    isVegetarian: true,
    popular: true
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni with extra cheese on thin crust",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "pizza",
    isVegetarian: false,
    popular: true
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken with BBQ sauce, onions, and cilantro",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1593246049226-ded77bf90326?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "pizza",
    isVegetarian: false
  },
  
  // 🍔 BURGERS
  {
    id: 4,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "burger",
    isVegetarian: false,
    popular: true
  },
  {
    id: 5,
    name: "Veggie Burger",
    description: "Plant-based patty with avocado, lettuce, and vegan mayo",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "burger",
    isVegetarian: true
  },
  {
    id: 6,
    name: "Double Bacon Burger",
    description: "Double beef patty with crispy bacon and cheddar cheese",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433w?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "burger",
    isVegetarian: false
  },
  
  // 🥗 SALADS
  {
    id: 7,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "salad",
    isVegetarian: true
  },
  {
    id: 8,
    name: "Greek Salad",
    description: "Cucumber, tomatoes, olives, feta cheese with olive oil dressing",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "salad",
    isVegetarian: true
  },
  
  // 🍝 PASTA
  {
    id: 9,
    name: "Pasta Carbonara",
    description: "Spaghetti with creamy egg sauce, pancetta, and black pepper",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "pasta",
    isVegetarian: false
  },
  {
    id: 10,
    name: "Vegetable Pasta",
    description: "Penne pasta with mixed vegetables in tomato basil sauce",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "pasta",
    isVegetarian: true
  },
  
  // 🍛 INDIAN
  {
    id: 11,
    name: "Chicken Tikka Masala",
    description: "Grilled chicken in creamy tomato sauce with basmati rice",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "indian",
    isVegetarian: false,
    popular: true
  },
  {
    id: 12,
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in rich buttery tomato gravy",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "indian",
    isVegetarian: true
  },
  
  // 🥢 ASIAN
  {
    id: 13,
    name: "Vegetable Stir Fry",
    description: "Assorted vegetables stir-fried in soy-ginger sauce",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "asian",
    isVegetarian: true
  },
  {
    id: 14,
    name: "Chicken Fried Rice",
    description: "Fried rice with chicken, eggs, and mixed vegetables",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "asian",
    isVegetarian: false
  },
  
  // 🍰 DESSERTS
  {
    id: 15,
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with vanilla ice cream",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "dessert",
    isVegetarian: true,
    popular: true
  },
  {
    id: 16,
    name: "Cheesecake",
    description: "New York style cheesecake with berry compote",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "dessert",
    isVegetarian: true
  },
  
  // 🥤 BEVERAGES
  {
    id: 17,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "beverage",
    isVegetarian: true
  },
  {
    id: 18,
    name: "Mango Lassi",
    description: "Refreshing yogurt-based mango drink",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "beverage",
    isVegetarian: true
  },
  {
    id: 19,
    name: "Iced Coffee",
    description: "Cold brewed coffee with milk and ice",
    price: 4.49,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "beverage",
    isVegetarian: true
  },
  {
    id: 20,
    name: "Fresh Lemonade",
    description: "Homemade lemonade with mint leaves",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1621506289938-729a6b36b96f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "beverage",
    isVegetarian: true
  }
];

const MenuPage = () => {
  const [menuItems] = useState(sampleMenuItems);
  const [categories] = useState([
    "All", 
    "pizza", 
    "burger", 
    "salad", 
    "pasta", 
    "indian", 
    "asian", 
    "dessert", 
    "beverage"
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading] = useState(false);
  const [error] = useState('');

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="warning">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading delicious menu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-2">Our Delicious Menu</h1>
      <p className="text-center text-muted mb-5">
        Choose from our wide selection of mouth-watering dishes
      </p>
      
      {/* Category Filters */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categories.map(category => (
          <button
            key={category}
            className={`btn ${activeCategory === category ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {category === "All" && ` (${menuItems.length})`}
          </button>
        ))}
      </div>
      
      {/* Popular Items Section */}
      {activeCategory === "All" && (
        <div className="mb-5">
          <h3 className="mb-4 text-warning">🔥 Most Popular</h3>
          <Row xs={1} md={2} lg={4} className="g-4 mb-5">
            {menuItems
              .filter(item => item.popular)
              .map(item => (
                <Col key={item.id}>
                  <MenuItem item={item} />
                </Col>
              ))}
          </Row>
        </div>
      )}
      
      {/* All Items Section */}
      <h3 className="mb-4">
        {activeCategory === "All" ? "All Items" : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        <span className="text-muted ms-2 small">
          ({filteredItems.length} items)
        </span>
      </h3>
      
      {filteredItems.length === 0 ? (
        <Alert variant="info" className="text-center">
          No items found in this category
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredItems.map(item => (
            <Col key={item.id}>
              <MenuItem item={item} />
            </Col>
          ))}
        </Row>
      )}
      
      {/* Menu Stats */}
      <div className="mt-5 pt-4 border-top text-center">
        <Row>
          <Col md={4}>
            <div className="p-3">
              <h4 className="text-warning">{menuItems.length}</h4>
              <p className="text-muted mb-0">Total Items</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3">
              <h4 className="text-warning">
                {menuItems.filter(item => item.isVegetarian).length}
              </h4>
              <p className="text-muted mb-0">Vegetarian Options</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3">
              <h4 className="text-warning">
                ${Math.min(...menuItems.map(item => item.price)).toFixed(2)}
              </h4>
              <p className="text-muted mb-0">Starting From</p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default MenuPage;