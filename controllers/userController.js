const UserModel = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const transporter = require('../config/emailConfig.js')

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, confirm_password, tc } = req.body
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.send({ 'status': 'Failed', 'message': 'Email Allready Exist' })
        }
        else {
            if (name && email && password && confirm_password && tc) {
                if (password === confirm_password) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({ email: email })
                        // Generate JWT Token
                        const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.status(201).send({ 'status': 'Success', 'message': 'Registration Successfull', 'token': token })
                    }
                    catch {
                        res.send({ 'status': 'Failed', 'message': 'unable to register' })
                    }
                }
                else {
                    res.send({ 'status': 'Failed', 'message': 'password and confirm password dosent match' })
                }
            }
            else {
                res.send({ 'status': 'Failed', 'message': 'all field are required' })
            }
        }
    }
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatch) {
                        //genrate JWT Token
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.send({ 'status': 'Sucess', 'message': 'Sucessfully Login', 'token': token })
                    }
                    else {
                        res.send({ 'status': 'Failed', 'message': 'Email and Password not valid' })
                    }
                }
                else {
                    res.send({ 'status': 'Failed', 'message': 'you are not Registered user' })
                }
            }
            else {
                res.send({ 'status': 'Failed', 'message': 'all fields are require' })
            }
        } catch (err) {
            res.send({ 'status': 'Failed', 'message': 'unable to Login' })
        }
    }
    static changeUserPassword = async (req, res) => {
        const { password, confirm_password } = req.body
        if (password && confirm_password) {
            if (password !== confirm_password) {
                res.send({ 'status': 'Failed', 'message': 'new password and confirm password dosent match' })
            }
            else {
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(req.user._id, {$set:{password:newHashPassword}})
                res.send({ 'status': 'Success', 'message': 'password changed successfully' })
            }
        }
        else {
            res.send({ 'status': 'Failed', 'message': 'all fields are required' })
        }
    }
   static loggedUser = async (req,res)=>{
    res.send({'user':req.user})
   }
   static sendUserPasswordResetEmail = async (req,res)=>{
    const {email} = req.body
    if(email){
      const user = await UserModel.findOne({email:email})
      
      if(user){
        const secret = user._id + process.env.JWT_SECRET_KEY
     const token = jwt.sign({userID:user._id}, secret, {expiresIn:'15m'})
     const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
     console.log(link)
     //SEND EMAIL
     let info = await transporter.sendMail({
      from:process.env.EMAIL_FROM,
      to:user.email,
      subject:"nagar - password reset link",
      html:`<a href=${link}>click hear</a> to reset your password`
     })
     res.send({ 'status': 'Failed', 'message': 'password reset Email sent...please check your email', 'info':info })
      }else{
        res.send({ 'status': 'Failed', 'message': 'Email does not Exist' })
      }
    }else{
        res.send({ 'status': 'Failed', 'message': 'Email field is Required' })
    }
   }
   static userPasswordReset = async (req,res)=>{
    const {password, confirm_password} = req.body
    const {id, token} = req.params
    const user = await UserModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try{
     jwt.verify(token, new_secret)
     if(password, confirm_password){
        if(password !== confirm_password){
            res.send({ 'status': 'Failed', 'message': 'new password and confirm new password dosent match' })
        }else{
            const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(user._id, {$set:{password:newHashPassword}})
                res.send({ 'status': 'Success', 'message': 'password reset successfully' })
        }
     }else{
        res.send({ 'status': 'Failed', 'message': 'All fields are Required' })
     }
     res.send({ 'status': 'Failed', 'message': 'Invalid Token' })
    }catch(err){

    }
   }
}
 
module.exports = UserController