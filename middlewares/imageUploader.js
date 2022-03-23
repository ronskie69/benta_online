const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: ( req, file, cb) => {
        cb(null, 'public/uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null,  Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/webp"){
        return cb(null, true);
    } else {
        return cb(new Error("Only images allowed!"));
    }
}

const uploader = multer({ storage: storage })

module.exports = uploader