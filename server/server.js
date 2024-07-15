import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// const serviceAccountKey = require('./blogly-2db1a-firebase-adminsdk-5fczo-04dcbe2750.json');
const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
import {getAuth} from 'firebase-admin/auth';
import aws from 'aws-sdk';

// setting up as s3 bucket
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const generateUploadUrl = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise('putObject', {
    Bucket: 'blogly-bucket',
    Key: imageName,
    Expires: 1000,
    ContentType: 'image/jpeg',
  })
}
process.removeAllListeners('warning');

const server = express();
let port = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json())
server.use(cors())

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex : true
})

const formatDatatoSend = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
  return {
    accessToken,
    profile_img : user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname
  }
}

const generateUsername = async(email) => {
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({ "personal_info.username" : username });
    
    isUsernameNotUnique ? username += nanoid().substring(0,5) : "";

    return username;
}

server.get('/get-upload-url', async (req, res) => {
  generateUploadUrl().then((url) => {
    return res.status(200).json({uploadURL : url})
  })
  .catch((err) => {
    return res.status(500).json({ "error" : err.message})
  })
})

server.post("/signup", (req, res) => {
    let {fullname, email, password} = req.body;

    // validate the data
    if(fullname.length < 3) {
        return res.status(403).json({ "error" : "Fullname must be at least 3 characters long"})
    }

    if(!email.length) {
        return res.status(403).json({ "error" : "Email is required"})
    }
    if(emailRegex.test(email) === false) {
        return res.status(403).json({ "error" : "Email is invalid"})
    }

    if(!password.length) {
        return res.status(403).json({ "error" : "Password is required"})
    }
    if(passwordRegex.test(password) === false) {
        return res.status(403).json({ "error" : "Password must be 6-20 characters long, and contain at least one number and one uppercase letter"})
    }

    // hash the password
    bcrypt.hash(password, 10, async (err, hash) => {
        // console.log(password, hash)
        if(err) {
            return res.status(500).json({ "error" : "Error hashing password"})
        }

        let username = await generateUsername(email);

        let user = new User({
          personal_info: {
            fullname,
            email,
            password: hash,
            username
          }
        })

        user.save().then((u) => {
          return res.status(200).json(formatDatatoSend(u))
        })
        .catch((err) => {
          if(err.code === 11000) {
            return res.status(500).json({ "error" : "Email already exists"})
          }
          return res.status(500).json({ "error" : err.message})
        })
        
    })
})

server.post("/signin", (req, res) => {
  let {email, password} = req.body;

  User.findOne({ "personal_info.email" : email }).then((user) => {
    if(!user) {
      return res.status(404).json({ "error" : "User not found"})
    }

    if (user.google_auth) {
      return res.status(403).json({ "error" : "This email was signed up with Google. Please sign in with Google"})
    }

    bcrypt.compare(password, user.personal_info.password, (err, result) => {
      if(err) {
        return res.status(500).json({ "error" : "Error comparing password"})
      }

      if(result) {
        return res.status(200).json(formatDatatoSend(user))
      }

      return res.status(400).json({ "error" : "Invalid password"})
    })
  })
  .catch((err) => {
    return res.status(500).json({ "error" : err.message})
  })
})

server.post("/google-auth", (req, res) => {
  let {accessToken} = req.body;
  console.log(req.body)

  getAuth().verifyIdToken(accessToken)
  .then(async (decodedToken) => {

    let {email, name, picture} = decodedToken;

    picture = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email" : email })
    .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
    .then((u) => {
      return u || null;
    })
    .catch((err) => {
      return res.status(500).json({ "error" : err.message});
    })

    if(user) {
      if(!user.google_auth) {
        return res.status(403).json({ "error" : "This email was signed up without Google. Please sign in with email and password"})
      }}
      else {
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            username,
            profile_img: picture},
            google_auth: true
        })

        await user.save().then((u) => {
          user = u;
        })
        .catch((err) => {
          return res.status(500).json({ "error" : err.message})
        })    
    }
    return res.status(200).json(formatDatatoSend(user))
  })
  .catch((err) => {
    return res.status(500).json({ "error" : "Failed to authenticate with Google"})
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});