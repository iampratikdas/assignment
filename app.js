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

app.use((req,res, next)=>{
  let authorization = req.get('Authorization');
  if(req.path == '/api/user/login' && !authorization){
    next();
  }else if(authorization){
    next();
  }else{
    res.send({"msg": "Please Log in first"})
  }
})


// Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.single('file'));




// Routes 
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/question', questionRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

