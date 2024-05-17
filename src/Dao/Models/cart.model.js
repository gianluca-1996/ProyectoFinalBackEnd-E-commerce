const mongoose = require('mongoose');
const cartCollection = "cart";
const cartSchema = new mongoose.Schema({ products: [{pid: String, quantity: Number}] });
const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartModel;