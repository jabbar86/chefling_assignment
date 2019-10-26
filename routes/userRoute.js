var express = require("express");
const router = express.Router();

//Importing Controller

var userController = require('./../controllers/user');

router
    .route('/createUserTable')
    .post(userController.createusertable);

router
    .route('/signUp')
    .post(userController.signup);

router
    .route('/signIn')
    .post(userController.signin)

router
    .route('/getUserProfile')
    .post(userController.getuserprofile);

router
    .route('/updateUserProfile')
    .post(userController.updateuserprofile);

router
    .route('/addShoppingList')
    .post(userController.addshoppinglist);

module.exports = router;