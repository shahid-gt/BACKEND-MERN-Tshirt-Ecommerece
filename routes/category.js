const express = require("express");
const router = express.Router() ;

//import the mehtods or middleware from contoller 
const {getCategoryById,createCategory,getCategory,getAllCategory,updateCategory,deleteCategory} = require("../controllers/category");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//set param
router.param("userId",getUserById);
router.param("catId",getCategoryById);

//lets first create the category route 
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);
//get the one category or all category 
router.get("/category/:catId",getCategory);
router.get("/categories",getAllCategory);
//update and delete category 
router.put("/category/:catId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);
router.delete("/category/:catId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory);


module.exports = router ;