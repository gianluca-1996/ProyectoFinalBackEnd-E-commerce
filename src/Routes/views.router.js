const Router = require("express");
const router = Router();
const handlebars = require("express-handlebars");
const ProductManagerDB = require("../Dao/Classes/productManagerDB.js");
const CartManagerDB = require('../Dao/Classes/cartManagerDB.js');
const productMngr = new ProductManagerDB();
const cartMngr = new CartManagerDB();
const {isAuthenticated, isNotAuthenticated} = require('../middlewares/auth.js');
router.engine("handlebars", handlebars.engine());
router.set("views", __dirname + "/../Views");
router.set("view engine", "handlebars");

router.get('/', async (req, res) => { res.render('chat', {}) });

router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const {limit, page, sort, query, stock} = req.query;
        const data = await productMngr.getProductsByFilters(limit, page, sort, query, stock);
        res.render('products', {
            products: data.docs, 
            filtros:{
                limit: limit,
                pizza: query === 'pizza' ? true : false,
                empanada: query === 'empanada' ? true : false,
                asc: sort == 'asc' ? true : false,
                desc: sort == 'desc' ? true : false,
                aplicaStock : stock === 'aplica' ? true: false,
                noAplicaStock: stock === 'noAplica' ? true: false
            },
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            prevLink: data.hasPrevPage ? `http://localhost:8080/views/products?limit=${data.limit}&page=${data.prevPage}&sort=${sort}&query=${query}&stock=${stock}` : null,
            nextLink: data.hasNextPage ? `http://localhost:8080/views/products?limit=${data.limit}&page=${data.nextPage}&sort=${sort}&query=${query}&stock=${stock}` : null
        });
    } catch (error) {
        res.send({result: "Error: " + error.message});
    }
})

router.get('/carts/:cid', isAuthenticated, async (req,res) => {
    try {
        const cart = await cartMngr.getCartById(req.params.cid);
        const products = cart.products;
        res.render('cart', {products: products, lenght: true});
    } catch (error) {
        res.send({result: "Error: " + error.message});
    }
})

router.get('/login', isNotAuthenticated, (req, res) => { res.render('login') } );

router.get('/register', isNotAuthenticated, (req, res) => { res.render('register') } );

/*
router.post('/message', async (req, res) => {
    try {
        if(req.body.message.trim() !== '' && req.body.message){
            //await messageModel.create();
            console.log(req.body.message);
            res.redirect('')
        }
        else{
            res.send("El mensaje es incorrecto");
        }
    } catch (error) {
        res.send("Error: no se pudo enviar el mensaje a la base de datos. " + error.message);
    }
})

router.post('/userChat', async (req, res) => {
    try {
        console.log(req.body.user);
    } catch (error) {
        res.send("Error: no se pudo enviar el mensaje a la base de datos. " + error.message);
    }
})
*/
module.exports = router;
