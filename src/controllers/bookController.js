const { isValidObjectId, default: mongoose } = require("mongoose");
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel");
const moment = require('moment')
//const aws = require('aws-sdk')

//=================================================AWS COnfig ===============================================================
// aws.config.update({
//   accessKeyId: "AKIAY3L35MCRVFM24Q7U",
//   secretAccessKeyId: "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
//   region: "ap-south-1"
// })

// let uploadFile = async (file) => {
//   return new Promise(function (resolve, reject) {                                     // this function will upload file to aws and return the link
//     let s3 = new aws.S3({ apiVersion: '2006-03-01' });                                     // we will be using the s3 service of aws

//     var uploadParams = {
//       ACL: "public-read",
//       Bucket: "classroom-training-bucket",
//       Key: "abc/" + file.originalname,
//       Body: file.buffer
//     }


//     s3.upload(uploadParams, function (err, data) {
//       if (err) {
//         return reject({ "error": err })
//       }
//       return resolve(data.Location)
//     })

//   })
// }


// //==============================================Uploading Image Here ========================================================
// const imageUpload = async (req, res) => {
//   try {
//     let files = req.files
//     console.log(files)
//     if (files && files.length > 0) {
//       let url = await uploadFile(files[0])
//       res.status(201).send({ msg: "file uploaded succesfully", URLofImage: url })
//     }
//     else {
//       res.status(400).send({ msg: "No file found" })
//     }

//   }
//   catch (err) {
//     res.status(500).send({ msg: err })
//   }
// }

//================================================== Creating Books =====================================================

const createBook = async function (req, res) {
  try {

    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "please enter require data to create Book" })
    }
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

    if (!title) {
      return res.status(400).send({ status: false, msg: "please enter Book title" })
    }
    let checktitle = await bookModel.findOne({ title: title })

    if (checktitle) {
      return res.status(400).send({ status: false, message: "Title Already Exists" })
    }
    // if (!/^[a-zA-Z \s]+$/.test(title)) {
    //     return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in title" })
    // }
    if (!excerpt) {
      return res.status(400).send({ status: false, msg: "please enter excerpt" })
    }
    if (!/^[a-zA-Z \s]+$/.test(excerpt)) {
      return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in excerpt" })
    }
    if (!userId) {
      return res.status(400).send({ status: false, msg: "please enter userId" })
    }
    let user = await userModel.findById({ _id: userId })
    if (!user) {
      return res.status(404).send({ status: false, msg: "No such user exist" })
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: " invalid objectId" })

    }
    if (!ISBN) {
      return res.status(400).send({ status: false, msg: "please enter ISBN" })
    }
    if (!/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)) {
      return res.status(400).send({ status: false, message: 'Please provide a valid ISBN(ISBN should be 13 digit)' })
    }

    let checkISBN = await bookModel.findOne({ ISBN: ISBN })

    if (checkISBN) {
      return res.status(400).send({ status: false, message: "ISBN Already Exists" })
    }

    if (!(category.trim())) {
      return res.status(400).send({ status: false, msg: "please enter category" })
    }
    if (!/^[a-zA-Z \s]+$/.test(category)) {
      return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in Category" })
    }

    if (!(subcategory.trim())) {
      return res.status(400).send({ status: false, msg: "please enter subcategory" })
    }
    if (!/^[a-zA-Z \s]+$/.test(subcategory)) {
      return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in subcategory" })
    }
    if (releasedAt) {
      if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({ status: false, message: "Enter date in YYYY-MM-DD format" });
      releasedAt = new Date().toISOString()
    }
    //Creating Data Here
    if (!releasedAt) {
      let date = Date.now()                                               //getting timestamps value
      releasedAt = moment(date).format('YYYY-MM-DD, hh:mm:ss')        //formatting date
      data['releasedAt'] = releasedAt
    }
    let savedData = await bookModel.create(data)
    return res.status(201).send({ status: true, msg: "success", data: savedData })

  }
  catch (err) {
    return res.status(500).send({ status: false, mag: err.message })
  }
}

//================================================= Get Books Api ========================================================

