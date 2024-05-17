const mongoose = require('mongoose');
const productCollection = 'product';
const productSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: Array, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true}
})

const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;