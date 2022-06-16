const express = require('express')
const router = express.Router()
const UserController = require( '../controllers/userController.js')
const checkUserAuth = require('../middlware/auth-middleware.js')

//Route level middlware - to protect routr
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

//public route
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

//private route(protected route)
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)


module.exports = router