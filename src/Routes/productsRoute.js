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

  const { id } = req.params;

  try {
    const product = await productsDao.getProductById(id);
    res.json({
      product
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {

  const { title, description, price, thumbnail, category, stock, code} = req.body;

  const newProduct = {
    title,
    description,
    price,
    thumbnail,
    category,
    stock,
    code
  }

  try {
  const createProduct = await productsDao.createProduct(newProduct);
  res.json({
    createProduct
  })
  } catch (error) {
    console.log(error);
    res.json({ info: "Error creating product", error });
  }
});

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  try {
      const result = await updateProduct(id, product);
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar el producto.' });
  }
});

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const result = await deleteProduct(productId);
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Hubo un error al eliminar el producto.' });
  }
});

export default router;