import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";
import { io } from "../servidor.js";

const router = Router();


router.get("/", (req, res) => {
  res.render("index", {
    title: "Bienvenida",
      fileCss: "moduleBienvenida.css",
  })
})

router.get("/listProducts", async (req, res) => {
  try {
      const products = await productsDao.getAllProduct();
      res.render("listProducts", {
          fileCss: "style.css",
          products,
      });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
  }
});



router.get("/realtimeproducts", async (req, res) => {
  try {
    const realTimeViewProducts = await productsDao.getAllProduct();

    res.render("realTimeProducts", {
      title: "Lista de Productos en Tiempo Real",
      fileCss: "style.css",
      realTimeViewProducts,
  });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
  }
});

router.post("/realtimeproducts", async (req, res) => {
  const { title, description, price, category, thumbnail, stock, code } = req.body;

  const newProduct = {
    title,
    description,
    price,
    category,
    thumbnail,
    stock,
    code,
  };

  try {

    await productsDao.createProduct(newProduct);

    io.emit("realTimeProducts_list", await productsDao.getAllProduct());

    const realTimeViewProducts = await productsDao.getAllProduct();

    res.status(201).render("realTimeProducts", {
      title: "Lista de Productos en Tiempo Real",
      fileCss: "style.css",
      realTimeViewProducts,
    });
  } catch (e) {
    res.status(500).json({
      message: "Hubo un error al crear el nuevo producto",
      error: e.message,
    });
  }
});

  

router.post("/deleteProduct/:id", (req, res) => {
  const { id } = req.params;

  try {
     productsDao.deleteProduct(id);
     productsDao.broadcastProducts(); 
      res.status(200).json({
          message: "Producto eliminado",
      });
  } catch (e) {
      res.status(500).json({
          message: "Hubo un error al eliminar el producto",
          error: e.message,
      });
  }
});

router.get("/chat", (req, res) => {
  res.render("chatAplication", {
    fileCss: "chatStyle.css"
  });
});

export default router;