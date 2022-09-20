const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
            title: { type:string,
                require:true
                , unique:true},
            excerpt: {
                type:string,
                require: true}, 
            userId: {
                type:ObjectId,
                require:true},//, refs to user model

            ISBN: {
                type:string, 
                require:true,
                 unique:true},
            category: {
                type:string,
                 require:true},
            subcategory:{
                type:Array,
                require:true
            }
            reviews: {number, default: 0, comment: Holds number of reviews of this book},
            deletedAt: {Date, when the document is deleted}, 
            isDeleted: {boolean, default: false},
            releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
            createdAt: {timestamp},
            updatedAt: {timestamp},

)}



