const express = require('express')
const adminRoute = express()
const session = require('express-session')
const config = require('../config/config')
const auth = require('../middleware/adminAuth')
const nocache = require('nocache')

const path = require('path');
const bodyParser = require('body-parser');
const adminController = require('../controllers/adminController')
adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')


adminRoute.use(bodyParser.json())
adminRoute.use(bodyParser.urlencoded({extended:true})) 
adminRoute.use('/static', express.static(path.join(__dirname, '../public')));
adminRoute.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized: false 

}))
adminRoute.use(nocache())


adminRoute.get('/',auth.isLogout,adminController.loadAdmin);

adminRoute.get('/home',auth.isLogin,adminController.loadDashboard)

adminRoute.post('/',auth.isLogout,adminController.verifyLogin)
adminRoute.get('/logout',adminController.logout)


adminRoute.get('/new-user',auth.isLogin,adminController.loadNewUser)

adminRoute.post('/new-user',auth.isLogin,adminController.createNewUser)

adminRoute.get('/edit-user',auth.isLogin,adminController.editUserLoad)

adminRoute.post('/edit-user',auth.isLogin,adminController.updateUsers)

adminRoute.get('/delete-user',auth.isLogin,adminController.deleteUsers)

adminRoute.get('/addnewadmin',auth.isLogin,adminController.loadCreateAdmin)

adminRoute.post('/addnewadmin',auth.isLogin,adminController.createAdmin)

adminRoute.get('/search',auth.isLogin,adminController.search)

adminRoute.get('*',(req,res)=>{
    res.redirect('/admin')
})


module.exports = adminRoute; 