const { Products } = require('../models/bentaModel');

const loadProducts = async (req, res, next) => {

    const sold = (req.query && req.query.type === "sold") ? 1 : 0
    try {
        const products = await Products.find({
            sellerID: req.session.sellerID,
            sold: sold
        });
        
        req.products = products
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = loadProducts