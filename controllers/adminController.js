const User = require('../models/userModel');
const bcrypt = require('bcrypt')

const loadAdmin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }

}
const verifyLogin = async(req,res)=>{
    try {
        const {email, password}=req.body
        const userData = await User.findOne({email:email});

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)

            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render("login",{message:"You are not admin"})
                }else{
                    req.session.admin_id = userData._id;
                    res.redirect("/admin/home")
                    
                }

            }else{
                res.render('login',{message:"Password is not correct"})
            }

        }else{
            res.render('login',{message:"Email is not correct"})

        }

        
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req,res)=>{
    try {
        const adminData = await User.findById({_id:req.session.admin_id})
        const userData = await User.find({is_admin:0})
        const adminsData = await User.find({is_admin:1})

        res.render('home',{users:userData,admin:adminData,admins:adminsData})
    } catch (error) {
        console.log(error.message);
    }
}


const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin')
        
    } catch (error) {
        console.log(error.message);
        
    }
}



///Create New user

const loadNewUser = async (req,res)=>{
    try {
        res.render('new-user')
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
        
    } catch (error) {
        console.log(error.message);
        
    }

}

const createNewUser = async(req,res)=>{
    try {
        const {name , email ,password} =  req.body

        if(name ==""){
            return res.render('new-user',{message:"Please enter a valid User Name"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('new-user', { message: "Please enter a valid email",title:"Sign Up" });
        }

        if (password.length < 6) {
            return res.render('new-user', { message: "Password should be at least 6 characters long" });
            
        }
        const checkUserexists = await User.findOne({email:email})

        if(checkUserexists==null){

            const spassword = await securePassword(password)
            const user = new User({
                name:name,
                email:email,
                password:spassword,
                is_admin:0
            });  
    
            const userData = await user.save();
    
    
            if(userData){
                
                res.render('new-user', { success: "New user created"});
               
               
            }else{
                res.render('new-user',{message:"regisistarion fialed" })
    
            }
        }else{
            res.render('new-user',{message:"User already exists" })


        }

 

    } catch (error) {
        console.log(error.message);
    }
}


const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id})
        if(userData){
            res.render('edit-user',{user:userData})
        }else{
            res.redirect('/admin/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    try {
       const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email}})
        res.redirect('/admin/home')
    } catch (error) {
        console.log(error.message);
    }
}

const deleteUsers =async(req,res)=>{
    try {
        const id = req.query.id;
       await User.deleteOne({_id:id})
       res.redirect('/admin/home')
    } catch (error) {
        console.log(error.message);
    }

}

const loadCreateAdmin = async (req,res)=>{
    try {
        res.render('createAdmin')
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const createAdmin = async(req,res)=>{
    try {
        const {name , email , password} = req.body;


        if(name ==""){
            return res.render('createAdmin',{message:"Please enter a valid Name"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('createAdmin', { message: "Please enter a valid email",title:"Sign Up" });
        }

        if (password.length < 6) {
            return res.render('createAdmin', { message: "Password should be at least 6 characters long" });
            
        }

        const adminexists = await User.findOne({email:email,is_admin:1})

        if(adminexists ==null){
            const spassword = await securePassword(password)
            const user = new User({
                name:name,
                email:email,
                password:spassword,
                is_admin:1
            });  
    
            const userData = await user.save();
    
    
            if(userData){
                
                res.render('createAdmin', { success: "New Admin created"});
               
               
            }else{
                res.render('createAdmin',{message:"regisistarion fialed" })
    
            }
        }else{
            res.render('createAdmin',{message:"Admin already exists" })


        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
loadAdmin,
verifyLogin,
loadDashboard,
logout,
loadNewUser,
createNewUser,
editUserLoad,
updateUsers,
deleteUsers,
loadCreateAdmin,
createAdmin,


}