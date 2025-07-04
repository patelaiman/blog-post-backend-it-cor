const express = require("express");
const mongoose = require("mongoose");
const Post = require("./blogPostModel");
const cors=require("cors");
const app = express(); //first express
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)  //mangoos connect 27017 is a code of mongoos
    .then(() => { console.log("database connected successfully") })
    .catch((err) => { console.log("something went wrong", err) })

app.use(express.json()); //middleware                                 
app.use(cors())

app.get("/",(req, res)=>{
    res.send("Blog Post Backend Working")
})

app.post("/posts", async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const postData = await Post.create({ title, description, author })
        res.status(200).json(postData)
    } catch (err) {
        res.status(500).json({message:"Post not saved",error:err.message})
    }
})

// READ BLOG POST ALL
app.get("/posts", async (req, res) => {
    try {
        const allPosts=await Post.find().select("-createdAt -updatedAt -__v");
        res.status(201).json(allPosts);

    } catch (err) {
        res.status(500).json({message:"fetching posts failed",error:err.message})
    }
    })
    
//READ SINGLE POST


app.get("/posts/:id", async (req, res) => {
    try {

       const id= req.params.id;
        const singlePost=await Post.findById(id).select("-createdAt -updatedAt -__v");
        res.status(201).json(singlePost);

    } catch (err) {
        res.status(500).json({message:"fetching single Post failed",error:err.message})
    }
    })
    // DELETE A SINGLE POST
    app.delete("/posts/:id",async(req, res)=>{
        try{
            const id=req.params.id;
            const deletedPost= await Post.findByIdAndDelete(id)
            if (!deletedPost)return res.status(404).json({message: "Post not found"})
res.status(201).json({message: "Post deleted successfully"})
        } catch (err) {
            res.status(500).json({message: "deleted post failed", error: err.message})
        }

    })
    // UPDATE POST

    app.put("/posts/:id",async(req, res)=>{
        try{
            const id=req.params.id;
            const {title , description , author}=req.body;
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                {title, description , author},
                {new: true}
            )
            res.status(201).json(updatedPost);
        } catch (err){
            res.status(500).json({message: "update post failed", error: err.message})
        }
    })

    const PORT = process.env.PORT || 5000;

// const PORT = 4000; //second step of express
app.listen(PORT, () => {
    console.log(`Server is running on http://locahost:${PORT}`);
})