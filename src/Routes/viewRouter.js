import { Router } from "express";
import { ProductManager, Productos } from '../ProductManager.js';


const viewRouter = (socketServer, manager) => {
  const router = Router();




router.get("/", (req, res) => {
  res.render("index", {
    title: "Bienvenida",
      fileCss: "moduleBienvenida.css",
  })
})

// viewRouter.js
router.get("/api/home", (req, res) => {
  const productos = manager.mostrarProductos();
  res.render("home", {
      title: "Lista de Productos",
      fileCss: "style.css",
      productos: productos,
  });
});


router.get("/api/realtimeproducts", (req, res) => {
  const productos = manager.mostrarProductos();
  res.render("realTimeProducts", {
      title: "Lista de Productos en Tiempo Real",
      fileCss: "style.css",
      productos: productos,
  });
});


const users = [];

// Form
router.get("/api/form", (req, res) => {
  res.render("form", {
    title: "Form example",
    fileCss: "style.css",
  });
});

router.post("/api/user", (req, res) => {
  const { name, age } = req.body;

  users.push({
    name,
    age,
  });

  res.json({
    message: "User created",
    user: { name, age },
  });
});

router.post("/api/realtimeproducts", (req, res) => {
  const { title, description, price, category, thumbnail, stock, code } = req.body;

  const product = new Productos(
    title,
    description,
    price,
    category,
    thumbnail,
    stock,
    code
  );

  try {
    manager.addProduct(product);
    socketServer.emit("realTimeProducts_list", manager.mostrarProductos()); // Envía la lista actualizada a todos los clientes
    res.status(201).json({
      message: "Producto creado",
      product,
    });
  } catch (e) {
    res.status(500).json({
      message: "Hubo un error al crear el nuevo producto",
      error: e.message,
    });
  }
});

router.post("/api/deleteProduct", (req, res) => {
  const { id } = req.body;

  try {
      manager.deleteProduct(id);
      manager.broadcastProducts(); // Envía la lista actualizada a todos los clientes
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

return router
}

export default viewRouter;

