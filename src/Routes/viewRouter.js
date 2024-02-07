import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";
import cartDao from "../daos/dbManager/cart.dao.js";
import Handlebars from "handlebars";
import cookieParser from "cookie-parser";

Handlebars.registerHelper('add', (a, b) => {
  return a + b;
});

const router = Router();

router.get("/", async (req, res) => {
  try {
      const { limit = 10, page = 1, sort, query, category, availability } = req.query;

      const limitInt = parseInt(limit);
      const pageInt = parseInt(page);

      const result = await productsDao.getAllProduct({
          limit: limitInt,
          page: pageInt,
          sort,
          query,
          category,
          availability,
      });
      

      res.render("listProducts", {
        fileCss: "styles_products.css",
        products: result.products,
        total: result.total,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        page: parseInt(pageInt),
        add: Handlebars.helpers.add
    });
    
  } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
  }
});

/* router.get("/listProducts/details/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const product = await productsDao.getProductById(id);
      res.render("productDetails", {
        title: "Detalle del producto",
        fileCss: "detailsProduct.css",
          product,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          status: "error",
          error: "Error interno del servidor",
      });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const { limit = 10, page = 1} = req.query;

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);

    const result = await productsDao.getAllProduct({
      limit: limitInt,
      page: pageInt,
    });

    res.render("realTimeProducts", {
      title: "Lista de Productos en Tiempo Real",
      fileCss: "styles_realtimee.css",
      products: result.products,
      total: result.total,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/chat", (req, res) => {
  res.render("chatAplication", {
    fileCss: "chatStyle.css"
  });
});

router.get("/carts/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cartProducts = await cartDao.getAllCart(cartId);

    res.render("cart", {
      title: "Vista del Carrito",
      fileCss: "cartStyle.css",
      cartProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
}); */


export default router;