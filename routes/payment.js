const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/payment");
const { getUserById } = require("../controllers/user");


//first we have to set req.profile 
router.param("userId",getUserById);


router.get("/payment/getToken/:userId",isSignedIn,isAuthenticated,getToken) ;

router.post("/payment/braintree/:userId",isSignedIn,isAuthenticated,processPayment);

module.exports = router ;