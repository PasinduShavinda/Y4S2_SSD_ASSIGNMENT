
const express = require("express");
const router = express.Router();
const validator = require("email-validator");
const User = require("../model/User");
const rateLimit = require("express-rate-limit");
const axios = require("axios")
var sanitize = require('mongo-sanitize');

router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: "success",
    data: users,
  });
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minutes
  max: 5, // 5 login attempts per windowMs
  message: "Too many login attempts from this IP, please try again later.",
});

//..........input data..................
router.post("/login",loginLimiter, async (req, res) => {
  try {
    const valid = validator.validate(req.body.email);
    if (!valid) {
      throw new Error("Invalid email, please try again!");
    }
    // const user = await User.findOne({ email: req.body.email ,password :req.body.password})
    // if (!user) {
    //   throw new Error("Incorrect Password");
    // }
    const user = await User.findOne({ email: req.body.email ,password : sanitize(req.body.password)})
    if (!user) {
      throw new Error("Incorrect Password");
    }
    
    const recaptchaResponse = req.body.recaptchavalue;
    console.log(`hfbvfbhbf${req.body.recaptchavalue}`)
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);

    if (!isRecaptchaValid) {
      throw new Error("reCAPTCHA verification failed");
    }

   

    user.password = null;

    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (er) {
    res.status(400).json({
      message: "fail",
      error: er.message,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const address = req.body.address;
    const city = req.body.city;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const password = req.body.password;

    const valid = validator.validate(email);

    if (!valid) {
      throw new Error("Invalid email, please try again!");
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new Error("User with this email exists");
    }

    if (
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !phoneNumber ||
      !email ||
      !password
    ) {
      throw new Error("Empty Fields");
    }

    await User.create(req.body).then((user) => {
      user.password = null;
      res.json({
        message: "success",
        data: user,
      });
    });
  } catch (error) {
    res.status(400).json({
      message: "fail",
      error: error.message,
    });
  }
});

// .............delete...........

router.delete("/register:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) res.json(err);
    else
      res.status(200).json({
        message: "success",
        data: "Item Deleted Successfully",
      });
  });
});

//..............update.............
router.post("/register:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, async (err, data) => {
    if (err) res.send("error");
    res.json({
      message: "success",
      data: "Item has been updated successfully",
    });
  });
});

//get all data.................................
router.get("/:userid", async (req, res) => {
  await User.find({ Id: req.params.id })

    .then((user) => {
      res.json({
        message: "success",
        data: user,
      });
    })
    .catch((err) => {
      res.json({
        message: "fail",
        data: null,
      });
    });
});

module.exports = router;



async function verifyRecaptcha(response) {
  const SECRET ='6Ledi2QoAAAAAKgYRbFLc3MlrzipsbNoeHxcOr1j'
  // Make a request to Google's reCAPTCHA verification endpoint
  const googleRecaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${response}`;

  try {
    const recaptchaResponse = await axios.post(googleRecaptchaUrl);
    if (recaptchaResponse.data.success) {
      return true; // Verification successful
    } else {
      console.error("reCAPTCHA verification failed", recaptchaResponse.data);
      return false; // Verification failed
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false; // Verification failed due to an error
  }
}



