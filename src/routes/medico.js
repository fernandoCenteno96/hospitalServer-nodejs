var express=require('express');

var app=express();
var mdAuth=require('../middlewares/auth');

var Medico=require('../models/medico');
//============================
//obtener todos los medico
//============================

app.get('/',(req,res,next)=>{
    var desde=req.query.desde || 0;
    desde=Number(desde);
       Medico.find({})
       .populate('usuario','nombre email')
       .populate('hospital')
       .skip(desde).limit(5)
       .exec(
           (err,medicoes)=>{
               if(err){
                   return  res.status(500).json({
                       success:false,
                       message:"error con base de datos",
                       errors:err });
               }
               Medico.count({},(err,conteo)=>{
                res.status(200).json({
                    success:true,
                    medico:medicoes,
                    total:conteo
                 });

               });
              
           }


       );
});

//==========================
//actualizar medico
//==========================
app.put('/:id',mdAuth.verificaToken,(req,res)=>{
   var id=req.params.id;
   var body=req.body;
   Medico.findById(id,(err,medico)=>{

       if(err){
           return  res.status(500).json({
               success:false,
               message:"error al buscar medico",
               errors:err });
       }
       if(!medico){
           return  res.status(400).json({
               success:false,
               message:"el medico con el id " +id+" no existe",
               errors:{message:'no existe un medico con ese ID'} });
       }
       medico.nombre=body.nombre;
      medico.usuario=req.usuario._id;
      medico.hospital=body.hospital;

      medico.save((err,medicoSave)=>{

           if(err){
               return  res.status(400).json({
                   success:false,
                   message:"error al actualizar medico",
                   errors:err });
           } 
           
           res.status(200).json({
               success:true,
               medico:medicoSave
           });



       });
   });

});
//==========================
//crear nuevo  medico 
//==========================
app.post('/',mdAuth.verificaToken,(req,res)=>{
    var body=req.body;
    
  
   var medico=new Medico({
       nombre:body.nombre,
       usuario:req.usuario._id,
       hospital:body.hospital
   });
   medico.save((err,medicoSave)=>{
       if(err){
           return  res.status(400).json({
             success:false,
             message:"error al crear medico",
             errors:err ,
            req:req.usuario});
         }
         res.status(201).json({
           success:true,
           medico:medicoSave
       });
   });
});

//==========================
//borrar nuevo  medico 
//==========================
app.delete('/:id',mdAuth.verificaToken,(req,res)=>{
   var id=req.params.id;

   Medico.findOneAndRemove(id,(err,medicoDelete)=>{



       if(err){
           return  res.status(500).json({
               success:false,
               message:"error al borrar medico",
               errors:err });
       } 
       if(!medicoDelete){
           return  res.status(400).json({
               success:false,
               message:"no existe un medico con ese id",
               errors:{message:'el id no existe'}});
       }
       res.status(200).json({
           success:true,
           medico:medicoDelete
       });

   })

});

module.exports=app;