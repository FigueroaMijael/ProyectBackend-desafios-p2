import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";

const router = Router();

router.get("/", async (req, res) => {
 try {
  const products = await productsDao.getAllProduct();

  res.json({
    products
  });
 } catch (error) {
  console.log(error);
 }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productsDao.getProductById(req.params.id);
    res.json({
      product
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
  const createProduct = await productsDao.createProduct(req.body);
  res.json({
    createProduct
  })
  } catch (error) {
    console.log(error);
    res.json({ info: "Error creating product", error });
  }
});

export default router;