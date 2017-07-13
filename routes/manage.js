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
    

    getListItems('restaurant_list/'+targetList).then(function(){
        var l = Object.keys(res_list).map(function(k) { return res_list[k] });
        res.send({data: l});
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

router.post('/deleteItem',function(req,res,next){
    var targetList = req.body.targetList
    var name = req.body.name;
    var address = req.body.address;
    var api = 'restaurant_list/'+targetList;
    firebaseDB.ref(api).orderByChild('restaurant_name').equalTo(name).once('value').then(function(snapshot){
        //console.log(targetList)
        var childKey;
        if(snapshot.numChildren() > 1)
            snapshot.forEach(function(childSnapshot) {
                if(childSnapshot.child('address').val() == address)
                    childKey = childSnapshot.key;
            });
        else
            childKey = Object.keys(snapshot.val())[0]
        
        if(typeof childKey != 'undefined'){
            api += "/"+childKey;
            firebaseDB.ref(api).remove().then(function(){
                res.send("OK");
            });
        }
        
    })
    
})

router.get('/testapi/:list/:name',function(req, res, next) {
    return firebaseDB.ref('restaurant_list/'+req.params.list).orderByChild('restaurant_name').equalTo(req.params.name).once('value').then(function(snapshot){
        var childKey;
        var cS;
        snapshot.forEach(function(childSnapshot) {
            childKey = childSnapshot.key;
            cS = childSnapshot
            console.log(childKey)
            return;
        });
        
        res.send(cS); 
        
    })
   /* var newContent = {
        address: "123",
        restaurant_name: "123",
        status: 'disable',
        id: 2
    }
   firebaseDB.ref('restaurant_list/中菜/-Kofixb3N0UUS-nvwiw8').update(newContent);
   res.send("su");*/
})

function writeRestaurantData(rname,raddress,status,list){
    var newRecordRef = firebaseDB.ref('restaurant_list/'+list).push();
    newRecordRef.set({
        restaurant_name: rname,
        address: raddress,
        status: status
    });
}

function getListItems(api){
    return firebaseDB.ref(api).once('value').then(function(snapshot){
        res_list = snapshot.val(); 
    })
}

function deleteItem(api){
    firebaseDB.ref(api).remove();
}
module.exports = router;
