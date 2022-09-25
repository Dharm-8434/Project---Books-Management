const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController  = require("../controllers/reviewController")
const middleware = require("../middleware/auth")

//User Apis
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

//Books Apis
router.post("/books",middleware.authentication,middleware.authorisation,bookController.createBook)
//router.post("/images",middleware.authentication,bookController.imageUpload)
router.get("/books",middleware.authentication,bookController.getBooks)
router.get("/books/:bookId",middleware.authentication,bookController.getBookById)
//router.put("/books/:bookId",middleware.authentication,middleware.authoriseByQuery,bookController.updateBook)
//router.delete("/books/:bookId",middleware.authentication,middleware.authoriseByQuery,bookController.deleteById)

//Review Apis
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)


router.all("/****",function(req,res){
    res.status(404).send({status:false, msg:"API Url is wrong , correct it"})
} )
module.exports = router


