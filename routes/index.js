//global variable
var express = require('express');
var router = express.Router();

var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyDfimQpQ1h8WhT36APb27sHR0LgQqO7B9U",
    authDomain: "eatwhat-47e09.firebaseapp.com",
    databaseURL: "https://eatwhat-47e09.firebaseio.com",
    projectId: "eatwhat-47e09",
    storageBucket: "eatwhat-47e09.appspot.com",
    messagingSenderId: "228670440037"
};
firebase.initializeApp(config);
var firebaseDB = firebase.database();
//var firebaseRef = firebaseDB.ref('restaurant_list/list1');
var res_list = {};
var currentUser = null;



//end global variable

//firebase 


firebase.auth().onAuthStateChanged(function(user) {
    
    currentUser = user
});
router.use(function(req,res,next){
    
    if(req.session.authenticated)
        res.locals.isLogin = true
    else
        res.locals.isLogin = false
    
    next();
})



router.use('/',function(req,res,next){
    next();
})

router.use('/manage',function(req,res,next){
    if(req.session.authenticated)
        next()
    else
        res.redirect('/users/login')
    next()
});


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', {title: "Home", content: "Welcome"});
});
router.get('/manage',function(req, res, next) {
    getList('restaurant_list/').then(function() {
        res.render('resList', {title: "Manage",res_list:res_list});
    })
})
router.get('/manage/:targetList', function(req, res, next) {
    var targetList = req.params.targetList;
 
    getList('restaurant_list/'+targetList).then(function(){
        res.render('managePage', {title: targetList, res_list: res_list});
    })
    
    
});
function getList(api){
    return firebaseDB.ref(api).once('value').then(function(snapshot){
        res_list = snapshot.val()   
        console.log("get List")
    })
}
module.exports = router;
