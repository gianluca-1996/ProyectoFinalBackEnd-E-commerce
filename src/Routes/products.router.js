const uploader = require("../utils.js");
const Router = require("express");
const router = Router();
/*
const ProductManager = require("../Dao/Classes/productManager.js");
const productMngr = new ProductManager("./productos.json");
*/
const ProductManagerDB = require("../Dao/Classes/productManagerDB.js");
const productMngr = new ProductManagerDB();
const handlebars = require("express-handlebars");
router.engine("handlebars", handlebars.engine());
router.set("views", __dirname + "/../Views");
router.set("view engine", "handlebars");

/*
//FILESYSTEM
router.get('/realTimeProducts', async (req, res) => {
    try {
        const productos = await productMngr.getProducts();
        res.render('home', {productos, length : productos.length > 0 ? true : false});
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });   
    }
})

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products = await productMngr.getProducts();
        if(!isNaN(limit) && limit > 0){
            products = products.slice(0, limit);
            res.status(200).json(products);
        }
        else res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });   
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const producto = await productMngr.getProductById(pid);
        res.json(producto);    
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post('/', uploader.single('file'), async (req, res) => {
    try {
        await productMngr.addProduct(req.body.code, req.body.title, req.body.description, req.body.price, (req.file ? [req.file.filename] : []), req.body.stock, req.body.category);
        res.send("Producto agregado con exito...");
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.put('/:pid', async (req, res) => {
    try {
        await productMngr.updateProduct( parseInt(req.params.pid), req.body.obj, req.body.campo, req.body.valor);
        res.send("Producto actualizado con exito...");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        await productMngr.deleteProduct(parseInt(req.params.pid));
        res.send("Producto eliminado con exito...");
    } catch (error) {
        res.status(500).send(error.message);
    }
})
*/

router.get('/', async (req, res) => {
    try {
        const products = await productMngr.getProducts();
        res.send({result: 'Success', payload: products});
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try {
        const productos = new Array(...await productMngr.getProducts());
        res.render('home', {productos, length : productos.length > 0 ? true : false});
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const product = await productMngr.getProductById(req.params.pid);
        res.send({result: 'success', payload: product});
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})

router.post('/', uploader.single('file'), async (req, res) => {
    try {
        const {code, title, description, price, stock, category} = req.body;
        const thumbnail = req.file ? [req.file.filename] : []; 
        await productMngr.addProduct(code, title, description, parseFloat(price), thumbnail, parseInt(stock), category);
        res.send({result: 'success'});
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})

router.put('/:pid', async (req, res) => {
    try {
        await productMngr.updateProduct(req.params.pid, req.body.obj, req.body.campo, req.body.valor);
        res.send({result: 'success'});
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        await productMngr.deleteProduct(req.params.pid);
        res.send({result: 'success'});
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})

module.exports = router;