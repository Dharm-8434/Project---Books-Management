
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const createUser = async function (req, res) {
//   try {
//     let data = req.body
    
//      if (data.title == undefined) {
//        return res.status(401).send({ msg: "title Compulsory" })
//      }
//     if (data.name == undefined) {
//       return res.status(401).send({ msg: "name Compulsory" })
//     }
//     if (!(/^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/).test(data.email)) {
//       return res.status(400).send({ status: false, message: `Email should be a valid email address` });
//     }
//     if (data.password == undefined) {
//       return res.status(401).send({ msg: "password Compulsory" })  
//     }
//     if (data.phone == undefined) {
//       return res.status(401).send({ msg: "Phone Number Compulsory" })
//     }

//     let savedData = await userModel.create(data)
//     return res.status(201).send({ msg: savedData })
//   }
//   catch (err) {
//     res.status(500).send({ msg: err.message })
//   }
// }

try{
    let data= req.body
    let {title, name, phone, email,password} = data

    if(Object.keys(data).length == 0) {
        return res.status(400).send({status: false, message: "please enter data in the request body"})
    }
    data.title = data.title.trim()
    if(!title) {
        return res.status(400).send({status: false, message: "title is missing"})
    }
    if(!name) {
        return res.status(400).send({status: false, message: "name is missing"})
    }
     data.name = data.name.trim()
    if(name.length !== 0) {
        if(!/^[a-zA-Z_ ]+$/.test(name)) {
            return res.status(400).send({status: false, message: "Enter valid name "})
        }
    }
    if(!phone) {
        return res.status(400).send({status: false, message: "phone number is missing"})
    }
    data.phone = data.phone.trim()
    if(! /^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).send({status: false, message: "phone number is not valid"})
    }
    const duplicateNumber = await userModel.findOne({phone:data.phone});
    if(duplicateNumber){
        return res.status(400).send({status:false,msg:"phone is all ready exist"})
    }
    const duplicateEmail = await userModel.findOne({ email:data.email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: "email is all ready exist" });
        }

    if(!email) {
        return res.status(400).send({status: false, message: "email is missing"})
    }
    data.email=data.email.trim()
    if(!(/^[a-z0-9_]{3,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/).test(data.email)) {
        return res.status(400).send({status: false, message: "Enter a valid emailId"})
    }

    if (!password) {
        return res.status(400).send({ status: false, message: "password is missing" })
    }
    
    if (!(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(password)) {
        return res.status(400).send({ status: false, message: "Enter a valid password" });
    }

    let savedData = await userModel.create(data)
    return res.status(201).send({ status: true, message: " you are registered successfully", data: savedData })

} catch (err) {
    return res.status(500).send({ status: false, message: err.message })
}
}


//===================================loginUser==============================================================//



const loginUser=async function(req,res){
  try{

  let { email,password}= req.body
  let user= await userModel.findOne({ email ,password});
 if (user) {
      let payload = { userId: user._id,   email:   email };
      const generatedToken = jwt.sign(payload, "bloggingproject1");
      return res.status(200).send({
        status: true,
        token: generatedToken,
      });
    } else {
      return res.status(400).send({ status: false, message: "Invalid credentials" });
    }
  } 
  catch(error){
      res.status(500).send({status : false , msg : error.message})

  }
  }


module.exports.createUser=createUser
module.exports.loginUser=loginUser