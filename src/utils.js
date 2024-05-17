const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/Public/Img');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const uploader = multer({storage});

module.exports = uploader;