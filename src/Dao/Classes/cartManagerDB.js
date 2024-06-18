const cartModel = require('../Models/cart.model.js');
const ProductManager = require('../Classes/productManagerDB.js');
const productMgr = new ProductManager();

class CartManagerDB{
    /*async getCartById(id){
        const cart = await cartModel.findById(id).lean();
        return cart;
    };*/

    async addCart(session){ 
        const cart = new cartModel({});
        await cart.save(session && { session: session });
        return cart;
        
    };//{ await cartModel.create({}) };

    async getCarts(){ return await cartModel.find() };

    async getCartById(id){ return await cartModel.findById(id).lean().populate('products.pid') };

    async addProduct(cid, pid){ 
        const product = await productMgr.getProductById(pid);
        if(product){
            if(product.stock === 0){
                throw Error("El producto especificado no posee stock");
            }
            const cart = await cartModel.findById(cid);
            const inCartProduct = cart.products.find(element => element.pid == pid);

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

            await productMgr.updateProduct(pid, null, 'stock', product.stock - 1);
        }
        else{ throw Error("El producto especificado no existe en la base de datos") }
    };

    async deleteProduct(cid, pid){ await cartModel.updateOne( { _id: cid }, { $pull: { products: {pid: pid} } } ) };

    async updateProduct(cid, pid, quantity){
        if(quantity < 0 || !quantity) throw Error("quantity no contiene un valor consistente");
        await cartModel.updateOne( { _id: cid, "products.pid": pid }, { $set: {"products.$.quantity": quantity} } );
    }

    async deleteAllProducts(cid){ await cartModel.updateOne( { _id: cid }, { $set: { products: [] } } ) };
}

module.exports = CartManagerDB;