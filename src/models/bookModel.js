const mongoose = require('mongoose');
//const userModel = require('./userModel');
const ObjectId = mongoose.Schema.Types.ObjectId;
const moment = require('moment')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        require: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        require: true,
        ref: 'userdata'
    },

    ISBN: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        require: true
    },
    subcategory: [{
        type: String,
        require: true,
        trim: true
    }],
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: { type: Date },
    releasedAt: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true});


module.exports = mongoose.model('book', BookSchema)



