import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiShoppingCart, FiCheck, FiChevronRight } from "react-icons/fi";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import QuantitySelector from "../components/QuantitySelector";
import WhatsAppButton from "../components/WhatsAppButton";
import Loader from "../components/Loader";
import { productOrderMessage } from "../utils/whatsapp";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProductById(slug)
      .then((data) => {
        setProduct(data.product);
        setSize(data.product.sizes?.[0] ?? null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader label="Loading product..." fullPage />;

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-xl font-semibold text-ink">Product not found</h2>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, { size, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    addToCart(product, { size, quantity });
    navigate("/checkout");
  };

  return (
    <div className="container-app py-10">
      <div className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link to="/" className="hover:text-primary">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <FiChevronRight size={12} />
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-xl border border-line bg-neutral-50">
            <img
              src={product.images?.[activeImage]?.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === idx ? "border-primary" : "border-line"
                  }`}
                >
                  <img src={img.url} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-muted">({product.rating} rating)</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">Rs. {product.price.toLocaleString("en-PK")}</span>
            {hasDiscount && (
              <>
                <span className="text-base text-muted line-through">
                  Rs. {product.originalPrice.toLocaleString("en-PK")}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6">
            <span className="mb-2 block text-sm font-medium text-ink">
              Size: {size && <span className="text-primary">EU {size}</span>}
            </span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors ${
                    size === s
                      ? "border-primary bg-primary text-white"
                      : "border-line text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-ink">Quantity</span>
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 1} />
          </div>

          <p className={`mt-4 text-sm font-medium ${inStock ? "text-emerald-600" : "text-red-600"}`}>
            {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-outline flex-1 disabled:opacity-40"
            >
              {added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button onClick={handleOrderNow} disabled={!inStock} className="btn-primary flex-1 disabled:opacity-40">
              Order Now
            </button>
          </div>

          <div className="mt-3">
            <WhatsAppButton
              message={productOrderMessage(product, { quantity, size })}
              className="w-full sm:w-auto"
            >
              Order on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
