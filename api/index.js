const express = require('express');
const collection = require("./db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const downloader = require('image-downloader');
const multer = require('multer');
const Place = require('./models/Places.js')
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'))
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(cors(
   {
    credentials: true,
    origin: 'http://127.0.0.1:5173',
   }
))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/test', (req,res) => {
    res.json('test ok!');
});

app.post("/register", async(req,res) =>{
    const{name,email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }
    const data = {
        name:name,
        email:email,
        password:bcrypt.hashSync(password, bcryptSalt),
    }
    try {
        const check  = await collection.findOne({email:email});

        if(check){
            res.json("exists");
        }else{
            await collection.insertMany([data]);
            res.json("notexists");
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
})

//login 
app.post("/login", async(req,res) =>{
    const {email,password} = req.body;
    const userDoc = await collection.findOne({email});
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id,
          name:userDoc.name,
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token, {httpOnly: true}).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.json('not found');
    }
})

app.get('/profile',(req,res)=>{
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await collection.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
})

app.post('/logout',(req,res) =>{
  res.cookie('token', '').json(true);
});

app.post('/uploadLink', async(req,res) =>{
  const {link} = req.body;
  const newName = 'photo'+ Date.now() + '.jpg';
  const destPath = __dirname + '/uploads/' + newName;
  console.log(destPath);
  await downloader.image({
    url: link,
    dest: destPath
  });
  res.json(newName);
})
const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload',photosMiddleware.array('photos',100),(req,res) => {
  const uploadedFiles = [];
  for (let i=0; i < req.files.length; i++)
  {
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    }); // <-- added closing curly brace for jwt.verify callback function
  }
});


app.listen(4000, () => {
    console.log('Server running on port 4000');
});
