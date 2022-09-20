const express = require('express');
 const UserControllers = require('../controllers/UserController')
const router = express.Router();



//---------------------------Post(createUser)----------------------------------//
router.post("/register",UserControllers.createUser)

//---------------------------Post(loginUser)----------------------------------//
router.post("/login",UserControllers.loginUser)

// router.all("/*", function (req, res) {
//     res.status(400).send({ status: false, message: "Invalid path params" });
//   });


module.exports = router;