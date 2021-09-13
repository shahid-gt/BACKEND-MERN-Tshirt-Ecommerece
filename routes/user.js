const express = require("express");
const router = express.Router() ;

//here userId is coming from url from get method pass 
//use appropriate controller for geting user by this id 
const {getUserById,getUser,getAllUsers,updateUser,userPurchaseList} = require("../controllers/user"); //here we are using getUserById method
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth");//here we are using isSignedIn , isAuthenticated , 


//getUserById is set the user to req.profile and later we use as a response .
//userid is coming from get request url 
router.param("userId",getUserById);

//in this get method we implement some middle ware as well as getUser
router.get("/user/:userId",getUser);
//for update records 
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser);
router.get("/users",getAllUsers);
//retrive the data of how many orders are there for specific userId 
router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList);

module.exports = router ;