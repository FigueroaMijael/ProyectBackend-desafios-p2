import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import productsRoute from './Routes/productsRoute.js';
import cartRoute from './Routes/cartRoute.js';
import viewRouter from './Routes/viewRouter.js'
import { ProductManager, Productos } from './ProductManager.js';

import { Server } from 'socket.io'

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

const socketServer = new Server(httpServer)

const manager = new ProductManager('./Productos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
      // index.hbs
      extname: "hbs",
      // Plantilla principal
      defaultLayout: "main",
    })
  );

  app.set("view engine", "hbs");
  app.set("views", `${__dirname}/views`);
  
  app.use(express.static(`${__dirname}/public`));

  app.use('/api/productos', productsRoute);
  app.use('/api/cart', cartRoute);
  app.use("/api", viewRouter(socketServer, manager));

const users = [];

socketServer.on("connection", (socketClient) => {
  console.log("Nuevo cliente conectado");

  socketClient.on("message", (data) => {
      console.log(data);
  });

  socketClient.emit("server_message", "Mensaje desde el servidor");

  socketClient.broadcast.emit("message_all", `${socketClient.id} Conectado`);

  socketServer.emit("message_all_2", "Mensaje a todos");

  socketClient.on("form_message", (data) => {
    console.log(data);
    users.push(data);
    socketClient.emit("users_list", users);
  });

  socketClient.emit("users_list", users);

  socketClient.on("realTimeForm_message", (data) => {
    console.log(data);
    try {
        manager.addProduct(new Productos(data.title, data.description, data.price, data.category, data.thumbnail, data.stock, data.code));
        manager.broadcastProducts(); // Envía la lista actualizada a todos los clientes
    } catch (e) {
        console.error("Hubo un error al procesar el mensaje del formulario en tiempo real:", e.message);
    }
});
  })