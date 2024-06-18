const Router = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../Dao/Models/user.model.js');
const CartManagerDB = require('../Dao/Classes/cartManagerDB.js');
const cartMngr = new CartManagerDB();
const mongoose = require('mongoose');
const {passportCall} = require('../middlewares/auth.js');

router.post('/register', async (req, res) => {    
    const {firstName, lastName, email, age, role, password} = req.body;
    
    const session = await mongoose.startSession();
    //inicia la transaccion
    session.startTransaction();
    try {
        const user = await userModel.findOne({email: email});
        if(user) return res.send('El usuario ya existe');
        const newCart = await cartMngr.addCart(session);

        const passEncrypted = await bcrypt.hash(password, 2);
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            role,
            password: passEncrypted,
            cart: newCart._id
        }

        await userModel.create([newUser], { session: session });
        //Confirma la transacción
        await session.commitTransaction();
        //una vez registrado correctamente redirecciona al usuario al login para iniciar sesion
        res.redirect('/views/login');
    } catch (error) {
        await session.abortTransaction();
        return res.send({error: error.message});
    }finally {
        // Finaliza la sesión
        session.endSession();
      }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email: email}).lean();
        if(!user){ return res.status(400).send({result: 'Error', message: 'Usuario invalido'}) }

        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) return res.send('Contraseña incorrecta');

        //crea token, lo envia en una cookie y redirecciona a la pagina principal
        const token = jwt.sign(user, 'coderSecret', {expiresIn: '10m'});
        res.cookie('coderCookieToken', token, {maxAge: 60 * 60 * 1000, httpOnly: true} ).redirect('/views/products');
    } catch (error) {
        return res.send(error);
    }
});

router.get('/logout', (req, res) => {
    res.cookie('coderCookieToken', '', { expires: new Date(0), httpOnly: true }).redirect('/views/login');
});

router.get('/current', passportCall('jwt'), async (req, res) => {
    let user;
    try {
        //llamo a la base para obtener la referencia al carito dentro de la respuesta
        user = await userModel.findById(req.user._id).lean().populate('cart');
    } catch (error) {
        console.log(error.message);
    }
    res.send({user: user});
})
module.exports = router;