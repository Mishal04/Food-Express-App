import React, { useState, useEffect, useCallback } from 'react';
import MenuItem from '../components/Menu/MenuItem';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { 
  FaUtensils, 
  FaPizzaSlice, 
  FaHamburger, 
  FaLeaf, 
  FaIceCream, 
  FaCoffee,
  FaShoppingCart,
  FaFire
} from 'react-icons/fa';
import { 
  GiNoodles, 
  GiBowlOfRice, 
  GiChopsticks 
} from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// ─── Data ──────────────────────────────────────────────────────────────────

const sampleMenuItems = [
  // 🍕 PIZZAS
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomato sauce, mozzarella, and basil leaves',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'pizza',
    isVegetarian: true,
    popular: true,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with extra cheese on a crisp thin crust',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'pizza',
    isVegetarian: false,
    popular: true,
  },
  {
    id: '3',
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken with smoky BBQ sauce, red onions, and fresh cilantro',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'pizza',
    isVegetarian: false,
  },
  // 🍔 BURGERS
  {
    id: '4',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with aged cheddar, lettuce, tomato, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'burger',
    isVegetarian: false,
    popular: true,
  },
  {
    id: '5',
    name: 'Veggie Burger',
    description: 'Plant-based patty with creamy avocado, lettuce, and vegan mayo',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'burger',
    isVegetarian: true,
  },
  {
    id: '6',
    name: 'Double Bacon Burger',
    description: 'Double beef patty stacked with crispy bacon and melted cheddar',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'burger',
    isVegetarian: false,
  },
  // 🥗 SALADS
  {
    id: '7',
    name: 'Caesar Salad',
    description: 'Crisp romaine with Caesar dressing, house croutons, and parmesan',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'salad',
    isVegetarian: true,
  },
  {
    id: '8',
    name: 'Greek Salad',
    description: 'Cucumber, tomatoes, kalamata olives, and feta with olive oil dressing',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'salad',
    isVegetarian: true,
  },
  // 🍝 PASTA
  {
    id: '9',
    name: 'Pasta Carbonara',
    description: 'Silky spaghetti with egg sauce, guanciale, pecorino, and black pepper',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'pasta',
    isVegetarian: false,
  },
  {
    id: '10',
    name: 'Vegetable Pasta',
    description: 'Penne with garden vegetables in a fragrant tomato-basil sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'pasta',
    isVegetarian: true,
  },
  // 🍛 INDIAN
  {
    id: '11',
    name: 'Chicken Tikka Masala',
    description: 'Tandoor-grilled chicken in velvety tomato cream sauce with basmati rice',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'indian',
    isVegetarian: false,
    popular: true,
  },
  {
    id: '12',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes simmered in a rich, buttery tomato gravy',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'indian',
    isVegetarian: true,
  },
  // 🥢 ASIAN
  {
    id: '13',
    name: 'Vegetable Stir Fry',
    description: 'Wok-tossed seasonal vegetables in a savory soy-ginger glaze',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'asian',
    isVegetarian: true,
  },
  {
    id: '14',
    name: 'Chicken Fried Rice',
    description: 'Wok-fried jasmine rice with chicken, eggs, and spring onions',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'asian',
    isVegetarian: false,
  },
  // 🍰 DESSERTS
  {
    id: '15',
    name: 'Chocolate Brownie',
    description: 'Warm, fudgy chocolate brownie served with vanilla bean ice cream',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'dessert',
    isVegetarian: true,
    popular: true,
  },
  {
    id: '16',
    name: 'Cheesecake',
    description: 'Creamy New York-style cheesecake with a fresh mixed-berry compote',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'dessert',
    isVegetarian: true,
  },
  // 🥤 BEVERAGES
  {
    id: '17',
    name: 'Fresh Orange Juice',
    description: 'Cold-pressed oranges — 100% pure, no added sugar',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'beverage',
    isVegetarian: true,
  },
  {
    id: '18',
    name: 'Mango Lassi',
    description: 'Thick, chilled yogurt drink blended with ripe Alphonso mangoes',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'beverage',
    isVegetarian: true,
  },
  {
    id: '19',
    name: 'Iced Coffee',
    description: 'Slow-brewed cold coffee with oat milk over crushed ice',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'beverage',
    isVegetarian: true,
  },
  {
    id: '20',
    name: 'Fresh Lemonade',
    description: 'Hand-squeezed lemonade with fresh mint and a hint of honey',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1496715976403-3e37f53e7eda?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90',
    category: 'beverage',
    isVegetarian: true,
  },
];

