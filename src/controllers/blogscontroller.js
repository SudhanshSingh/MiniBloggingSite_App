const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")
const { createAuthor } = require("./authorcontroller")


const createBlogs = async function (req, res) {
    try {
        let data = req.body
        const authorData = req.body.authorId
        const check = await authorModel.findById({ _id: authorData }).select(({ _id: 1 }))
        if (!check) {
            return res.status(400).send({ msg: "not a valid Author" })
        }
        let savedData = await blogsModel.create(data)
        res.status(201).send({ msg: savedData })
    } 
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.createBlogs = createBlogs