var express = require('express');
var router = express.Router();
var firebase = require("firebase");



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
   
    res.render('register', {title: 'Register Form'})
});
router.get('/login', function(req, res, next) {
 
    res.render('login', {title: "Login Form"})
});
router.get('/logout', function(req, res, next) {
    firebase.auth().signOut().then(function() {
        delete req.session.authenticated;
        //res.locals.isLogin = false;
        res.redirect("/");
        
    // Sign-out successful.
    }).catch(function(error) {
        console.log(error.code)
      // An error happened.
    });
   
});
router.post('/getSignUpInfo', function(req, res){
    var email = req.body.email
    var pwd = req.body.pwd
    firebase.auth().createUserWithEmailAndPassword(email, pwd).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      var errorMessage = error.message;
      // ...
    });
    req.session.authenticated = true;
    res.redirect('/')
});
router.post('/getSignInInfo', function(req, res){
    var email = req.body.email
    var pwd = req.body.pwd
    firebase.auth().signInWithEmailAndPassword(email, pwd).then(function(){
        req.session.authenticated = true;
        //res.locals.pageVar.isLogin = true;
        res.redirect('/')
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      
      var errorMessage = error.message;
      console.log(errorMessage);
      req.flash('error', errorMessage);
      res.render('login',{title: "Login Form", error: req.flash('error')});
      // ...
    });
    
    
});
module.exports = router;
