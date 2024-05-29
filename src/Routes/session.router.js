const Router = require('express');
const router = Router();
const userModel = require('../Dao/Models/user.model.js');
const handlebars = require("express-handlebars");
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, email, age, password, role} = req.body;
        
        //encripta el password del usuario
        const passEncrypted = await bcrypt.hash(password, 2); //2 -> cantidad de veces que se aplica el algoritmo
        await userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email, 
            age: age,
            password: passEncrypted,
            role: role
        });
        
        //una vez registrado correctamente redirecciona al usuario al login para iniciar sesion
        res.redirect('/views/login');
    } catch (error) {
        res.status(500).send({result: 'Error', message: error.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        //obtiene el usuario segun el email ingresado
        const user = await userModel.findOne({email: email});

        //si no se encuentra el usuario se informa el error
        if(!user){ return res.status(401).send({result: 'Error', message: 'el usuario ingresado no existe'}) }
        
        //comparar el password ingresado con el del usuario encontrado
        const matchPassword = await bcrypt.compare(password, user.password);

        //en caso de no coincidir informar el error
        if(!matchPassword){ return res.status(401).send({result: 'Error', message: 'el password ingresado es incorrecto'}) }

        //guarda la sesion del usuario
        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email, 
            age: user.age,
            role: user.role
        }

        //redirecciona al perfil
        res.redirect('/views/products');
    } catch (error) {
        res.status(500).send({result: 'Error', message: error.message});
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(500).send({result: 'Error', message: 'Error al cerrar sesión'});
        res.redirect('/views/login');
    });
});

module.exports = router;