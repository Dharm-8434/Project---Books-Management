const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    title:  {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name :{
        type : string,
        require:true,
        unique:true
    },
    phone:  {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }, 
    password: {
        type: String,
        required: true
    },
    address: {
      street: {type:string},
      city: {type:string},
      pincode: {type:string}
    },

}, { timestamps: true});

module.exports = mongoose.model('userData', UserSchema)