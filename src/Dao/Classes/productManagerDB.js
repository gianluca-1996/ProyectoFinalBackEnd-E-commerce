const productModel = require('../Models/product.model.js');

class ProductManagerDB{
    async addProduct(code, title, description, price, thumbnail, stock, category){
        await productModel.create({
            code: code,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            stock: stock,
            category: category
        })
    };

    async getProducts(){
        const products = await productModel.find({}).lean();
        return products;
    };

    async getProductById(id){return await productModel.findById(id)};

    async updateProduct(id, obj = null, campo, valor){
        switch (campo) {
            case "title":
                await productModel.updateOne({_id: id}, {$set: {title: valor}});
                break;
      
            case "description":
                await productModel.updateOne({_id: id}, {$set: {description: valor}});
                break;
      
            case "price":
                await productModel.updateOne({_id: id}, {$set: {price: valor}});
                break;
      
            case "thumbnail":
                await productModel.updateOne({_id: id}, {$set: {thumbnail: valor}});
                break;
      
            case "code":
                await productModel.updateOne({_id: id}, {$set: {code: valor}});
                break;
      
            case "stock":
                await productModel.updateOne({_id: id}, {$set: {stock: valor}});
                break;

            case "category":
                await productModel.updateOne({_id: id}, {$set: {category: valor}});
                break;
      
            case undefined:
                await productModel.replaceOne({_id: id}, {...obj});
                break;
        }
    }

    async deleteProduct(id){await productModel.deleteOne({_id: id})};
}

module.exports = ProductManagerDB;