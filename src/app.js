const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const initializePassportJwt = require('./Config/passport.config.js');
const app = express();
const PORT = 8080;
const productsRouter = require("./Routes/products.router.js");
const cartsRouter = require("./Routes/carts.router.js");
const viewsRouter = require('./Routes/views.router.js');
const sessionRouter = require('./Routes/session.router.js');
const messageModel = require('./Dao/Models/message.model.js');
const dotenv = require('dotenv');
dotenv.config();
const Server = require('socket.io');
const cookieParser = require('cookie-parser');
const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto: ${PORT}`));
const socketServer = Server(httpServer);

//const ProductManager = require("./Dao/Classes/productManager.js");
//const productMngr = new ProductManager('./productos.json');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
//initializePassport();
//initializePassportGithub();
initializePassportJwt();
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/session', sessionRouter);
app.use('/views', viewsRouter);
app.use(express.static(__dirname + '/Public'));

mongoose.connect("mongodb+srv://gianluca96:coder.k1ekiv@coderbackend.eme0pdu.mongodb.net/eCommerce?retryWrites=true&w=majority&appName=CoderBackEnd")
.then(() => {console.log('Conectado a la base de datos')})
.catch(error => {console.log('Error al conectar a la base de datos: ' + error.message)});

socketServer.on('connection', async socket => {
    console.log("Nuevo cliente conectado");

    const dataDb = await messageModel.find({});
    socket.emit('messagesDB', dataDb);

    socket.on('message', async (data) => { await messageModel.create({user: data.userName, message: data.message}) })
})