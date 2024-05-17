const Router = require("express");
const router = Router();
const handlebars = require("express-handlebars");
router.engine("handlebars", handlebars.engine());
router.set("views", __dirname + "/../Views");
router.set("view engine", "handlebars");

router.get('/', async (req, res) => { res.render('chat', {}); })

/*
router.post('/message', async (req, res) => {
    try {
        if(req.body.message.trim() !== '' && req.body.message){
            //await messageModel.create();
            console.log(req.body.message);
            res.redirect('')
        }
        else{
            res.send("El mensaje es incorrecto");
        }
    } catch (error) {
        res.send("Error: no se pudo enviar el mensaje a la base de datos. " + error.message);
    }
})

router.post('/userChat', async (req, res) => {
    try {
        console.log(req.body.user);
    } catch (error) {
        res.send("Error: no se pudo enviar el mensaje a la base de datos. " + error.message);
    }
})
*/
module.exports = router;
