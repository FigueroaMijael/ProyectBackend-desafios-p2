import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import __dirname from './dirname.js'

import MongoStore from 'connect-mongo';

import productsRoute from './Routes/productsRoute.js';
import cartRoute from './Routes/cartRoute.js';
import viewRouter from './Routes/viewRouter.js'
import sessionRoute from './Routes/sessionsRoute.js'
import usersViewRoute from './Routes/usersViewRoute.js'

import { Server } from 'socket.io'
import MessagesDao from './daos/dbManager/messages.dao.js'
;

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

// CONNECTION TO DB

// CONFIGURACION DOTENV
require('dotenv').config();

const { connectToMongoDB } = require('./db.js');

connectToMongoDB()

//Configuracion express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion hbs
app.engine(
    "hbs",
    handlebars.engine({
      extname: "hbs",
      defaultLayout: "main",
      handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
  );

  app.set("view engine", "hbs");
  app.set("views", `${__dirname}/views`);
  app.use(express.static(__dirname + '/public'))

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });

 // CONFIGUERACION DE SESSION
    app.use(session(
      {
        store: MongoStore.create({
          mongoUrl: MONGO_URL,
          mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
          ttl: 10 * 60,
        }),
        
        secret: "codigoSecreto190",
        resave: true,
        saveUninitialized: true
      }
    ))

  // RUTAS
  app.use('/api/products', productsRoute);
  app.use('/api/cart', cartRoute);
  app.use("/", viewRouter);
  app.use("/api/session", sessionRoute);
  app.use("/users", usersViewRoute)

  const io = new Server(httpServer)

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

  });
  
  export {io}
  