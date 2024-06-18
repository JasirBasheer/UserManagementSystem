const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user_management_system');

const express = require("express");
const path = require('path');
const app = express()
const port =3100;



//User Routes
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)



//Admin Routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)



app.listen(port,()=>console.log(`http://localhost:${port}`))   
