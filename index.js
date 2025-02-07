const express = require('express');
const connectDB = require('./config/db');
const xlsx = require('xlsx');
const multer = require('multer');

const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const fileUpload = require('express-fileupload');
const studentRoutes = require("./routes/studentRoutes");




require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); 
app.get("/", (req, res) => {
  res.redirect("/register");
});








app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(fileUpload({
  useTempFiles: true,   // Optional, but helps with large file uploads
  tempFileDir: '/tmp/', // Optional, change as needed
}));



app.use('/', authRoutes);
app.use('/home', homeRoutes);
app.use("/", studentRoutes); 

const generatePassword = () => {
  return crypto.randomBytes(6).toString('hex'); 
};



connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to database:', err);
});


