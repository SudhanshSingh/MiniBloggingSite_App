const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const blogsModel = require("../models/blogsModel")



//=========================================== Authentication ==================================================//


const authenticate = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-Key"];
    if (!token) {
      token = req.headers["x-api-key"];
    }
    //If no token is present in the request header return error
    if (!token) {
      return res.status(400).send({ status: false, message: "token must be present" });
    }

    let decodedToken = jwt.verify(token, "functionUp-radon");
    if (!decodedToken) {
      return res.status(401).send({ status: false, message: "token is invalid" });
    }
    req.authorId = decodedToken.authorId;
    next();
  }
  catch (error) {
    return res.status(500).send({ message: " Server Error", error: error.message });
  }
}





//============================================ Authorization ==================================================//


const authorise = async function (req, res, next) {
  try {
    let blogId = req.params.blogId;

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, message: "BlogId must be a valid ObjectId" });
    }

    let blog = await blogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).send({ status: false, message: "blog does not exists in db collection" });
    }
    if (blog.isDeleted) {
      return res.status(404).send({ status: false, message: "blog is already deleted" });
    }

    if (blog.authorId != req.authorId) {
      return res.status(403).send({ status: false, message: 'You are not authorised to perform this task' });
    }
    next();
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}



//====================================== Authorization for delete Query ==========================================//


const delQueryAuth = function (req, res, next) {
  try {
    let authorLoggedId = req.authorId;

    let authorId = req.query.authorId;

    //validation of authorId
    if (authorId) {
      if (!mongoose.isValidObjectId(authorId)) {
        return res.status(400).send({ status: false, message: "Not a valid author ID from Token" });
      }
      if (authorId != authorLoggedId) {
        return res.status(403).send({ status: false, error: "Unauthorized access" });
      }
    }
    if (!authorId) {
      authorId = authorLoggedId;
      req.query.authorId = authorLoggedId;
    }
    next();
  }
  catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

module.exports = { authenticate, authorise, delQueryAuth }