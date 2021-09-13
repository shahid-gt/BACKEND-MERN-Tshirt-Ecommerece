const mongoose = require("mongoose");
const express = require("express");
//importing middleware 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors") ;
const app = express();

//import route files 
const authRoutes= require("./routes/auth");
const userRoutes= require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

//dotenv file 
require('dotenv').config() ;

let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app is running on ${port}.`);
});

//let's connect with db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//let's define some middleware like body-parser , cookie-parser , cors first import
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//ROUTES of authentication
app.use("/api",authRoutes) ;
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes) ;
app.use("/api",paymentRoutes);