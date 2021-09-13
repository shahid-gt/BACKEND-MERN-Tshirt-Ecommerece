//import the product schema model
const Product = require("../models/product");
//handling multipart/form-data
const formidable = require("formidable");
//extend support to js
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next) => {
  //fetch the id
  let id = req.params.productId;
  Product.findById(id)
    .populate("category")
    .exec((err, docs) => {
      if (err) {
        return res.json({
          message: "Product with given id is not found ",
        });
      }
      req.product = docs;
      next();
    });
};

//handler for creating the product
exports.createProduct = (req, res) => {
  //handle multiport data by creating object
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: "problem with image",
      });
    }
    // console.log(fields);

    const { name, price, description, category, stock } = fields;
    //restriction on fields
    //fetch the details
    if (!name || !price || !category || !stock || !description) {
      return res.status(400).json({
        error: "please ! include all fields ",
      });
    }
    console.log(fields);
    let productLocal = new Product(fields);

    //handle the file using formidable
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size is too big",
        });
      }
      //actual store the data
      productLocal.photo.data = fs.readFileSync(file.photo.path);
      productLocal.photo.contentType = file.photo.type;
    }

    //console.log(productLocal);
    //save to produtLocal to mongo db
    productLocal.save((err, product) => {
      if (error) {
        return res.status(400).json({
          error: "saving tshirt in db is failed",
        });
      }
      return res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  //bulky image need to undefined
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware for photo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    //first fetch the content type
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let id = req.product._id;
  Product.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: `failed to delete product ${req.product.name}`,
      });
    }
    return res.json({
      message: `successfully deleted product ${req.product.name}`,
    });
  });
};

//plan for update product that we are taking the data from db and
//show in fields then whatever update we want that we will save it
exports.updateProduct = (req, res) => {
  //so taking the data from form updated data
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code for product using lodash which takes a updation object and required feilds
    let productLocal = req.product;
    productLocal = _.extend(productLocal, fields);

    //handle the file using formidable
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size is too big",
        });
      }
      //actual store the data
      productLocal.photo.data = fs.readFileSync(file.photo.path);
      productLocal.photo.contentType = file.photo.type;
    }

    //console.log(productLocal);
    //save to produtLocal to mongo db
    productLocal.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "saving tshirt in db is failed",
        });
      }
      return res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  //we are excluding photos by minus sign
  Product.find({})
    .select("-photo")
    .sort([[sortBy, "asc"]])
    //.limit(limit)
    .populate("category")
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({
          error: "no product found",
        });
      }
      return res.json(docs);
    });
};

//middleware for updating stock and sold
exports.updateStock = (req, res, next) => {
  //go through the  model/order.js
  let products = req.body.order.products;
  //so here we want the array of objects which contain 2 prop like updateone and filter in array manner.
  //so we are using the map instead of forEach
  let operationObj = products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -1, sold: +1 } },
      },
    };
  });

  Product.bulkWrite(operationObj, {}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Bulk operations failed to update stock and sold for product",
      });
    }
    next();
  });
};
