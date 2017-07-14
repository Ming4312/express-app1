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
var res_list = [];

var listKeyName = [];

var baseURL = 'restaurant_list/';

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
    

    getListItems(baseURL+targetList).then(function(){
        //var l = Object.keys(res_list).map(function(k) { return res_list[k] });
        
        res.send({data: res_list});
    })
    
   
})

router.post('/createNewRecord/:targetList',function(req,res,next){
    var rname = req.body.name;
    var raddress = req.body.address;
    var status = req.body.status;
    var targetList = req.params.targetList;
    writeRestaurantData(rname,raddress,status,targetList);
    res.redirect('back');
})

router.post('/updateRecord/:targetList',function(req, res, next) {
    var targetList = req.params.targetList;
    var rname = req.body.name;
    var raddress = req.body.address;
    var status = req.body.status; 
    var key = req.body.pkey;
    console.log(key)
    var data={
        restaurant_name: rname, 
        address: raddress,
        status: status
    }
    firebaseDB.ref(baseURL+'/'+targetList + '/' + key).update(data)
    res.redirect('back')
})

router.post('/deleteItem',function(req,res,next){
    var targetList = req.body.targetList
    var name = req.body.name;
    var address = req.body.address;
    var api = baseURL+targetList + "/" + req.body.key;
    firebaseDB.ref(api).remove().then(function(){
        res.send("OK");
    });
 
})

function writeRestaurantData(rname,raddress,status,list){
    var newRecordRef = firebaseDB.ref(baseURL+list).push();
    newRecordRef.set({
        restaurant_name: rname,
        address: raddress,
        status: status
    });
}

function getListItems(api){
    return firebaseDB.ref(api).once('value').then(function(snapshot){
        res_list = [];
        snapshot.forEach(function(childSnapshot){
        
            res_list.push({
                key: childSnapshot.key,
                restaurant_name: childSnapshot.child('restaurant_name').val(),
                status: childSnapshot.child('status').val(),
                address: childSnapshot.child('address').val()
            })
        })
        
    })
}

function deleteItem(api){
    firebaseDB.ref(api).remove();
}
module.exports = router;
