const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

// const { connection } = require('./controlers/db');

const usersRoute = require('./routes/users');
const contactRoute = require('./routes/contact');
const recommendRoute = require('./routes/recommend');
const assetsRoute = require('./routes/media');
const videosRoute = require('./routes/videos');
const path = require("path");

const { uploadFiles } = require('./controlers/uploadAssets');

const mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("conected to DB"))
  .catch(error =>console.log(error));
  
// connect to db
// connection.connect((err) => {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
//     console.log('connected as id ' + connection.threadId);
//   });
//   connection.end();

   

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/users', usersRoute);
app.use('/api/contact', contactRoute);
app.use('/api/recommend', recommendRoute);
app.use('/api/media', assetsRoute);
app.use('/api/videos', videosRoute);

// trieng to load the client from server
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

app.get('*', (req, res, next) => {
  console.log('req.baseUrl',req.baseUrl)
  if(req.baseUrl.includes('api')){
    res.sendFile(`${buildPath}/index.html`);
  } else{
    next()
  }
})


const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})