const getBooks = async (req, res) => {
  try {
    let data = req.query;
    let { userId, category, subcategory } = data;
    let filter = {
      isDeleted: false,
      ...data
    };
    if (userId) {
      if (!isValidObjectId(userId)) {
        res.status(400).send({ status: false, message: "This is not a valid user id" });
      }
      let findById = await bookModel.findOne({ userId });
      if (!findById) {
        res.status(404).send({ status: false, message: "No user have books  with this id " });
      }
    }
    if (category) {
      let findByCategory = await bookModel.findOne({ category: category });
      if (!findByCategory) {
        res.status(404).send({ status: false, message: "No books with this category exist" });
      }
    }
    if (subcategory) {

      let findBySubcategory = await bookModel.findOne({ subcategory: { $in: [subcategory] } });
      if (!findBySubcategory) {
        res.status(404).send({ status: false, message: "No books with this Subcategory exist" });
      }
    }

    let books = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: +1 });
    if (books.length == 0) {
      return res.status(404).send({ status: false, message: "No books found with the given query" });
    }

    res.status(200).send({ status: true, message: "Book lists", data: books });


  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}

//================================================= Get Book By Id =======================================================

const getBookById = async (req, res) => {
  try {
    let id = req.params.bookId;
   

    let bookData = await bookModel.findOne({ _id: id, isDeleted: false }).select({ __v: 0 })
    let reviews = await reviewModel.find({ bookId: id, isDeleted: false }).select({ _id: 0, __v: 0 })
    let result = bookData.toObject()
    result.reviewsData = reviews;

    res.send({ status: true, message: 'Book list', data:result});
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}

//===================================================== Update Books =====================================================

const updateBook = async (req, res) => {
  try {
    let id = req.params.bookId;
    if (!id) return res.status(400).send({ status: false, message: "Please enter a book ID" });

    if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: 'Invalid book id' });

    let bookData = await bookModel.findById(id).select({ ISBN: 0, deletedAt: 0, __v: 0 });

    if (!bookData) return res.status(404).send({ status: false, message: 'No Book exists with that id' });
    if (bookData['isDeleted'] == true) return res.status(400).send({ status: false, message: 'Book has been deleted' });

    let userIdFromBook = bookData.userId.toString();
    if (userIdFromBook !== req.userId) return res.status(403).send({ status: false, message: 'Unauthorized access' });

    let data = req.body;
    let { title, excerpt, ISBN, releasedAt } = data;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "please enter require data to update Book" })
    }

    if (title) {
      if (!/^[a-zA-Z \s]+$/.test(title)) return res.status(400).send({ status: false, message: "Please enter a valid title" });
      let checkTitle = await bookModel.findOne({ title });
      if (checkTitle) return res.status(400).send({ status: false, message: "There is a book with that title exists, please give another title" });
    }

    if (excerpt) {
      if (!/^[a-zA-Z \s]+$/.test(excerpt)) return res.status(400).send({ status: false, message: "Please enter a valid excerpt" });
    }
    if (ISBN) {
      if (!/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)) return res.status(400).send({ status: false, message: "Please enter a valid ISBN number" });
      let checkISBN = await bookModel.findOne({ ISBN });
      if (checkISBN) return res.status(400).send({ status: false, message: "There is a book with that ISBN exists, please give another ISBN" });
    }

    if (releasedAt) {
      if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({ status: false, message: "Enter date in YYYY-MM-DD format" });
    }


    let fieldsToUpdate = {};
      fieldsToUpdate.title = title,
      fieldsToUpdate.excerpt = excerpt,
      fieldsToUpdate.releasedAt= releasedAt,
      fieldsToUpdate.ISBN= ISBN
    ;

    let updateBook = await bookModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...fieldsToUpdate } },
      { new: true }
    );
    res.status(200).send({ status: true, message: 'Success', data: updateBook });
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}

//================================================== Delete Book By Id ====================================================

const deleteById = async function (req, res) {
  try {
    let bookId = req.params.bookId
    let bookexist = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!bookexist) {
      return res.status(404).send({ status: false, msg: "Book Not Found" })
    }


    let date = Date.now()                                               //getting timestamps value
    let deletedAt = moment(date).format('YYYY-MM-DD, hh:mm:ss')        //formatting date
    let deleteBook = await bookModel.findOneAndUpdate({ _id: bookId },
      { $set: { isDeleted: true, deletedAt: deletedAt } },
      { new: true })

    if (deleteBook) {
      return res.status(200).send({ status: true, msg: "Book is Deleted" })
    }
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }

}
module.exports = { createBook, getBooks, getBookById, deleteById, updateBook}