import Order from "../models/Order.js";

/**
 * Generates a sequential, unique order number like MSF-2026-00001.
 */
const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `MSF-${year}-`;

  const lastOrder = await Order.findOne({ orderNumber: new RegExp(`^${prefix}`) }).sort({
    createdAt: -1,
  });

  let nextNumber = 1;
  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.orderNumber.split("-")[2], 10);
    if (!isNaN(lastSeq)) nextNumber = lastSeq + 1;
  }

  return `${prefix}${String(nextNumber).padStart(5, "0")}`;
};

export default generateOrderNumber;
