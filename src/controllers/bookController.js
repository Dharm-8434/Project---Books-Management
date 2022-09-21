const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel")


// const createBook = async function (req,res){
//     try{
     
//     }
//     catch{

//     }
// }


const getBookById = async function(req,res){
    try{
         const data= req.param;
         console.log(data)
    }
    catch(err){
       return res.status(500).send({status:false,message:err})
    }
}


module.exports.getBookById = getBookById