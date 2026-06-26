"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from './cart-context';
import { useToast } from './toast';

export function AddToCartButton({ product, price, size }: { product: any, price: number, size?: string }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      price_at_time: price,
      size: size
    });
    showToast(`${product.name} added to cart!`);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-forest-deep text-white p-2 rounded-full hover:bg-primary-custom transition-colors shadow-sm active:scale-95 z-10 relative"
      aria-label={`Add ${product.name} to cart`}
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  );
}
