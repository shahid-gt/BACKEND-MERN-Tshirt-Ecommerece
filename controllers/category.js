//import model 
const Category = require("../models/category");

//middle ware to set the req.category similar to req.profile
exports.getCategoryById = (req,res,next) => {
    //take the cat id from req.params.catId
    let id = req.params.catId ;
    //find that id in db 
    Category.findById(id,(err,docs)=>{
        if(err || !docs){
            res.status(400).json({
                "error" : "requested id is not found "
            });
        }
        req.category = docs ;
        next();

    });
}
//get category using above middleware 
exports.getCategory = (req,res) => {
    //we already set in req.category object 
    return res.json(req.category);
};

exports.getAllCategory = (req,res) => {
    Category.find({},(err,docs)=>{
        if(err || !docs){
            return res.json({
                "error" : "no category is available"
            })
        }
        return res.json(docs);
    })
}


exports.createCategory = (req,res) => {
    //create an object from model by initializing properties
    const category = new Category(req.body);
    //save this object to mongodb
    category.save((err,docs)=>{
        if(err){
            return res.status(400).json({
                "error" : "Category is already exist."
            });
        }
        res.json(docs);
    })
}

exports.updateCategory = (req,res) => {
    let id = req.category._id ;
    Category.findByIdAndUpdate(id,req.body,{new:true},(err,docs)=>{
        if(err || !docs){
            return res.status(400).json({
                "error" : `Failed to update Category ${req.category.name}`
            });
        }
        return res.json({
            "message" : `successfully updated category ${req.category.name}`
        })
    });
}

exports.deleteCategory = (req,res) => {
    Category.findByIdAndDelete(req.category._id,(err,docs)=>{
        if(err){
            return res.status(400).json({
                "error" : `failed to delete this category ${req.category.name}`
            });
        }
        res.json({
            "message" : `successfully deleted ${docs.name}`
        });
    })
}