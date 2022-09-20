
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const createUser = async function (req, res) {
  try {
    let data = req.body
    
    // if (data.title == undefined) {
    //   return res.status(401).send({ msg: "fname Compulsory" })
    // }
    // if (data.name == undefined) {
    //   return res.status(401).send({ msg: "lname Compulsory" })
    // }
    // if (!(/^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/).test(data.emailId)) {
    //   return res.status(400).send({ status: false, message: `Email should be a valid email address` });
    // }
    // if (data.password == undefined) {
    //   return res.status(401).send({ msg: "password Compulsory" })  
    // }
    // if (data.phone == undefined) {
    //   return res.status(401).send({ msg: "title Compulsory" })
    // }
    let savedData = await userModel.create(data)
    return res.status(201).send({ msg: savedData })
  }
  catch (err) {
    res.status(500).send({ msg: err.message })
  }
}


module.exports.createUser=createUser