import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    fileId: { type: String }, // ImageKit fileId, used for deletion
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0, default: null },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Handmade", "Premium", "Classic"],
      default: "Classic",
    },
    sizes: {
      type: [Number],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: {
      type: [imageSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    featured: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

// Keep discount and originalPrice consistent
productSchema.pre("save", function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
