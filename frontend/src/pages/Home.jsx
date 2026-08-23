import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiAward } from "react-icons/fi";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import WhatsAppButton from "../components/WhatsAppButton";
import Loader from "../components/Loader";
import { genericOrderMessage } from "../utils/whatsapp";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProducts({ featured: "true", limit: 4 })
      .then((data) => mounted && setFeatured(data.products))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-primary-light/40">
        <div className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              Handcrafted in Peshawar
            </span>
            <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Authentic Peshawari Chappal
            </h1>
            <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
              Traditional craftsmanship. Modern comfort.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="btn-primary">
                Shop Now <FiArrowRight size={16} />
              </Link>
              <WhatsAppButton message={genericOrderMessage()} variant="outline">
                Order on WhatsApp
              </WhatsAppButton>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: FiTruck, label: "Nationwide Delivery" },
                { icon: FiShield, label: "Cash on Delivery" },
                { icon: FiAward, label: "Genuine Leather" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-card">
                    <Icon size={18} />
                  </span>
                  <span className="text-xs font-medium text-ink sm:text-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-white shadow-cardHover">
              <img
                src="https://www.peshawarichappals.pk/cdn/shop/files/mustard_charsadda_chappal_09216_1.jpg?v=1776422393"
                alt="Authentic handcrafted Peshawari Chappal"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-app py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-title">Featured Chappal</h2>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading featured products..." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Story strip */}
      <section className="border-t border-line bg-primary-light/30">
        <div className="container-app grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="section-title">Our Story</h2>
            <p className="mt-4 text-muted">
              At MS Footwear, we bring you authentic Peshawari Chappals made
              with quality and care. Our goal is to provide comfortable,
              stylish, and traditional footwear that you can wear with
              confidence. Every pair is made to give you the perfect blend of
              tradition and modern style.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Learn our story <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-xl border border-line bg-white"
              >
                <img
                  src="https://images.openai.com/static-rsc-4/WH_LYsSizfkjt_IemOCjRe4KuPuxF3ihkBiAYrpusB6h_rqW9DvrO03SSEQKDgGKG0TKO6chs0ygyAmPWKb7GdMZ68pfGkpSL8mKIkHK9_qM2mvh3Y_6n6AJ6cKQZGhYzlxwLTs9A8RKlUyd78xme1jnInNAAwBRDF1mq8nuvdjdOZUYUtQ1nc0gpo0vIygy?purpose=fullsize"
                  alt="Peshawari Chappal craftsmanship"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
