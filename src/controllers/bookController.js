const userModel = require("../models/userModel")
const express=require('express')
const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel")


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
      res.status(201).send({ status: true,msg:'Sucess', data: saveData })

  } catch (error) {
      res.status(500).send({ status: false, msg: error.message })

  }
}
 //-----------------------getBook---------------------//
 const getBook = async function(req,res){
try{
let data = req.query;

if(Object.keys(data).length==0){
  return res.status(400).send({status:false,msg:"Apply filter"})
}
let {userId,category,subcategory}=data
let filter = {};
if(data.subcategory){
filter.subcategory = data.subcategory;
}
if(data.category){
filter.category = data.category;
}
if(data.userId){
filter.userId = data.userId;
}

if (subcategory || category ||  userId ) {
  let getData = await bookModel.find(filter)
  
  return res.status(200).send({ status: true,data: getData })

 }

}
catch(err){
return res.status(500).send({status:false,msg:err})
}

 }


 //--------------------DeleteBook---------------//

 const deleteBook = async function (req, res) {

  // let data=req.body

  try {
    let myData = await bookModel.findOneAndUpdate({ _id: req.params.bookId },{ isDeleted: true, deletedAt: Date() },{ new: true });
    return res.status(200).send({status:true,msg:myData});
  if(!myData){
    return res.send(400).send({status:true,msg:"nahi huaa bhai"})
  }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message, });
  }
}


  module.exports.createBook = createBook
  module.exports.getBook = getBook
  module.exports.deleteBook=deleteBook
