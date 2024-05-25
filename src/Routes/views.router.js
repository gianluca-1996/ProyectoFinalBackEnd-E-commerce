const Router = require("express");
const router = Router();
const handlebars = require("express-handlebars");
const ProductManagerDB = require("../Dao/Classes/productManagerDB.js");
const productMngr = new ProductManagerDB();
router.engine("handlebars", handlebars.engine());
router.set("views", __dirname + "/../Views");
router.set("view engine", "handlebars");

router.get('/', async (req, res) => { res.render('chat', {}) });

router.get('/products', async (req, res) => {
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
