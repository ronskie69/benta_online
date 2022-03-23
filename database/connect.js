const mongoose = require('mongoose');
const DB = process.env.DB

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err) => {
            if(err) {
                return reject("Failed to connect to server...\n" + err);
            }
            return resolve();
        })
    })
}

module.exports = connect