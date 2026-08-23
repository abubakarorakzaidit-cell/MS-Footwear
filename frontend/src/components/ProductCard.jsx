import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import StarRating from "./StarRating";
import WhatsAppButton from "./WhatsAppButton";
import { useCart } from "../context/CartContext";
import { productOrderMessage } from "../utils/whatsapp";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const image = product.images?.[0]?.url;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const size = product.sizes?.[0];
    addToCart(product, { size, quantity: 1 });
  };

  return (
    <div className="card group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-cardHover">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-neutral-50">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
            -{product.discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-ink hover:text-primary">{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} />

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-primary">Rs. {product.price?.toLocaleString("en-PK")}</span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through">
              Rs. {product.originalPrice?.toLocaleString("en-PK")}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-primary px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-40"
          >
            <FiShoppingCart size={14} /> Add to Cart
          </button>
          <WhatsAppButton
            variant="icon"
            message={productOrderMessage(product, { quantity: 1, size: product.sizes?.[0] })}
          />
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="text-center text-xs font-medium text-muted hover:text-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
