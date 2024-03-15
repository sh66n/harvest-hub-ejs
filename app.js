const port = 3000;
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
mongoose
    .connect("mongodb://127.0.0.1:27017/harvest-hub-ejs")
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log("Error!", e);
    });

const Post = require("./models/posts");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("landing");
});
app.get("/posts", async (req, res) => {
    const allPosts = await Post.find({});
    res.render("index", { allPosts });
});
app.get("/posts/new", async (req, res) => {
    res.render("new");
});
app.post("/posts", async (req, res) => {
    const { post } = req.body;
    post.author = "ram kishan";
    const newPost = await Post.create(post);
    res.redirect("/posts");
});
app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("show", { post });
});
app.get("/posts/:id/edit", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("edit", { post });
});
app.patch("/posts/:id", async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { post } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    await updatedPost.save();
    res.redirect("/posts");
});
app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id, { new: true });
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
