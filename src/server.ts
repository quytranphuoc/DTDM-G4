import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Định nghĩa Schema
interface IProduct {
  name: string;
  price: number;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

// API thêm sản phẩm
app.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// API tìm kiếm sản phẩm
app.get("/search-products", async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({
      name: new RegExp(name as string, "i"),
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
