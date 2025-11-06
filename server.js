const express = require("express");
require("dotenv").config();
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Simple Products REST API." });
});

app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    detail: process.env.NODE_ENV === "production" ? null : err.message,
  });
});


app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}.`);
  console.log(` Access the API at http://localhost:${PORT}`);
});
