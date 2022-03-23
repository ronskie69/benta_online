const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerID: { type: Number, required: true },
    id: { type: Number, default: Date.now(), required: true},
    title : { type: String, required: true },
    seller: { type: String, required: true },
    contact: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    tags: { type: String, required: true },
    sold: { type: Number, required: true },
    image: { 
        data: Buffer,
        contentType: String
    } 
}, { timestamps: true })

const accountSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    username : { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true })

const Products = mongoose.model('bo_products', productSchema);
const Accounts = mongoose.model('bo_accounts', accountSchema);


module.exports = {
    Products, Accounts
}