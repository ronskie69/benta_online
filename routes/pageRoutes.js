const app = require('express').Router()
const navRoutes = require('../navRoutes')
const { Products} = require('../models/bentaModel');
const loadProducts = require('../middlewares/loadProducts');
const tags = require('../tags')

let session;

app.get('/dashboard', loadProducts,(req, res) => {

    if(!req.session.username || !req.session.isAuth || !req.session.sellerID) {
        return res.redirect('../login')
    }

    let type = req.query.type ? req.query.type.toLocaleLowerCase() : 'profile' 
    
    session = req.session

    res.render('pages/dashboard',{
        dashboard: type,
        sellerID: session.sellerID,
        tags: tags,
        username: session.username,
        active: type,
        products: req.products
    })
})

module.exports = app