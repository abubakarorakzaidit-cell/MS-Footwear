import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { fetchOrderById } from "../services/orderService";
import Loader from "../components/Loader";
import WhatsAppButton from "../components/WhatsAppButton";
import { easypaisaScreenshotMessage, orderConfirmationMessage } from "../utils/whatsapp";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (order) return;
    fetchOrderById(orderNumber)
      .then((data) => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber, order]);

  if (loading) return <Loader label="Loading your order..." fullPage />;

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-xl font-semibold text-ink">Order not found</h2>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container-app max-w-2xl py-14">
      <div className="rounded-xl border border-line bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FiCheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-ink">Order placed successfully.</h1>
        <p className="mt-2 text-sm text-muted">
          Your order number is <span className="font-semibold text-primary">{order.orderNumber}</span>
        </p>

        <div className="mt-6 rounded-lg border border-line bg-neutral-50 p-5 text-left text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted">Customer</span>
            <span className="font-medium text-ink">{order.customer.name}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted">Payment Method</span>
            <span className="font-medium text-ink">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Manual Easypaisa"}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted">Total</span>
            <span className="font-bold text-primary">Rs. {order.total.toLocaleString("en-PK")}</span>
          </div>
        </div>

        {order.paymentMethod === "EASYPAISA" ? (
          <div className="mt-6">
            <p className="mb-3 text-sm text-muted">
              After sending your payment, share the screenshot with us on WhatsApp so we can confirm your order.
            </p>
            <WhatsAppButton message={easypaisaScreenshotMessage(order)}>
              Send Payment Screenshot on WhatsApp
            </WhatsAppButton>
          </div>
        ) : (
          <div className="mt-6">
            <WhatsAppButton message={orderConfirmationMessage(order)} variant="outline">
              Confirm Order on WhatsApp
            </WhatsAppButton>
          </div>
        )}

        <Link to="/shop" className="mt-6 block text-sm font-medium text-muted hover:text-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
