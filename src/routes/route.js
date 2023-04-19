const express = require('express');
const router = express.Router();
const path=require("path")

const { createAuthor, loginAuthor } = require('../controllers/authorcontroller');
const { authenticate, authorise, delQueryAuth } = require('../middleware/auth');
const { createBlogs,getBlogsById, getBlogs, updateBlogs, deleteBlogs, queryDeleted } = require('../controllers/blogscontroller');



//=========================================== Author API'S ==============================================//

router.post("/authors", createAuthor);
router.post("/login", loginAuthor);


//=========================================== Blog API'S ================================================//

router.post("/blogs", authenticate, createBlogs);
router.get("/blogs", authenticate, getBlogs);
 router.get("/blogs/:blogId", authenticate, getBlogsById);
router.put("/blogs/:blogId", authenticate, authorise, updateBlogs);
router.delete("/blogs/:blogId", authenticate, authorise, deleteBlogs);
router.delete("/blogs", authenticate, delQueryAuth, queryDeleted);



router.all('*', function (req, res) {
    // console.log(path.resolve("build","index.html"))
    res.sendFile(path.resolve("build","index.html"));
    // res.send({message:false})
})

module.exports = router; 