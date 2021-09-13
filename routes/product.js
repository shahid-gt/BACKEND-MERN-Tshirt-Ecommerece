const express = require("express");
const router = express.Router() ;

//import from the controllers
const {getProductById,createProduct,getProduct,deleteProduct,updateProduct,getAllProducts,photo} = require("../controllers/product");
const {getUserById} = require("../controllers/user");
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth");

//parameters extraction 
//whenever it seens :productId or :userId then it's gonna fire up .
router.param("productId",getProductById);
router.param("userId",getUserById) ;

//actual routes 
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
router.get("/product/getProduct/:productId",getProduct);
router.get("/product/photo/:productId", photo);
router.get("/products",getAllProducts);

//update and delete the product 
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)

module.exports = router ;