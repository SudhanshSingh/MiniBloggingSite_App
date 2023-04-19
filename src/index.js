const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path:"./.env"})
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const cors = require('cors')
const path=require("path")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(process.env.PUBLIC_DIR)))
app.use(cors());


mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route);


app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});