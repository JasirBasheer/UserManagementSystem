const express = require('express')
const userRoute = express()
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session')
const config = require('../config/config')
const auth = require('../middleware/auth');
const nocache = require("nocache");

userRoute.set('view engine','ejs')
userRoute.set('views','./views/users')

userRoute.use(bodyParser.json())
userRoute.use(bodyParser.urlencoded({extended:true}))
userRoute.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized: false 

}))



userRoute.use('/static', express.static(path.join(__dirname, '../public')));


const userController = require('../controllers/userController'); 
userRoute.use(nocache())


//get 
userRoute.get('/register',auth.isLogout,userController.loadRegister);
userRoute.get('/',auth.isLogout,userController.loadLogin);
userRoute.get('/home',auth.isLogin,userController.loadHome);
userRoute.get('/logout',auth.isLogin,userController.userLogout);
userRoute.get('/edit',auth.isLogin,userController.editLoad)


 


//post  
userRoute.post('/register',userController.inserUser);
userRoute.post('/login',userController.verifyLogin);
userRoute.post('/edit',userController.updateProfile);



module.exports = userRoute; 