const express = require('express');
 const userModel = require('../models/userModel');
 const UserControllers = require('../controllers/UserController')
const router = express.Router();
router.post("/register",UserControllers.createUser)
router.get('hello', function(req,res){
    res.send("my first api")
})

router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "Invalid path params" });
  });


module.exports = router;