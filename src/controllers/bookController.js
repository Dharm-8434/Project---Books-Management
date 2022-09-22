const userModel = require("../models/userModel")
const express=require('express')
const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel")
//const mongoose = require("mongoose")



// const isValiduserId = (userId) => {
//   return mongoose.Types.userId.isValid(userId)
// }
// const stringChecking = function (data) {
//   if (typeof data !== 'string') {
//       return false;
//   } else if (typeof data === 'string' && data.trim().length == 0) {
//       return false;
//   } else {
//       return true;
//   }
// }

// const arrayOfStringChecking = function (data) {
//   for (let i = 0; i < data.length; i++) {
//       if (typeof data[i] !== 'string') {
//           return false;
//       } else if (typeof data[i] === 'string' && data[i].trim().length == 0) {
//           return false;
//       } else {
//           return true;
//       }
//   }
// }



const createBook = async function (req, res) {
  try {
    let data = req.body
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt ,reviews} = data;

    if (Object.keys(data).length == 0) return res.send("Data is mandatory to create Book");




    // title validation
    if (!title) {
      return res.status(400)
        .send({ status: false, message: "name is missing" })
    }
    data.title = data.title.trim()
    if (title.length !== 0) {
      if (!/^[a-zA-Z_ ]+$/.test(title)) {return res.status(400).send({ status: false, message: "title is not valid " })
      }
    }
    const duplicatetitle = await bookModel.findOne({ title: data.title });
    if (duplicatetitle) {
      return res.status(400)
        .send({ status: false, msg: "title is all ready exist" });
    }

    //if (!name) return res.status(400).send({ status: false, msg: "Enter your name" }
    //   //excerpt validation
    if (!excerpt){ return res.status(400).send({ status: false, message: "excerpt is mandatory" })
  }
      data.excerpt = excerpt.trim()
      if (excerpt.length == 0) return res.status(400).send({ status: false, message: "excerpt is empty" });
    

      //ISBN Validation

      if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory" });

      data.ISBN = ISBN.trim()
      if (ISBN.length == 0) return res.status(400).send({ status: false, msg: "ISBN is empty" });
      if(!(/^[0-9]{13}$/).test(data.ISBN)){
        return res.status(400).send({status:false,msg:"ISBN  is invalid must be of 13 digits"})
    }
      //if (!.test(ISBN)) return res.status(400).send({ status: false, message: "ISBN is not valid " })
      let ISBNCheck = await bookModel.findOne({ ISBN: ISBN });
      if (ISBNCheck) return res.status(400).send({ status: false, msg: "This ISBN Number is already used" })
      

      // category validation
      if (!category) return res.status(400).send({ status: false, msg: "category is mandatory" });
      data.category = category.trim()
      if (category.length == 0) return res.status(400).send({ status: false, msg: "category is empty" });

      // subcategory validation
      if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is mandatory" });
      data.subcategory = subcategory.trim()
      if (subcategory.length == 0) return res.status(400).send({ status: false, msg: "subcategory is empty" });

      // releaseat validation
      if (!releasedAt) return res.status(400).send({ status: false, msg: "releasedAt is mandatory" });
      data.releasedAt = releasedAt.trim()
      if (releasedAt.length == 0) return res.status(400).send({ status: false, msg: "releasedAt is empty" });


      //Create bookData

      let saveData = await bookModel.create(data)
      res.status(201).send({ status: true,msg:'Sucess', data: data })

  } catch (error) {
      res.status(500).send({ status: false, msg: error.message })

  }
}



///getblogs

//const getUser = async function (req, res) {
    // try {
    //   let data = req.body.query
    //   if(data.length==0){
    //     return res.status(400).send({status:false,msg:"please provide inputs"})
    //   }
    //   req.query.isDeleted = false
    //   let collectionofBook = await bookModel.find(req.query)
    //   if (collectionofBook.length < 1) {
    //     return res.status(404).send({ status: false, msg: "not user found" })
    //   }
    //   return res.status(200).send({ status: true, massage: 'Book list', data: collectionofBook })
    // } catch (error) {
    //   return res.status(500).send({ status: false, msg: error })
    // }

  //   try {
  //     let bodyData = req.query

  //     if (Object.keys(bodyData).length == 0) {
  //         let getData = await bookModel.find({ isDeleted: false, isPublished: true })
  //         if (getData.length <= 0) {
  //             return res.status(200).send({ status: true, count: getData.length, data: getData })
  //         }
  //     }
  //     else {
  //         let { subcategory, category,  userId } = bodyData
  //         let filter = {}
  //         if (subcategory) {
  //             if (!arrayOfStringChecking(subcategory)) {
  //                 return res.status(404).send({ status: false, msg: "subcategory must be present and have Non empty string " })
  //             }
  //             filter.subcategory = subcategory
  //         }
          
  //         if (category) {
  //             if (!stringChecking(category)) {
  //                 return res.status(404).send({ status: false, msg: "tags must be present and have Non empty string " })
  //             }
  //             filter.category = category
        
  //         //let USERid = await bookModel.find(userId)
  //         // if (userId) {
  //         //     if(userId !=USERid ){
  //         //      return res.status(400).send({status:false,msg:"userid must be persent"})
  //         //     }
  //         //     filter.userId = userId
  //         // }
  //         filter.isDeleted = false
  //         filter.isPublished = true
  //         if (subcategory || category ||  userId ) {
  //             let getDataByFilter = await bookModel.find(filter)
  //             return res.status(200).send({ status: true, count: getDataByFilter.length, data: getDataByFilter })
  //         }
  //         else {
  //             return res.status(400).send({ status: false, msg: "Filters can be subcategory,category,tags,authorId, title or body only " })
  //         }

  //       }
  //     }
  //   }
  // catch (err) {
  //     res.status(500).send({ status: false, error: err.message })
  // }
    
  //     }



  // const getBookById = async function(req,res){
  //     try{
  //          const data= req.param;
  //          console.log(data)
  //     }
  //     catch(err){
  //        return res.status(500).send({status:false,message:err})
  //     }
  // }

  module.exports.createBook = createBook

  //module.exports.getUser = getUser
//module.exports.getBookById = getBookById
