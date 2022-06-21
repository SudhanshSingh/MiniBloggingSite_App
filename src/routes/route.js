const express = require('express');
const router = express.Router();

const AuthController= require("../controllers/authorcontroller")
const BlogsController= require("../controllers/blogscontroller")


router.post("/authors", AuthController.createAuthor )
router.post("/blogs", BlogsController.createBlogs )

module.exports = router; 