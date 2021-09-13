const mongoose = require("mongoose") ;
const {ObjectId} = mongoose.Schema ;
const productSchema = new mongoose.Schema({
    name : {
        type : String , 
        trim : true ,
        required : true ,
        maxlength : 32 
    },
    photo : {
        data : Buffer,
        contentType : String
    },
    price : {
        type : Number , 
        trim : true ,
        required : true 
    },
    //create a reference for category 
    category : {
        //here it is a type of ObjectId so first we need to mantion above that what is ObjectId
        type : ObjectId ,
        ref : "Category" , 
        required : true 
    },
    description : { 
        type : String ,
        maxlength : 1500
    },
    stock : {
        type : Number 
    },
    sold : {
        type : Number ,
        default : 0 
    }
},{timestamps : true });

//let's export all things 
module.exports = mongoose.model("Product",productSchema);