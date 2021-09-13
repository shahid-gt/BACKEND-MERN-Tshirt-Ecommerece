const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// 2 --> define the properties of prodcut which present in cart like count , amount , name and product is
// come from 'Product' Schema
const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});
//for export model
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

// 1 --> let's define the order schema which containe whole order information
//like which are product it has address , transaction , total amount of order and which user ordered
//status of the order which is updated by admin
const OrderSchema = new mongoose.Schema(
  {
    //how many products does cart contain
    products: [ProductCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    status : {
      type : String ,
      message : `received`,
      enum : ["Processing","Shipped","Cancelled","Delivered"]
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { ProductCart, Order };
