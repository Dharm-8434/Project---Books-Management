const express = require('express');
 const UserControllers = require('../controllers/UserController')
 const BookControllers = require('../controllers/bookController')
const router = express.Router();



//---------------------------Post(createUser)----------------------------------//
router.post("/register",UserControllers.createUser)

//---------------------------Post(loginUser)----------------------------------//
router.post("/login",UserControllers.loginUser)
router.post("/books",BookControllers.createBook)
// router.all("/*", function (req, res) {
//     res.status(400).send({ status: false, message: "Invalid path params" });
//   });


module.exports = router;