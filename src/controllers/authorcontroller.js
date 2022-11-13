const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");


const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
}

const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;



//======================================= 1-Create Author Api ====================================================//

const createAuthor = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: "Please provide Author details" });
    }
    let { fname, lname, title, email, password } = requestBody;  //Object Destructuring

    //fname validation 
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "First name is required" });
    }
    if (!fname.trim().match(/^[a-zA-Z]+$/)) {
      return res.status(400).send({ status: false, msg: "Not a valid first name, Use Alphabets only" });
    }

    //lname validation
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "Last name is required" });
    }
    if (!lname.trim().match(/^[a-zA-Z]+$/)) {
      return res.status(400).send({ status: false, msg: "Not a valid last name, Use Alphabets only" });
    }

    //title validation
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }
    if (["Mr", "Mrs", "Miss"].indexOf(title.trim()) == -1) {
      return res.status(400).send({ status: false, msg: "title must be 'Mr', 'Mrs' or 'Miss' only" });
    }

    //email validation
    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "Email is requied" });
    }
    if (!emailRegex.test(email.trim())) {
      return res.status(400).send({ status: false, msg: "Invalid emailid format,Please check" });
    }
    //checking if email is already in use
    let emailCheck = await authorModel.findOne({ email: email.trim() });
    if (emailCheck) {
      return res.status(409).send({ status: false, msg: "Email-Id already Registerd" });
    }

    //password validation
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is required" });
    }

    //Author creation
    let authorData = {
      fname: fname.trim(),
      lname: lname.trim(),
      title: title.trim(),
      email: email.trim(),
      password: password.trim()
    };

    let savedData = await authorModel.create(authorData);
    return res.status(201).send({ status: true, data: savedData });
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}




//======================================== 2-Login and Token Generation Api ====================================//


const loginAuthor = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!isValid(email)) {
      return res.status(400).send({ status: false, message: "Please enter Email Id" });
    }
    if (!emailRegex.test(email.trim())) {
      return res.status(400).send({ status: false, message: "Email is not valid" });
    }

    if (!isValid(password)) {
      return res.status(400).send({ status: false, message: "Please enter Password" });
    }

    //Finding credentials 
    let user = await authorModel.findOne({ email: email.trim(), password: password.trim() });
    if (!user) {
      return res.status(404).send({ status: false, msg: "Invalid credential" });
    }

    //Token generation
    let token = jwt.sign({
      authorId: user._id.toString(),
    }, "functionUp-radon");

    res.setHeader("x-api-key", token);
    return res.status(200).send({ status: true, data: { token } });
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports = { createAuthor, loginAuthor }