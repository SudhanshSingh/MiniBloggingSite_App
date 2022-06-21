const blogsModel = require("../models/blogsModel")
const { createAuthor } = require("./authorcontroller")


const createBlogs= async function (req, res) {
    
    let data= req.body
    const authorData= req.body.authorId
    const check= await createAuthor.findById({_id : authorData}).select(({_id : 1}))
    if(!check){
        return res.status(404).send({msg:"not a valid Author"})
    }
    let savedData= await blogsModel.create(data)
    res.send({msg: savedData})
}

module.exports.createBlogs= createBlogs