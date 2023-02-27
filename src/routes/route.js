const express = require('express');
const router = express.Router();

const { createAuthor, loginAuthor } = require('../controllers/authorcontroller');
const { authenticate, authorise, delQueryAuth } = require('../middleware/auth');
const { createBlogs,getAllBlogs, getBlogs, updateBlogs, deleteBlogs, queryDeleted } = require('../controllers/blogscontroller');



//=========================================== Author API'S ==============================================//

router.post("/authors", createAuthor);
router.post("/login", loginAuthor);


//=========================================== Blog API'S ================================================//

router.post("/blogs", authenticate, createBlogs);
router.get("/allblogs", authenticate, getAllBlogs);
router.get("/blogs", authenticate, getBlogs);
router.put("/blogs/:blogId", authenticate, authorise, updateBlogs);
router.delete("/blogs/:blogId", authenticate, authorise, deleteBlogs);
router.delete("/blogs", authenticate, delQueryAuth, queryDeleted);



router.all('/*', function (req, res) {
    res.status(400).send({ status: false, messsage: "invalid http request" });
})

module.exports = router; 