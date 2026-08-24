import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiInbox } from "react-icons/fi";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const categories = ["All", "Men", "Women", "Kids", "Handmade", "Premium", "Classic"];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(search);

  const load = useCallback(() => {
    setLoading(true);
    fetchProducts({ search, category, sort, limit: 24 })
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => setSearchInput(search), [search]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All" && value !== "") next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput);
  };

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="section-title">Shop Peshawari Chappal</h1>
        <p className="mt-1 text-sm text-muted">Browse our full collection of handcrafted traditional footwear.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-10"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className="input-field w-auto"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input-field w-auto">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="No products found"
          message="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
