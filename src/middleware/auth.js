let jwt = require("jsonwebtoken");
const usermodel = require("../models/userModel");
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")

// Authentication:->>>====================================================================>>>

const authentication = async function (req, res, next) {
  try {
    // check token :
    let token = req.headers["x-api-key"];
    // if (!token)
    //  req.headers["x-api-key"];
    if (!token)
      return res.status(401).send({ status: false, msg: "-----Token Must be Filled---->" });
    
    // verify token :
    let decodedToken = jwt.verify(token, "project3");
    if (!decodedToken)
      return res.status(400).send({status: false,msg: "Token Not Verified Please Enter Valid Token"});

    req.token = decodedToken;

    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Authorization:->>>=======================================================================>>>

 const authorization = async function (req, res, next) {
  try {
    let userLoggedIn = req.token.userId;     //successful tokens userid 
    //let bookId = req.params.bookId;
    let checkBookId = await bookModel.findById(userId)
    if (!checkBookId) {
      return res.status(404).send({status: false, message: "-----Sorry, no book found----->"})
  }
    if (checkBookId.userId != userLoggedIn) {
      return res.status(403).send({status: false,msg: "loggedin author not allowed to modify changes"});
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.messge });
  }
};
//================================================================
const authoriseByQuery = async function (req, res, next) {
  try {
      let userLoggedIn = req.token.userId    //Accessing userId from attribute

      let conditions = req.query
      //Checks if condition for deletion is coming or not
      if (Object.keys(conditions).length == 0) {
          return res.status(400).send({status: false,msg: "Provide information for deletion"})
      }
      if (conditions.userId) {
          if (!conditions.userId.match(/^[0-9a-f]{24}$/)) {   //regex for id format check
              return res.status(400).send({status: false,msg: "Not a valid ObjectId"})
          }

          if (conditions.userId != userLoggedIn) {
              return res.status(403).send({status: false,msg: 'user not authorised'})
          }
      }
      let userAccessing = await bookModel.find({ $and: [conditions, { isDeleted: false }] })
     
      if (userAccessing.length == 0) {
          return res.status(404).send({status: false,msg: "No Books Found" })
      }

      let accessedBook= userAccessing.filter(books => books.userId == userLoggedIn)
      
      if (accessedBook.length == 0) {
          return res.status(403).send({status: false,msg: "User Not Authorised"})
      }
      req.id = userLoggedIn //attribute to store the author id from token
      next()
  }
  catch (err) {
      console.log("this error is from authorisation by query", err.message)
      res.status(500).send({ msg: err.message })
  }
}
//============================================================================================

module.exports.authentication = authentication;
module.exports.authorization = authorization;
module.exports.authoriseByQuery = authoriseByQuery;