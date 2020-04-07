 var express=require('express');

 var app=express();
 var mdAuth=require('../middlewares/auth');

 var Hospital=require('../models/hospital');
 var user=require('../models/user');
//============================
//obtener todos los hospitales
//============================

app.get('/',(req,res,next)=>{
        var desde=req.query.desde || 0;
        desde=Number(desde);


        Hospital.find({})
        .populate('usuario','nombre email')
        .skip(desde).limit(5)
        .exec(
            (err,hospitales)=>{
                if(err){
                    return  res.status(500).json({
                        success:false,
                        message:"error con base de datos",
                        errors:err });
                }
                Hospital.count({},(err,conteo)=>{
                    res.status(200).json({
                        success:true,
                        hospital:hospitales,
                        total:conteo
                    });

                });
               
            }


        );
});

//==========================
//actualizar hospital
//==========================
app.put('/:id',mdAuth.verificaToken,(req,res)=>{
    var id=req.params.id;
    var body=req.body;
    Hospital.findById(id,(err,hospital)=>{

        if(err){
            return  res.status(500).json({
                success:false,
                message:"error al buscar hospital",
                errors:err });
        }
        if(!hospital){
            return  res.status(400).json({
                success:false,
                message:"el hospital con el id " +id+" no existe",
                errors:{message:'no existe un hospital con ese ID'} });
        }
        hospital.nombre=body.nombre;
       hospital.usuario=req.usuario._id;
       hospital.save((err,hospitalSave)=>{

            if(err){
                return  res.status(400).json({
                    success:false,
                    message:"error al actualizar hospital",
                    errors:err });
            } 
            
            res.status(200).json({
                success:true,
                hospital:hospitalSave
            });



        });
    });

});
//==========================
//crear nuevo  hospital 
//==========================
app.post('/',mdAuth.verificaToken,(req,res)=>{

    var body=req.body;
    user=req.usuario;
    var hospital=new Hospital({
        nombre:body.nombre,
        usuario:req.usuario._id
    });
   
    hospital.save((err,hospitalSave)=>{
        if(err){
            return  res.status(400).json({
              success:false,
              message:"error al crear hospital",
              errors:err });
          }
          res.status(201).json({
            success:true,
            hospital:hospitalSave,
            
            
        });
    });
});

//==========================
//borrar nuevo  hospital 
//==========================
app.delete('/:id',mdAuth.verificaToken,(req,res)=>{
    var id=req.params.id;

    Hospital.findOneAndRemove(id,(err,hospitalDelete)=>{



        if(err){
            return  res.status(500).json({
                success:false,
                message:"error al borrar hospital",
                errors:err });
        } 
        if(!hospitalDelete){
            return  res.status(400).json({
                success:false,
                message:"no existe un hospital con ese id",
                errors:{message:'el id no existe'}});
        }
        res.status(200).json({
            success:true,
            hospital:hospitalDelete
        });

    })

});

 module.exports=app;