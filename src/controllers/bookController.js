const userModel = require("../models/userModel")
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
      res.status(201).send({ status: true,msg:'Sucess', data: data })

  } catch (error) {
      res.status(500).send({ status: false, msg: error.message })

  }
}



///getblogs

const getUser = async function (req, res) {
    try {
      let data = req.body
      req.query.isDeleted = false
      let collectionofBook = await bookModel.find(req.query)
      if (collectionofBook.length < 1) {
        return res.status(404).send({ status: false, msg: "not user found" })
      }
      return res.status(200).send({ status: true, massage: 'Book list', data: collectionofBook })
    } catch (error) {
      return res.status(500).send({ status: false, msg: error })
    }
  }



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

  module.exports.getUser = getUser
//module.exports.getBookById = getBookById