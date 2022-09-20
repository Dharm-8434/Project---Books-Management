const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {
        type: string,
        require: true,
        unique: true,
        trim:true
    },
    excerpt: {
        type: string,
        require: true,
        trim:true
    },
    userId: {
        type: ObjectId,
        require: true,
    },//, refs to user model

    ISBN: {
        type: string,
        require: true,
        unique: true,
        trim:true
    },
    category: {
        type: string,
        require: true
    },
    subcategory: {
        type: Array,
        require: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: Date,
    isDeleted: {
        type: boolean,
        default: false
    },
    releasedAt: Date
},
    { timestamps: true });


module.exports = mongoose.model('Book', BookSchema)



