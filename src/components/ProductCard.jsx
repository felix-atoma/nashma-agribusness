import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddToCartButton from '../pages/AddToCartButton'

const ProductCard = ({ product }) => {
  return (
    <div className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <AddToCartButton 
            productId={product._id} 
            stock={product.stock}
            className="max-w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;