const CATEGORIES = [
  { id: 'all',      label: 'All',       icon: <FaUtensils /> },
  { id: 'pizza',    label: 'Pizza',     icon: <FaPizzaSlice /> },
  { id: 'burger',   label: 'Burger',    icon: <FaHamburger /> },
  { id: 'salad',    label: 'Salad',     icon: <FaLeaf /> },
  { id: 'pasta',    label: 'Pasta',     icon: <GiNoodles /> },
  { id: 'indian',   label: 'Indian',    icon: <GiBowlOfRice /> },
  { id: 'asian',    label: 'Asian',     icon: <GiChopsticks /> },
  { id: 'dessert',  label: 'Dessert',   icon: <FaIceCream /> },
  { id: 'beverage', label: 'Drinks',    icon: <FaCoffee /> },
];

// ─── Skeleton Card ───────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton--img" />
    <div className="skeleton-card__body">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--text skeleton--text-short" />
      <div className="skeleton skeleton--btn" />
    </div>
  </div>
);


// ─── MenuPage ────────────────────────────────────────────────────────────────

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Simulate a brief load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);


  const filteredItems = sampleMenuItems.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const popularItems = sampleMenuItems.filter((i) => i.popular);

  const handleCategoryChange = useCallback((id) => {
    setActiveCategory(id);
    setSearch('');
  }, []);

  return (
    <div className="menu-page">

      {/* ── Hero Banner ────────────────────────────────────── */}
      <section className="menu-hero">
        <div className="menu-hero__bg" />
        <div className="menu-hero__content">
          <p className="menu-hero__eyebrow">FoodExpress Kitchen</p>
          <h1 className="menu-hero__title">
            One bite and <span className="menu-hero__accent">you're cooked</span>
          </h1>
          <p className="menu-hero__sub">
            {sampleMenuItems.length} dishes crafted with love — delivered to your door.
          </p>

          {/* Search bar */}
          <div className="menu-search">
            <FiSearch className="menu-search__icon" />
            <input
              id="menu-search-input"
              className="menu-search__input"
              type="text"
              placeholder="Search dishes…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCategory('all');
              }}
              aria-label="Search menu items"
            />
            {search && (
              <button
                className="menu-search__clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Cart FAB */}
        <button
          id="cart-fab"
          className="cart-fab"
          onClick={() => navigate('/cart')}
          aria-label="Go to cart"
        >
          <FiShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="cart-fab__badge">{cartCount}</span>
          )}
        </button>
      </section>

      {/* ── Category Pills ─────────────────────────────────── */}
      <section className="menu-categories" aria-label="Menu categories">
        <div className="menu-categories__track">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`cat-${cat.id}`}
              className={`cat-pill ${activeCategory === cat.id ? 'cat-pill--active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              aria-pressed={activeCategory === cat.id}
            >
              <span className="cat-pill__emoji">{cat.icon}</span>
              {cat.label}
              {cat.id === 'all' && (
                <span className="cat-pill__count">{sampleMenuItems.length}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="menu-page__body">

        {/* ── Popular Section (only on "All" tab, no search) ─ */}
        {activeCategory === 'all' && !search && (
          <section className="menu-section">
            <div className="menu-section__header">
              <h2 className="menu-section__title">
                <FaFire className="text-accent me-2" /> <span>Most Popular</span>
              </h2>
              <p className="menu-section__sub">Fan-favourite dishes loved by thousands</p>
            </div>

            {loading ? (
              <div className="menu-grid menu-grid--popular">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="menu-grid menu-grid--popular">
                {popularItems.map((item, i) => (
                  <MenuItem key={item.id} item={item} index={i} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Main Grid ──────────────────────────────────────── */}
        <section className="menu-section">
          <div className="menu-section__header">
            <h2 className="menu-section__title">
              {search
                ? `Results for "${search}"`
                : activeCategory === 'all'
                ? 'Full Menu'
                : `${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
            </h2>
            {!loading && (
              <p className="menu-section__sub">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {loading ? (
            <div className="menu-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="menu-empty">
              <div className="menu-empty__icon"><FaUtensils /></div>
              <h3>No dishes found</h3>
              <p>Try a different category or search term</p>
              <button
                className="menu-empty__reset"
                onClick={() => { setSearch(''); setActiveCategory('all'); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredItems.map((item, i) => (
                <MenuItem key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── Stats Bar ────────────────────────────────────────── */}
        <section className="menu-stats">
          <div className="menu-stat">
            <span className="menu-stat__num">{sampleMenuItems.length}</span>
            <span className="menu-stat__label">Total Dishes</span>
          </div>
          <div className="menu-stat__divider" />
          <div className="menu-stat">
            <span className="menu-stat__num">
              {sampleMenuItems.filter((i) => i.isVegetarian).length}
            </span>
            <span className="menu-stat__label">Vegetarian</span>
          </div>
          <div className="menu-stat__divider" />
          <div className="menu-stat">
            <span className="menu-stat__num">
              ${Math.min(...sampleMenuItems.map((i) => i.price)).toFixed(2)}
            </span>
            <span className="menu-stat__label">Starting From</span>
          </div>
          <div className="menu-stat__divider" />
          <div className="menu-stat">
            <span className="menu-stat__num">30</span>
            <span className="menu-stat__label">Min Delivery</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuPage;