const express = require('express');
 const UserControllers = require('../controllers/UserController')
 const BookControllers = require('../controllers/bookController')
 const MiddleWare = require('../middleware/auth');
const router = express.Router();



//---------------------------Post(createUser)----------------------------------//
router.post("/register",UserControllers.createUser)

//---------------------------Post(loginUser)----------------------------------//
router.post("/login",UserControllers.loginUser)

//---------------------------Post(createBook)----------------------------------//
router.post("/books",MiddleWare.authentication,BookControllers.createBook)

//---------------------------get(getBook)--------------------------------------//
//router.get("/books",MiddleWare.authentication,BookControllers.getUser)


//--------------------------get by Id----------------------------------------//
//router.post("/books/bookId",BookControllers.getBookById)
//----------------------------THIS is wrong route handler---------------------//
router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "Invalid path params" });
  });


module.exports = router;