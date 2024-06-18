const User = require('../models/userModel');
const bcrypt = require('bcrypt');



// Sign up methods

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
        
    } catch (error) {
        console.log(error.message);
        
    }

}

const loadRegister = async (req,res)=>{
    try {
        res.render('registration',{title:"Sign Up"})
        
    } catch (error) {
        console.log(error.message);
    }
}

const inserUser = async(req,res)=>{
    try {
        const { name, email, password } = req.body;

        if (name =="") {
            console.log("dfsafsd");
            return res.render('registration', { message: "Please enter a valid user name",title:"Sign Up"});
            
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('registration', { message: "Please enter a valid email",title:"Sign Up" });
        }

        if (password.length < 6) {
            return res.render('registration', { message: "Password should be at least 6 characters long" });
            
        }

        const checkUserexists =await User.findOne({email:email})

        if(checkUserexists == null){

        const spassword = await securePassword(password)
        const user = new User({
            name:name,
            email:email,
            password:spassword,
            is_admin:0
        });  
          
        const userData = await user.save();

        if(userData){
            res.redirect('/')
        }else{
            res.render('registration',{message:"regisistarion fialed" ,title:"Sign Up"})

        } 
        }else{
            res.render('registration',{message:"User already exists" ,title:"Sign Up"})


        }

        
    } catch (error) {
        console.log(error.message);
    }
}



// Login methods


const loadLogin = async(req,res)=>{
    try {
        res.render('login',{title:"Login"})
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const {email,password} = req.body
        
        const userData = await User.findOne({email:email})

        if(userData){
            const passwordMatch =  await bcrypt.compare(password,userData.password)

            if(passwordMatch){
                req.session.user_id=userData._id;
                res.redirect('/home')

            }else{
                res.render('login',{title:"Login",message:"Password is not correct"})
            }

        }else{
            res.render('login',{title:"Login",message:"User does not exists"})
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}



//Home 


const loadHome = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        if(!userData){
            return res.status(404).send('User not found');
        }
        res.render('home', { user: userData ,title:"Home Page"});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }
}






//Logout

const userLogout =async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')

        
    } catch (error) {
        console.log(error.message);
        
    }
}


//Edit and Update user

const editLoad = async (req, res) => {
    try {
        const id = req.query.id;

        const userData = await User.findById({_id:id});

        if (userData) {
            res.render('edit', { user: userData ,title:"Edit Profile"});
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};


const updateProfile = async(req,res)=>{
    try{

        const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
        res.redirect('/home')

    }catch(error){
        console.log(error.message)
    }
}



module.exports = {
    loadRegister,
    inserUser,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile,
}