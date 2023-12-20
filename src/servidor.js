import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './dirname.js'
import productsRoute from './Routes/productsRoute.js';
import cartRoute from './Routes/cartRoute.js';
import viewRouter from './Routes/viewRouter.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import MessagesDao from './daos/dbManager/messages.dao.js'

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

mongoose.connect('mongodb://127.0.0.1:27017/ecommers')
.then(() => {
  console.log("Connected DB");
})
.catch((error) => {
  console.log(error);
});

const io = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
      // index.hbs
      extname: "hbs",
      // Plantilla principal
      defaultLayout: "main",
      handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
  );

  app.set("view engine", "hbs");
  app.set("views", `${__dirname}/views`);
  
  app.use(express.static(`${__dirname}/public`));

  app.use('/api/products', productsRoute);
  app.use('/api/cart', cartRoute);
  app.use("/api", viewRouter);
  
  const users = [];
  const messages = [];
  
  io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");
  
    socket.on("message", async (data) => {
      try {
        const newMessage = await MessagesDao.addMessage(data.user, data.message);
        io.emit("messages", await MessagesDao.getAllMessages());
      } catch (error) {
        console.error(`Hubo un error al procesar el mensaje del formulario en tiempo real: ${error.message}`);
      }
    });
  
    socket.on("inicio", async (data) => {
      io.emit("messages", await MessagesDao.getAllMessages());
      socket.broadcast.emit("connected", data);
    });
  
    // Evento para manejar los mensajes del formulario (no estoy seguro de qué estás haciendo aquí, comentado por ahora)
    // socket.on("realTimeForm_message", (data) => {
    //   console.log(data);
    //   try {
    //     /*  manager.addProduct(new Productos(data.title, data.description, data.price, data.category, data.thumbnail, data.stock, data.code));
    //       manager.broadcastProducts(); // Envía la lista actualizada a todos los clientes */
    //   } catch (e) {
    //     console.error("Hubo un error al procesar el mensaje del formulario en tiempo real:", e.message);
    //   }
    // });
  
    // Evento para manejar los mensajes del formulario (tal como lo estás haciendo actualmente)

  });
  