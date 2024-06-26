const Router = require('express')
const router = Router();
const CartManagerDB = require('../Dao/Classes/cartManagerDB.js');
const cartMngr = new CartManagerDB();
const ProductManagerDB = require('../Dao/Classes/productManagerDB.js');
const prodMngr = new ProductManagerDB();
/*const ProductManager = require('../Dao/Classes/productManager.js');
const cartMngr = new CartManager('./carritos.json');
const productMngr = new ProductManager('./productos.json');


//FILESYSTEM
router.post('/', async (req, res) => {
    try {
        await cartMngr.addCart();
        res.send("Carrito creado con exito...");
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        if(!isNaN(cid) && cid > 0){
            const productos = await cartMngr.getCartByCid(cid);
            res.json(productos);
        }
        else throw Error("El id ingresado es incorrecto");
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const producto = await productMngr.getProductById(req.params.pid);
        if(producto){
            await cartMngr.addProduct(parseInt(req.params.cid), parseInt(req.params.pid));
            res.send("Producto agregado con exito");
        }
        else throw Error("El id del producto ingresado no existe");
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})
*/

router.get('/', async (req, res) => {
    try {
        const carts = await cartMngr.getCarts();
        res.send({result: "success", payload: carts});
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartMngr.getCartById(req.params.cid);
        res.send({result: "success", payload: cart});
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

router.post('/', async (req, res) => {
    try {
        await cartMngr.addCart();
        res.send({result: "success"});
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;
    try {
        await cartMngr.addProduct(cid, pid);
        res.send({result: 'success'});
    } catch (error) {
        res.send({error: "ERROR: " + error.message});
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params;
        cartMngr.deleteProduct(cid, pid);
        res.send( { result: "success" } );
    } catch (error) {
        res.send( { result: "Error: " + error.message} );
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        await cartMngr.deleteAllProducts(req.params.cid);
        res.send( { result: "Success" } );
    } catch (error) {
        res.send( { result: "Error: " + error.message} );
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const quantity = parseInt(req.body.quantity);
        const {cid, pid} = req.params;
        await cartMngr.updateProduct(cid, pid, quantity);
        res.send({ result: "Success"});
    } catch (error) {
        res.send({ result: "Error: " + error.message});
    }
})

module.exports = router;