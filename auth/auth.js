const app = require('express').Router()
const { Accounts} = require('../models/bentaModel')
const bcrypt = require('bcrypt')

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    
    const user = await Accounts.findOne({ username });
    if(user) return res.status(401).send("Username is already taken. Please try another one.")
    const hashed = await bcrypt.hash(password, 10);

    const newAccount = new Accounts({
        id: Date.now(), username, password: hashed
    });
    try {
        await newAccount.save()
        return res.send("Success!")
    } catch(err){
        console.log(err)
        return res.send(err)
    }
})

app.post('/login', async (req, res) => {
    
    const { username, password } = req.body
    session = req.session

    try {
        const user = await Accounts.findOne({ username});
        if(!user) return res.status(404).send("Username/password not found!");
        
        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(401).send("Failed to login!")
        
        session.isAuth = true
        session.username = user.username
        session.sellerID = user.id

        console.log(req.session)

        res.status(200).send("Login success!")


    } catch(err){
        console.log(err)
        return res.status(500).send("Unknown error! Please try again later.")
    }
})

app.post('/change-password', async (req, res) => {
    const { username, old_password, new_password } = req.body

    console.log(req.body)
    Accounts.findOne({ username: username }, (err, user) => {
        if(err) return res.status(500).send("Unknown Error!");
        if(!user) return res.status(404).send("User not found!");

        console.log(user)
        bcrypt.compare(old_password,user.password, (err, matched) => {
            if(err) {
                console.log(err)
                return res.status(500).send(err);
            }
            if(!matched) return res.status(401).send("Old password not matched!");

            if(bcrypt.compareSync(new_password, user.password)){
                return res.status(500).send("New password must not be your old password!");
            }
            bcrypt.hash(new_password, 10, (err, hashed) => {
                if(err) return res.status(500).send("Unknown Error!");

                user.password = hashed

                user.save();
                res.status(201).send("Password Successfully changed!");
            })
        });
    })
})

app.get('/logout', async (req, res) => {
    req.session.destroy()
    res.status(200).send("Logout success")
})

module.exports = app