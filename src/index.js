const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(bodyParser.json());
app.use(cors());


mongoose.connect("mongodb+srv://Sudhanshu_09:5JQhJtJ5mUWQIBwo@cluster0.kt4fu.mongodb.net/BlogManagement", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route);


app.listen(4000, function () {
    console.log('Express app running on port ' + 4000)
});