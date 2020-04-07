var express=require('express');
const bcrypt = require('bcrypt');
var jwt =require('jsonwebtoken');
var app=express();
var SEED=require('../../config/config').SEED;
var mdAuth=require('../middlewares/auth');



var Usuario=require('../models/user');



//==========================
//obtener todos los usuarios 
//==========================
app.get('/',(req,res,next)=>{

    var desde=req.query.desde || 0;
    desde=Number(desde);
    Usuario.find({},
        'nombre email img role apellido')
        .skip(desde)
        .limit(5)
        .exec(
        (err,users)=>{
        if(err){
          return  res.status(500).json({
            success:false,
            message:"error con base de datos",
            errors:err });
        }
        Usuario.count({},(err,conteo)=>{

            res.status(200).json({
            success:true,
            usuario:users,
            total:conteo
            });
        });
        
    });

    
});


//==========================
//actualizar nuevo  usuarios 
//==========================
app.put('/:id',mdAuth.verificaToken,(req,res)=>{
    var id=req.params.id;
    var body=req.body;
    Usuario.findById(id,(err,usuario)=>{

        if(err){
            return  res.status(500).json({
                success:false,
                message:"error al buscar usuario",
                errors:err });
        }
        if(!usuario){
            return  res.status(400).json({
                success:false,
                message:"el usuario con el id " +id+" no existe",
                errors:{message:'no existe un usuario con ese ID'} });
        }
        usuario.nombre=body.nombre;
        usuario.apellido=body.apellido;
        usuario.role=body.role;
        usuario.save((err,userSave)=>{

            if(err){
                return  res.status(400).json({
                    success:false,
                    message:"error al actualizar usuario",
                    errors:err });
            } 
            userSave.password=':)';
            res.status(200).json({
                success:true,
                usuario:userSave
            });



        });
    });

});
//==========================
//crear nuevo  usuarios 
//==========================
app.post('/',mdAuth.verificaToken,(req,res)=>{

    var body=req.body;

    var user=new Usuario({
        nombre:body.nombre,
        apellido:body.apellido,
        email:body.email,
        password:  bcrypt.hashSync(body.password, 10),
        img:body.img,
        role:body.role
    });
    user.save((err,userSave)=>{
        if(err){
            return  res.status(400).json({
              success:false,
              message:"error al crear usuario",
              errors:err });
          }
          res.status(201).json({
            success:true,
            usuario:user
        });
    });
});

//==========================
//borrar nuevo  usuarios 
//==========================
app.delete('/:id',mdAuth.verificaToken,(req,res)=>{
    var id=req.params.id;

    Usuario.findOneAndRemove(id,(err,userDelete)=>{



        if(err){
            return  res.status(500).json({
                success:false,
                message:"error al borrar usuario",
                errors:err });
        } 
        if(!userDelete){
            return  res.status(400).json({
                success:false,
                message:"no existe un usuario con ese id",
                errors:{message:'el id no existe'}});
        }
        res.status(200).json({
            success:true,
            usuario:userDelete
        });

    })

});

module.exports=app;