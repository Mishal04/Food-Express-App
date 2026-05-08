import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FaStar, FaFire, FaLeaf, FaPlus, FaCheck } from 'react-icons/fa';

const MenuItem = ({ item, index = 0 }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    if (added) return;
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const fallbackSrc =
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';

  return (
    <div
      className="food-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className="food-card__img-wrap">
        <img
          className="food-card__img"
          src={imgError ? fallbackSrc : item.image}
          alt={item.name}
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="food-card__img-overlay" />

        {/* Badges */}
        <div className="food-card__badges">
          {item.popular && (
            <span className="food-badge food-badge--hot">
              <FaFire size={10} /> Hot
            </span>
          )}
          {item.isVegetarian && (
            <span className="food-badge food-badge--veg">
              <FaLeaf size={10} /> Veg
            </span>
          )}
        </div>

        {/* Price */}
        <div className="food-card__price">
          ${item.price.toFixed(2)}
        </div>
      </div>

      {/* Body */}
      <div className="food-card__body">
        <div className="food-card__title-row">
          <h3 className="food-card__name">{item.name}</h3>
          {item.popular && <FaStar className="food-card__star" size={14} />}
        </div>

        <p className="food-card__desc">{item.description}</p>

        <button
          className={`food-card__btn ${added ? 'food-card__btn--added' : ''}`}
          onClick={handleAddToCart}
          disabled={added}
          aria-label={`Add ${item.name} to cart`}
        >
          {added ? (
            <>
              <FaCheck size={13} />
              <span>Added!</span>
            </>
          ) : (
            <>
              <FaPlus size={13} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;