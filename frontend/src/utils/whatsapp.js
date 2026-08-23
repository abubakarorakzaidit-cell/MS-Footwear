import siteConfig from "../config/siteConfig";

const BASE_URL = `https://wa.me/${siteConfig.whatsappNumber}`;

export const buildWhatsAppUrl = (message = "") => {
  const encoded = encodeURIComponent(message);
  return `${BASE_URL}${encoded ? `?text=${encoded}` : ""}`;
};

export const genericOrderMessage = () =>
  `Assalamualaikum, I want to order from MS Footwear.`;

export const productOrderMessage = (product, { quantity = 1, size } = {}) => {
  let msg = `Assalamualaikum, I want to order ${product.name} from MS Footwear.`;
  if (size) msg += `\nSize: ${size}`;
  if (quantity) msg += `\nQuantity: ${quantity}`;
  msg += `\nPrice: Rs. ${product.price?.toLocaleString("en-PK")}`;
  return msg;
};

export const orderConfirmationMessage = (order) => {
  return `Assalamualaikum, here are my order details:\nOrder Number: ${order.orderNumber}\nName: ${order.customer.name}\nTotal: Rs. ${order.total?.toLocaleString("en-PK")}\nPayment Method: ${order.paymentMethod === "COD" ? "Cash on Delivery" : "Easypaisa"}`;
};

export const easypaisaScreenshotMessage = (order) => {
  return `Assalamualaikum, I have made the Easypaisa payment. I am sending the payment screenshot.\nOrder Number: ${order.orderNumber}\nName: ${order.customer.name}\nTotal Amount: Rs. ${order.total?.toLocaleString("en-PK")}`;
};

export const contactPageMessage = () =>
  `Assalamualaikum, I have a question about MS Footwear.`;
