import React from 'react';

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  return (
    <article className="product-card">
      <img src={product.imageUrl} alt={product.title} />
      <div className="product-card__content">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <span className="product-card__price">${product.price}</span>
      </div>
    </article>
  );
}
