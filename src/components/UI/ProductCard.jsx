import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import Button from './Button';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      dispatch(addToCart({ product, quantity }));
      toast.success(`Added ${quantity} ${product.name}(s) to cart! 🎂`);
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden">
        <img
          src={product.image || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            ₹{product.price}
          </span>
          {product.stock !== undefined && (
            <span className={`text-sm px-2 py-1 rounded-full ${
              product.stock > 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={decrementQuantity}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-gray-900 dark:text-white font-semibold">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            loading={isAdding}
            disabled={product.stock === 0}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;