module.exports = (req, res, next) => {

    console.log(req.session)
    if(req.session.isAuth &&
        req.session.sellerID &&
        req.session.username){
        res.redirect('/benta/dashboard')
        return
    }
    next()
}