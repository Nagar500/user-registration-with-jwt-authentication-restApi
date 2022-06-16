const jwt = require('jsonwebtoken')
const UserModel = require('../models/User.js')

var checkUserAuth = async (req,res,next)=>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
      try{
        // GET TOKEN FROM HEADER
      token = authorization.split(' ')[1]

      // varifying Token
      const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // GET USER FROM TOKEN
      req.user = await UserModel.findById(userID).select('-password')
      next()
      }catch(err){
        res.send({ 'status': 'Failed', 'message': 'Unauthorized user' })
      }
    }
    if(!token){
        res.send({ 'status': 'Failed', 'message': 'unauthorized user, No Token' })
    }
}

module.exports = checkUserAuth