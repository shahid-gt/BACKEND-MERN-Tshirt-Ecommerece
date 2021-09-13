//first import model
const User = require("../models/user");
//import validation
const { check, validationResult } = require("express-validator");
const user = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  //validate the error with coustom messages
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      //"parameter ": errors.array()[0].param,
      //"message ": errors.array()[0].msg,
      err : errors.array()[0].msg
    });
  }

  //create obj and initialize properties
  const user = new User(req.body);
  //save
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "not able to store user in db",
      });
    }
    res.json(user);
  });
};

//create the sign in controller
exports.signin = (req, res) => {
  const error = validationResult(req);

  //check our validators blank email or blank password
  if (!error.isEmpty()) {
    return res.status(400).json({error : error.array()[0].msg});
  }

  //destructure req.body for further verification
  const { email, password } = req.body;

  //now it's time to check weather email is present or not for that we required User model already imported
  //this findOne will either return error or User handle using call back 
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "email is not exist" });
    }

    console.log(user); //just for reference 

    //now email is found so it return the user
    //so check for password matches or not
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "email id and password does not match" });
    }

    //now email and password is correct so store the log in information to user cookie
    //for that we need jsonwebtoken and cookie first import that
    //1. generate token using jsonwebtoken
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //2. put above token in user cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //now send the respose to front end
    //destructure first
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout successfully",
  });
};

//protected isSignedIn route controller 
//protected route
//here expressJwt aready implemented next so no need to write it though it is a middleware 
exports.isSignedIn = expressJwt({
  secret: "learncodeonline",
  userProperty: "auth" //here auth  is add the some more property to request object checking by returning json response 
});

//custome middleware 
exports.isAuthenticated = (req,res,next) => {
  let checker = req.profile && req.auth && req.profile._id ==req.auth._id ; //here profile is set by frontend
  if(!checker){
    return res.status(403).json({
      "error" : "forbidden user is not authenticated"
    });
  }
  next() ;
}

exports.isAdmin = (req,res,next) => {
  if(req.profile.role===0){
    return res.status(403).json({
        error : "you are not admin , ACCESS DENIED"
    });
  }
  next();
}