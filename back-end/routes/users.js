var express = require('express');
var router = express.Router();
var AdminModel = require('../Models/AdminLoginModel')
var mongoose = require('mongoose');
var BoardModel = require('../Models/BoardSelectionModel')

mongoose.connect('mongodb://localhost/admin_panel')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/admin-login' , async (req , res) => {
  let data = req.body
  
  console.log(data);

  let foundAuth = await AdminModel.findOne({})

  console.log(foundAuth);

  if(foundAuth.length === 0){
    let LoginModel = await AdminModel.insertMany(data)

    res.json({message:'Login Success' , success:true})
    return;
  }else{
    let user = foundAuth['userName']
    let pass = foundAuth['passWord']

    if(user === data['userName'] && pass === data['passWord']){
      res.json({message:'Login Success' , success:true})
    }else{
      res.json({message:'Invalid UserName or PassWord' , success:false})
    }

    return;
  }


})

router.post('/board_selection' , async (req , res) => {
  let data = req.body
  var foundAuth = await AdminModel.findOne({}) 
  if(foundAuth['userName'] === data['userName'] && foundAuth['passWord'] === data['passWord']){
    var foundBoard = await BoardModel.findOne({} , {_id:0})
    res.json({message:foundBoard , success:true})
  }else{
    res.json({message:'Please Check UserName and PassWord' , success:false})
  }
})

module.exports = router;
