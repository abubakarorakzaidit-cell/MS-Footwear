import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { fetchPublicConfig } from "../services/configService";
import EmptyState from "../components/EmptyState";
import siteConfig from "../config/siteConfig";

const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory"];

const initialForm = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
  paymentMethod: "COD",
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [easypaisa, setEasypaisa] = useState({
    number: siteConfig.easypaisaNumberFallback,
    name: siteConfig.easypaisaAccountNameFallback,
  });

  useEffect(() => {
    fetchPublicConfig()
      .then((data) =>
        setEasypaisa({
          number: data.config.easypaisaNumber,
          name: data.config.easypaisaAccountName,
        })
      )
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="container-app py-16">
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          message="Add some products to your cart before checking out."
          action={
            <Link to="/shop" className="btn-primary mt-2">
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Full name is required";
    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) err.phone = "Enter a valid phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email";
    if (!form.address.trim()) err.address = "Complete address is required";
    if (!form.city.trim()) err.city = "City is required";
    if (!form.province) err.province = "Province is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        items: items.map((i) => ({ product: i.productId, size: i.size, quantity: i.quantity })),
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };

      const { order } = await createOrder(payload);
      clearCart();
      navigate(`/order-confirmation/${order.orderNumber}`, { state: { order } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Contact & shipping */}
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-ink">Contact & Shipping Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-text">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="label-text">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="03XX-XXXXXXX" />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="label-text">WhatsApp Number (if different)</label>
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-text">Email (optional)</label>
                <input name="email" value={form.email} onChange={handleChange} className="input-field" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">Complete Address *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  className="input-field resize-none"
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>
              <div>
                <label className="label-text">City *</label>
                <input name="city" value={form.city} onChange={handleChange} className="input-field" />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label className="label-text">Province *</label>
                <select name="province" value={form.province} onChange={handleChange} className="input-field">
                  <option value="">Select province</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.province && <p className="mt-1 text-xs text-red-600">{errors.province}</p>}
              </div>
              <div>
                <label className="label-text">Postal Code (optional)</label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">Order Notes (optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-ink">Payment Method</h2>
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                  form.paymentMethod === "COD" ? "border-primary bg-primary-light/40" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === "COD"}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">Cash on Delivery</p>
                  <p className="text-xs text-muted">Pay in cash when your order is delivered.</p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                  form.paymentMethod === "EASYPAISA" ? "border-primary bg-primary-light/40" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="EASYPAISA"
                  checked={form.paymentMethod === "EASYPAISA"}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">Manual Easypaisa Payment</p>
                  <p className="text-xs text-muted">Send payment manually, then share a screenshot on WhatsApp.</p>
                </div>
              </label>

              {form.paymentMethod === "EASYPAISA" && (
                <div className="rounded-lg border border-primary/30 bg-primary-light/30 p-4 text-sm text-ink">
                  <p>
                    Send your payment to Easypaisa number{" "}
                    <span className="font-bold text-primary">{easypaisa.number}</span> ({easypaisa.name}).
                  </p>
                  <p className="mt-1 text-muted">
                    Send your payment to the Easypaisa number above and send the payment screenshot on
                    WhatsApp after placing your order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
          )}
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-xl border border-line bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-ink">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="line-clamp-1 text-xs font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-muted">
                    Size {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink">
                  Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                </span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-line" />
          <div className="flex items-center justify-between text-base font-bold text-ink">
            <span>Total</span>
            <span className="text-primary">Rs. {subtotal.toLocaleString("en-PK")}</span>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
