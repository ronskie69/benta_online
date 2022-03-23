const express = require('express');
const path = require('path');
require('dotenv').config()
const app = express()
const connect = require('./database/connect')
const cors = require('cors')
const session = require('express-session')
const drinkCoffee = require('cookie-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.enable('trust proxy')
app.set('trust proxy', 1)

app.use(drinkCoffee())
app.use(session({
    name: 'nogsuu',
    resave: true,
    saveUninitialized: true,
    proxy: true,
    unset: 'destroy',
    secret: process.env.SECRET || "nogsuu",
    cookie: {
        maxAge: 1000*60 *60 * 48,
        secure: (process.env.NODE_ENV && process.env.NODE_ENV === "production") ? true : false,
    }
}))



//routes, ports
const pageRoutes = require('./routes/pageRoutes')
const navRoutes = require('./navRoutes')
const auth = require('./auth/auth')
const api = require('./products/api');

const { Products } = require('./models/bentaModel');
const checkAuth = require('./middlewares/auth')
app.use('/benta', pageRoutes)
app.use('/api', api)
app.use('/auth', auth)

app.get('/', (req, res) => {

    Products.find({})
            .limit(8)
            .exec()
            .then(products => {
                res.render('index', {
                    nav: req.session.isAuth ? navRoutes.auth : navRoutes.default,
                    products: products && products.length > 0 ? products: []
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).send("<h1>Unknown Error</h1>")
            })
});

app.get('/login', checkAuth, (req, res) => {
    
    res.render('pages/forms', {
        nav: navRoutes.default,
        type: 'Login'
    })
})
app.get('/register', checkAuth, (req, res) => {
    
    res.render('pages/forms', {
        nav: navRoutes.default,
        type: 'Register'
    })
})

app.get('/products', (req, res) => {

    const tag = req.query.tag ? req.query.tag.toLowerCase() : false

    Products.find({}, async (err, data) => {
        
        const tagMatch = data.filter(product => product.tags.includes(tag))
        
        res.render('pages/productSection', {
            nav: req.session.isAuth ? navRoutes.auth : navRoutes.default,
            products: tag ? tagMatch : data
        })
    })
})

const port = 3000 || process.env.PORT

connect().then(() => {
    app.listen(port, () => {
        console.log("server listening to port: ", port)
    })
}).catch(err => {
    console.log(err)
})
