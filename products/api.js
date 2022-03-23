const app = require('express').Router();
const { Products} = require('../models/bentaModel')
const uploader = require('../middlewares/imageUploader')
const fs = require('fs');
const path = require('path');

app.post('/upload', uploader.single('image'), async(req, res) => {
    
    const { title, seller, sellerID, location, contact_number, tags, price } = req.body
    console.log(req.file)

    const product = new Products({
        sellerID: sellerID,
        id: Date.now(),
        title,
        seller,
        contact: contact_number,
        price,
        location,
        tags,
        sold: 0,
        image: {
            data: fs.readFileSync("public/uploads/images/" + req.file.filename),
            contentType: req.file.mimetype
        }
    })
    try {
        await product.save()
        res.status(201).send("Product uploaded!");
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/update-product', async (req, res) => {
    console.log(req.body)
    const { title, seller, sellerID, location, contact, price, id } = req.body

    const product = await Products.findOne({ id: id, sellerID: sellerID })
    console.log(product.title)
    if(!product) return res.status(500).send("Unknown Error! Sorry...");

    product.seller = seller
    product.contact = contact
    product.title = title
    product.location = location
    product.price = price

    try {
        await product.save()
        res.status(201).send("Product updated!");
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/remove-product', async (req, res) => {
    const { product_id, seller_id } = req.body

    try {
        await Products.findOneAndRemove({ id: product_id, sellerID: seller_id })
        res.status(200).send("Product successfully removed!");
    } catch(err){
        res.status(404).send("Product not found!");
    }

});

app.post('/sold-product', async (req, res) => {
    const { product_id, seller_id } = req.body

    const product = await Products.findOne({ id: product_id, sellerID: seller_id })
    
    if(!product) return res.status(500).send("Couldn't process your request. Try again later.");

    product.sold = 1;

    try {
        await product.save()
        res.status(200).send("Product successfully sold!");
    } catch(err){
        res.status(404).send("Product not found!");
    }

});

app.post('/clear-all-sold', async (req, res) => {
    try {
        await Products.deleteMany({ sold: 1, sellerID: req.body.sellerID });
        res.status(200).send("Success deleting all items!");
    } catch(err) {
        res.status(404).send("No products found!");
    }
})


module.exports = app