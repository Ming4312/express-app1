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

router.use(function(req,res,next){
    if(req.session.authenticated)
        res.locals.isLogin = true
    else
        res.locals.isLogin = false
    //console.log(res.locals.isLogin)
    next();
})

router.use('/',function(req,res,next){
    /*if(req.session.authenticated)
        res.locals.isLogin = true
    else
        res.locals.isLogin = false
    */
    getResList(res).then(function(){
        next();
    })
})

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', {title: "Home", content: "Welcome"});
});

router.get('/random',function(req,res,next){
    
    res.render('random', {title: "Random", content: "select one list"})
    
    
})
router.get('/getRandomItem/:list',function(req, res, next) {
    var list = req.params.list;
    return firebaseDB.ref('restaurant_list/'+list).orderByChild('status').startAt('enable').once('value').then(function(snapshot){
   
       var js = [];
       snapshot.forEach(function(childSnapshot){
          js.push({restaurant_name: childSnapshot.child('restaurant_name'), address: childSnapshot.child('address')});
       })
      
       var pos = parseInt(Math.random()*js.length)
       //console.log(js[pos])
       res.send(js[pos])
    })
})


function getResList(res){
    return firebaseDB.ref('restaurant_list/').once('value').then(function(snapshot){
        var keys = []
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            keys.push(key);
        })
         res.locals.listoption = keys;
    })
}

module.exports = router;
