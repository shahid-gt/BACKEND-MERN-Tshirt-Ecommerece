//let's firs import mongoose in order to create the schema 
const mongoose = require("mongoose") ;
//let's import the crypto 
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

let userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        unique:true ,
        maxlength : 15 ,
        trim : true,
    },
    lastname : {
        type : String ,
        maxlength : 12 ,
        trim : true ,
       // required : true
    },
    email : {
        type:String ,
        trim:true,
        required : true ,
        unique : true 
    },
    userinfo : {
        type : String ,
        trim : true 
    },
    //let's store encrypted password .
    encry_password : {
        type : String ,
        required : true 
    },
    salt : String ,
    role : {
        type : Number,
        default : 0 
    },
    //let's define purchases and store in array
    purchases : {
        type : Array , 
        default : [] 
    }

});


//ok.Let's add some virtual properties which is defining using above or later. 
userSchema.virtual("fullname").get(function(){
    return this.firstname+" "+this.lastname ;
});


//define the method in schema like encrypting the plain password 
userSchema.methods = {
    securePassword : function(plainpassword){
        //so when it returns nothing then mongoDB will not support this .
        if(!plainpassword) return "";
        //write try and catch 
        try{
            //now here we write the main Logic for crypto code 
            //it is taking this.salt as a secret key
            return crypto.createHmac("sha256",this.salt).update(plainpassword).digest("hex");
        } catch(err){
            return "";
        }
    },

    //let's create authenticate method 
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password ;
    }
}

//create a virtual for plain password store 
userSchema.virtual("password")
    .set(function(password){
        this._password = password ;
        this.salt = uuidv1() ;
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    });

//throw out all things from this .
module.exports = mongoose.model("User",userSchema);

