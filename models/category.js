const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
        //so category has only one property that is name 
        name : {
            type : String ,
            required : true , 
            maxlength : 32 , 
            trim : true ,
            unique : true 
        }
    },
    { timestamps : true }
);

module.exports = mongoose.model("Category",categorySchema);
