const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel")





const createBook = async function (req,res){
    try {
        let data = req.body
        let { title, excerpt, userId,ISBN, category, subcategory, releasedAt } = data;

        if (Object.keys(data).length == 0) return res.send("Data is mandatory to create Book");


        // title validation
      if (!title) return res.status(400).send({ status: false, message: "title is mandatory" });
      title = title.trim()
      if(title.length==0)return res.status(400).send({ status: false, message: "title is empty" });
      if(!(/^[a-zA-Z\. ]*$/).test(title)) return res.send({status:false,message:"title is not valid"});

    //   //excerpt validation
        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is mandatory" });
        excerpt = excerpt.trim()
        if(excerpt.length==0)return res.status(400).send({ status: false, message: "excerpt is empty" });
       
        //ISBN Validation

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory" });
        ISBN=ISBN.trim()
        if(ISBN.length==0)return res.status(400).send({ status: false, msg: "ISBN is empty" });
        let ISBNCheck = await bookModel.findOne({ ISBN: ISBN });
        if (ISBNCheck) return res.status(400).send({ status: false, msg: "This ISBN Number is already used" })   
    
    // category validation
    if (!category) return res.status(400).send({ status: false, msg: "category is mandatory" });
    category = category.trim()
    if(category.length==0)return res.status(400).send({ status: false, msg: "category is empty" });

     // subcategory validation
     if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is mandatory" });
     subcategory = subcategory.trim()
     if(subcategory.length==0)return res.status(400).send({ status: false, msg: "subcategory is empty" });

// releaseat validation
if (!releasedAt) return res.status(400).send({ status: false, msg: "releasedAt is mandatory" });
releasedAt= releasedAt.trim()
if(releasedAt.length==0)return res.status(400).send({ status: false, msg: "releasedAt is empty" });


    // Create bookData

    let createData = await bookModel.create(data);
    res.status(201).send({ status: true, massage:"sucessfully",data:createData });   
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

}




///getblogs

const getUser = async function (req, res) {
  try {
    let data = req.body
    req.query.isDeleted = false
    let collectionofBook = await bookModel.find(req.query)
    if (collectionofBook.length < 1) {
      return res.status(404).send({status: false,msg: "not user found"})
    }
    return res.status(200).send({status: true,massage:'Book list',data: collectionofBook})
  } catch (error) {return res.status(500).send({status: false,msg: error})
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

module.exports.createBook=createBook

module.exports.getUser=getUser
//module.exports.getBookById = getBookById