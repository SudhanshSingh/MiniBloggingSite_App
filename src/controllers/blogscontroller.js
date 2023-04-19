const mongoose = require("mongoose")
const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}



//======================================== 3-CreateBlog Api ====================================================//

const createBlogs = async function (req, res) {
    try {
        const requestBody = req.body;
        requestBody["authorId"]=req.authorId
        // console.log(requestBody)
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "Please provide Blogs details" });
        }
        //Object Destructuring
        let { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;

        //title validation
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: " title is required" });
        }

        //body validation
        if (!isValid(body)) {
            return res.status(400).send({ status: false, msg: "body is required" });
        }

        //Author id validation
        let authorData = requestBody.authorId.trim();
        if (!isValid(authorData)) {
            return res.status(400).send({ status: false, msg: "authorId is required" });
        }
        if (!mongoose.isValidObjectId(authorData)) {
            return res.status(400).send({ status: false, msg: "AuthorId must be a valid ObjectId" });
        }
        const check = await authorModel.findById({ _id: authorData }).select(({ _id: 1 }));
        if (!check) {
            return res.status(404).send({ status: false, msg: "AuthorId is not Present" });
        }

        //category validation
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: " category is required" });
        }
        if (!category.match(/^[a-zA-Z]+$/)) {
            return res.status(400).send({ status: false, msg: "enter valid catagory" });
        }

        //isPublished validation
        if (isPublished) {
            //console.log(typeof(isPublished))
            if (!isValid(isPublished)) {
                return res.status(400).send({ status: false, message: "Please enter isPublished or remove this section" });
            }
            if (!["true", "false"].includes(isPublished)) {
                return res.status(400).send({ status: false, message: "isPublished should be either 'true' or 'false'" });
            }
        }

        let blogData = {
            title: title.trim(),
            body: body.trim(),
            authorId: req.authorId.trim(),
            tags: tags,
            category: category.trim(),
            subcategory: subcategory,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        };

        //Blogs creation
        let savedData = await blogsModel.create(blogData);
        return res.status(201).send({ status: true,message:'Blog created Successfully', data: savedData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}




//========================================= 4-Get Blogs Data ===================================================//

const getBlogs = async function (req, res) {
    try {
        //filter the data which isn't deleted and being published
        const filterQuery = { isPublished: true, isDeleted: false };
        let queryparams = req.query;

        if (isValidRequestBody(queryparams)) {
            let { category, authorId, tags, subcategory } = queryparams;

            if ("authorId" in queryparams) {
                if (Object.keys(authorId).length === 0) {
                    return res.status(400).send({ status: false, message: 'authorId query is empty, either provide query value or deselect it.' });
                }
                if (!mongoose.isValidObjectId(authorId)) {
                    return res.status(400).send({ status: false, message: 'AuthorId must be a valid ObjectId' });
                }
                filterQuery['authorId'] = authorId;
            }

            if ("category" in queryparams) {
                if (Object.keys(category).length === 0) {
                    return res.status(400).send({ status: false, message: 'category query is empty, either provide query value or deselect it.' });
                }
                filterQuery['category'] = category.trim();
            }

            if ("tags" in queryparams) {
                if (Object.keys(tags).length === 0) {
                    return res.status(400).send({ status: false, message: 'tags query is empty, either provide query value or deselect it.' });
                }
                const tagsArr = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = { $all: tagsArr };
            }

            if ("subcategory" in queryparams) {
                if (Object.keys(subcategory).length === 0) {
                    return res.status(400).send({ status: false, message: 'subcategory query is empty, either provide query value or deselect it.' });
                }
                const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                filterQuery['subcategory'] = { $all: subcatArr };
            }
        }

        const blogs = await blogsModel.find(filterQuery).sort({createdAt:-1});
        if (blogs.length == 0) {
            return res.status(404).send({ status: false, msg: "No such document exist with the given attributes." });
        }
        return res.status(200).send({ status: true, data: blogs });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


//============================Get BlogBy Id Api==================================/////////

const getBlogsById=async(req,res)=>{
    try{ 
    let blogId=req.params.blogId
    if (!blogId)
    return res
      .status(400)
      .send({ status: false, message: "Enter blogId in the params" });
  // validating the BookId
  if (!mongoose.isValidObjectId(blogId))
    return res
      .status(400)
      .send({ status: false, message: "blogId  is not valid " });
  let findBlog = await blogsModel.findOne({ _id: blogId });
  if (!findBlog)
    return res
      .status(404)
      .send({ status: false, message: "Blog is not found" });
  if (findBlog.isDeleted == true)
    return res
      .status(404)
      .send({ status: false, message: "Blog is already deleted" });
    let resData= await blogsModel.findOne({_id:blogId,isDeleted: false})
    return res.status(200).send({status:true,message:' blogs data',data:resData})
}catch(err){
    return res.status(500).send({ status: false, msg: err.message });
}
}


//========================================= 5-UpdateBlogs Api ====================================================//


const updateBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId;

        const data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Provide data details" });
        }
        if (data.category || data.authorId) {
            return res.status(400).send({ status: false, msg: "You cannot change authorId or category" });
        }

        let updatedDetails = await blogsModel.findOneAndUpdate({ _id: blogId },
            {
                title: data.title,
                body: data.body,
                $push: { tags: data.tags, subcategory: data.subcategory }, //$push used because it is assumed that data is getting added 
                isPublished: true,
                publishedAt: new Date(),
            }, { new: true, upsert: true });

        return res.status(200).send({ status: true, message: "Blog update is successful", data: updatedDetails });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}





//====================================== 6-DeletedBlog By Path Param Id ==========================================//


let deleteBlogs = async function (req, res) {
    try {
        let blog = req.params.blogId;

        await blogsModel.findOneAndUpdate({ _id: blog }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });

        return res.status(200).send({ status: true, message: "Blog deleted Successfully..." });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}




//===================================== 7-DeletedBlog By Query Param ============================================//


const queryDeleted = async function (req, res) {
    try {
        let query = req.query;
        const { category, authorId, tags, subcategory, isPublished } = query;

        const filterQuery = { isDeleted: false };

        if (authorId) {
            filterQuery['authorId'] = authorId;
        }
        if ("category" in query) {
            if (Object.keys(category).length === 0) {
                return res.status(400).send({ status: false, message: 'category query is empty, either provide query value or deselect it.' });
            }
            filterQuery['category'] = category.trim();
        }

        if ("isPublished" in query) {
            if (Object.keys(isPublished).length === 0) {
                return res.status(400).send({ status: false, message: 'isPublished query is empty, either provide query value or deselect it.' });
            }
            if (typeof isPublished !== 'boolean') {
                return res.status(400).send({ status: false, error: "not published" });
            }
            filterQuery['isPublished'] = isPublished.trim();
        }

        if ("tags" in query) {
            if (Object.keys(tags).length === 0) {
                return res.status(400).send({ status: false, message: 'tags query is empty, either provide query value or deselect it.' });
            }
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            filterQuery['tags'] = { $all: tagsArr };
        }

        if ("subcategory" in query) {
            if (Object.keys(subcategory).length === 0) {
                return res.status(400).send({ status: false, message: 'subcategory query is empty, either provide query value or deselect it.' });
            }
            const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
            filterQuery['subcategory'] = { $all: subcatArr };
        }

        let dataToDelete = await blogsModel.updateMany(filterQuery, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });

        if (dataToDelete.modifiedCount == 0) {
            return res.status(404).send({ status: false, message: "Given query param does not exist or Blog is already deleted" });
        }
        return res.status(200).send({ status: true, msg: "Blogs deleted Successfully..." });
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message });
    }
}



module.exports = { createBlogs, getBlogs,getBlogsById, updateBlogs, deleteBlogs, queryDeleted }