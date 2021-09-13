var express = require("express");
var router = express.Router();
//instead of define call back here we have to define in controller controller/auth.js
const { signout, signin , signup , isSignedIn, isAuthenticated} = require("../controllers/auth");
//importing express validator
const { check, validationResult } = require("express-validator");

//let's define in call back func
/*const signout = (req,res) => {
    res.json({
        "message" : "user signout" 
    });
};*/
router.post(
  "/signup",
  check("name")
    .isLength({ min: 3 })
    .withMessage("name should be at least 3 characters"),
  check("email").isEmail().withMessage("please enter valid mail"),
  check("password")
    .isLength({ min: 3 })
    .withMessage("password should be 3 characters"),
  signup
);

//sign in route with validation
router.post(
  "/signin",
  check("email").isEmail().withMessage("email is required"),
  check("password").isLength({ min: 3 }).withMessage("password is required"),
  signin
);

//sign out route 
router.get("/signout", signout);

//isSignedIn protected route middle ware for protect the route 
router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

/*
router.get("/testauth",isAuthenticated,(req,res) => {
  res.send("user is authenticated");
});*/

//throw this whatever created in this file also import in app.js
module.exports = router;
