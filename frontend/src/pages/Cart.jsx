import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-app py-16">
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added any Peshawari Chappal yet."
          action={
            <Link to="/shop" className="btn-primary mt-2">
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-line rounded-xl border border-line bg-white">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4 p-4 sm:p-5">
                <Link to={`/product/${item.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.slug}`} className="text-sm font-semibold text-ink hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">Size: EU {item.size}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      aria-label="Remove item"
                      className="text-muted hover:text-red-600"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.productId, item.size, q)}
                      max={item.maxStock || 99}
                    />
                    <span className="text-sm font-bold text-primary">
                      Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={clearCart} className="mt-4 text-sm font-medium text-muted hover:text-red-600">
            Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink">Order Summary</h2>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-ink">Rs. {subtotal.toLocaleString("en-PK")}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-muted">
            <span>Shipping</span>
            <span className="font-medium text-ink">Calculated at checkout</span>
          </div>
          <div className="my-4 border-t border-line" />
          <div className="flex items-center justify-between text-base font-bold text-ink">
            <span>Total</span>
            <span className="text-primary">Rs. {subtotal.toLocaleString("en-PK")}</span>
          </div>

          <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">
            Proceed to Checkout <FiArrowRight size={16} />
          </button>
          <Link to="/shop" className="mt-3 block text-center text-sm font-medium text-muted hover:text-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
