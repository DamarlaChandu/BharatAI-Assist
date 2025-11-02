import express from "express";
const router = express.Router();

// Example product data
const products = [
  { id: 1, name: "Organic Rice", price: 100 },
  { id: 2, name: "Wheat Seeds", price: 80 },
  { id: 3, name: "Fertilizer Pack", price: 150 }
];

// Route to get all products
router.get("/", (req, res) => {
  res.json(products);
});

export default router;
