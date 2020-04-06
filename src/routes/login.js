var express=require('express');
const bcrypt = require('bcrypt');
var jwt =require('jsonwebtoken');
var SEED=require('../../config/config').SEED;


var app=express();

var Usuario=require('../models/user');

app.post('/',(req,res)=>{
    var body=req.body;
    Usuario.findOne({email:body.email},(err,userdb)=>{

        if(err){
            return  res.status(400).json({
              success:false,
              message:"error al buscar usuario",
              errors:err });
        }
        if(!userdb){
            return  res.status(400).json({
                success:false,
                message:"Credenciales incorrectas-email",
                errors:err });
        }
        if(!bcrypt.compareSync(body.password,userdb.password)){
            return  res.status(400).json({
                success:false,
                message:"Credenciales incorrectas-password",
                errors:err 
            });
        }
        //crear token!!
        userdb.password=':)';
        var token=jwt.sign({user:userdb},SEED,{expiresIn:14400}); //4horas


        res.status(200).json({
            success:true,
            id:userdb._id,
            token:token,
           user:userdb
        });
    })

   
})







module.exports=app;