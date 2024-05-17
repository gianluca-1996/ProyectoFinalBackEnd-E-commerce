const fs = require("fs");

class CartManager{
    #path;

    constructor(path){
        this.#path = path;
    }

    async addCart(){
        const carritos = await this.getCarts();
    
        const cid = carritos.length === 0 ? 1 : carritos[carritos.length - 1].cid + 1;
        carritos.push(
            {cid: cid, products: []}
        );
    
        await fs.promises.writeFile(this.#path, JSON.stringify(carritos, null, 3));
    }

    async getCarts(){
        let carritos;
        if (fs.existsSync(this.#path)){
            carritos = await fs.promises.readFile(this.#path);
            return JSON.parse(carritos);
        }
        else return [];
    }

    async getCartByCid(cid){
        const carritos = await this.getCarts();
        const carrito = carritos.find((cart) => cart.cid == cid);
        return carrito == undefined ? "Carrito no encontrado" : carrito.products;
    }

    async addProduct(cid, pid){
        const carritos = await this.getCarts();
        const cartIndex = carritos.findIndex(cart => cart.cid === cid);
        
        if(cartIndex === -1) throw new Error("Carrito no encontrado")
        const productoIndex = carritos[cartIndex].products.findIndex(product => product.pid === pid);
        
        if(productoIndex != -1) carritos[cartIndex].products[productoIndex].quantity += 1;
        else carritos[cartIndex].products.push({pid: pid, quantity: 1});
        
        fs.promises.writeFile(this.#path, JSON.stringify(carritos, null, 3));
    }
}

module.exports = CartManager;