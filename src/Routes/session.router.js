const Router = require('express');
const router = Router();
const passport = require('passport');

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failRegister'}), async (req, res) => {    
    //una vez registrado correctamente redirecciona al usuario al login para iniciar sesion
    res.redirect('/views/login');
});

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/failLogin'}), async (req, res) => {
    
    const user = req.user;
    //si no se encuentra el usuario se informa el error
    if(!user){ return res.status(400).send({result: 'Error', message: 'credenciales inválidas'}) }
    
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
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(500).send({result: 'Error', message: 'Error al cerrar sesión'});
        res.redirect('/views/login');
    });
});

router.get('/failRegister', (req, res) => {
    res.send({error: 'error al registrar el usuario'});
})

router.get('/failLogin', (req, res) => {
    res.send({error: 'error al hacer el login'});
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/session/failLogin'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/views/products');
});

module.exports = router;