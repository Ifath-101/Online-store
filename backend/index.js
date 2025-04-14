const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors")

app.use(express.json());
app.use(cors());

//Database connection
mongoose.connect("mongodb+srv://ifathahamed01:ifath373@cluster0.ww27jje.mongodb.net/Ecommerce")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));


//API creation
app.get("/",(req,res)=>{
    res.send("Express app is running")
})

// Image storage engine

const storage = multer.diskStorage({
    destination: function (req, file, cb) {         //Destination to store the images
      cb(null, 'uploads/');                         //now it will be stored in the uploads folder
    },
    filename: function (req, file, cb) {            //function to create a cutom file name
      if (!file.originalname) {
        return cb(new Error("File has no originalname"), null);
      }
      const ext = path.extname(file.originalname);     //Gets the extension of the current image
      cb(null, `${Date.now()}${ext}`);                 //Generates a new file name  
    }
  });
const upload = multer({storage:storage})        //initializes Multer with the custom storage configuration 

//Craeting upload endpoint for images
app.use('/images',express.static('uploads'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for creating products
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type: String,
        required:true,
    },
    image:{
        type: String,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default:Date.now,
    },
    available:{
        type: Boolean,
        default:true,
    },
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});      //fetches all product details from Mongodb
    let id;                                     //determining the new product id
    if(products.length>0){
        let last_product_array = products.slice(-1);    //takes the last product
        let last_product = last_product_array[0];       //takes the id of the last product
        id = last_product.id+1;                         //sets the id to the nesxt value
    }
    else{
        id=1;                           //if no existing products the id will be 1
    }
    const product = new Product({       //creates a new instance of the Product model
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for deleting product
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
});

//Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

//Schema creation for user model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false,error: "existing user found with same email address"});
    }
    let cart = {};
    for (let i=0; i<300; i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Incorrect password"});
        }
    }
    else{
        res.json({success:false,errors:"Incorrect email ID"})
    }
})

//Creating endpoint for new collection data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
})

//Creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//creating middleware to fetch user
    const fetchUser = async (req,res,next) =>{
        const token = req.header('auth-token');
        if (!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try{
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch(error){
                res.status(401).send({errors:"please authenticate using a valide token"})
            }
        }
    }

//Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

// creating endpoint to remove product from cartdata
app.post('.removefromcart',fetchUser,async (req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

//creating endpoint to get cart data
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("Get cart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port "+port)
    }
    else{
        console.log("Error : "+error)
    }
})