const cartModel = require('../Models/cart.model.js');
const ProductManager = require('../Classes/productManagerDB.js');
const productMgr = new ProductManager();

class CartManagerDB{
    async getCartById(id){
        const cart = await cartModel.findById(id);
        return cart;
    };

    async addCart(){ await cartModel.create({}) };

    async getCarts(){ return await cartModel.find({}) };

    async getCartById(id){ return await cartModel.findById(id) };

    async addProduct(cid, pid){ 
        const product = await productMgr.getProductById(pid);
        if(product){
            const cart = await cartModel.findById(cid);
            const inCartProduct = cart.products.find(element => element.pid === pid);

            if(inCartProduct){ 
                inCartProduct.quantity += 1;
                await cartModel.updateOne(
                    { _id: cid, "products.pid": pid },
                    { $set: { "products.$.quantity" :  inCartProduct.quantity} }
                );
            }
            else{
                await cartModel.updateOne(
                    { _id: cid },
                    { $push: {products: { pid: pid, quantity: 1 } } }
                );
            }
        }
        else{ throw Error("El producto especificado no existe en la base de datos") }
    };
}

module.exports = CartManagerDB;