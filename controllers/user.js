//first import the user model
const User = require("../models/user");
//populating data
const Order = require("../models/order");

//here id is getting from the url and we are setting up a profile for user using this middleware
exports.getUserById = (req, res,next) => {
  let id = req.params.userId;
  //just find the user with this id and return if not found
  User.findById(id, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "no user was found on db",
      });
    }
    //let's get the user and store into a req.profile object remeber this
    req.profile = user;
    next()
  });
};
//after getting a user return back
exports.getUser = (req, res) => {
  //todo : get back here for password
  //here req.profile will populate all information including encry_password as well as salt which is
  //very sensitive information
  //so we need to set undefined in this.
  // req.profile.salt = undefined ;
  // req.profile.encry_password = undefined ;
  return res.json(req.profile);
};

//response to inforamtion about all users in json format
exports.getAllUsers = (req, res) => {
  User.find({}, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user is found",
      });
    }
    return res.json(user);
  });
};

//defining a method for update passing by req.body as well as id of user
exports.updateUser = (req, res) => {
  let id = req.params.userId;
  //req.body is json file of input for updation of recoreds with respect to put request
  User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "you have no authority to update the user",
      });
    }
    res.json(user);
  });
};

//define a method which populate all the data specific for that userId
exports.userPurchaseList = (req, res) => {
  //in order to populate we need to use order schema
  //use profile that we already set in isAuthenticated function
  Order.find(req.profile._id)
    .populate("user")
    .exec((err, docs) => {
      if (err || !docs) {
        res.status(400).json({
          error: "no data available for this id",
        });
      }
      res.json(docs);
    });
};

//middleware that push the order in user's purchase list getting from front end
//so we know that orderSchema contains the productCart schema
//here we are storing the order list in purchases
//we using order schema which contain productcarschema which contains product schema
//and fetcing necessary porperties to purchase to the userschema
exports.pushOrderInPurchaseList = (req, res, next) => {
  //local array
  let purchaseLocal = [];
  //from front end order object there is array name products which contain all inforamtion about products
  //also products have all individual product schema
  let products = req.body.order.products;
  //refer models/product.js
  products.forEach((product) => {
    purchaseLocal.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      amount: req.body.order.amount,
      transaction: req.body.order.transaction_id,
    });
  });

  //now store the local array to specific user db
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchaseLocal } },
    { new: true },
    (err, docs) => {
      if (err || !docs) {
        return res.status(400).json({
          error: "no data to add in purchases",
        });
      }
      next();

    }
  );

};
