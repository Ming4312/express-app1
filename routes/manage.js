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
//firebase.initializeApp(config);
var firebaseDB = firebase.database();
//var firebaseRef = firebaseDB.ref('restaurant_list/list1');
var res_list = {};

var listKeyName = [];


//end global variable

//firebase 


router.use('/',function(req,res,next){
    if(req.session.authenticated)
        next()
    else
        res.redirect('/users/login')
    
    //next()
})


router.get('/',function(req, res, next) {
    res.render('resList', {title: "Manage"});
   // getResList().then(function() {
        //var l = Object.keys(res_list).map(function(k) { return res_list[k] });
        //console.log(res_list)
        
    //})
})
router.get('/:targetList', function(req, res, next) {
    var targetList = req.params.targetList;
    res.locals.currentList = targetList;
    res.render('managePage', {title: targetList, target: targetList});
    /*getList('restaurant_list/'+targetList).then(function(){
        res.render('managePage1', {title: targetList, res_list: res_list});
        
    })*/
    
});
router.get('/getResList/:targetList', function(req, res, next) {
    var targetList = req.params.targetList;
    

    getList('restaurant_list/'+targetList).then(function(){
        var l = Object.keys(res_list).map(function(k) { return res_list[k] });
        res.send({data: l});
    })
    
   
})

router.post('/createNewRecord/:targetList',function(req,res,next){
    var rname = req.body.name;
    var raddress = req.body.address;
    var targetList = req.params.targetList;
    writeRestaurantData(rname,raddress,targetList);
    res.redirect('back');
})
router.post('/createNewList',function(req,res,next){
    var listname = req.body.listname
    writeRestaurantList(listname)
    res.redirect('back')
    
})

function writeRestaurantList(listname){
    var newListRef = firebaseDB.ref('restaurant_list/'+listname).push()
    newListRef.set({
        
    })
}

function writeRestaurantData(rname,raddress,list){
    var newRecordRef = firebaseDB.ref('restaurant_list/'+list).push();
    newRecordRef.set({
        restaurant_name: rname,
        address: raddress
    });
}

function getList(api){
    return firebaseDB.ref(api).once('value').then(function(snapshot){
        console.log(snapshot.key)
        res_list = snapshot.val(); 
        
    })
}
function getResList(){
    return firebaseDB.ref('restaurant_list/').once('value').then(function(snapshot){
        var keys = []
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            keys.push(key);
        })
        listKeyName = keys;
    })
}
module.exports = router;
