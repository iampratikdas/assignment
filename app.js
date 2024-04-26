const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.single('file'));

app.use(function (req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) {
    if ( req.path === '/api/user/login' ){
      next();
    }else{
      res.send({ "msg": "Please log in" })
    }
  } else {
    if ( req.path === '/api/category/list' || req.path === '/api/category/create' || req.path === '/api/question/create' || req.path === '/api/question/list' || req.path === '/api/question/addbulkquestion') {
      next();
    }
  }

});


// Routes 
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/question', questionRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

