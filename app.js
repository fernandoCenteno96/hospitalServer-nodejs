//requires 
const express=require('express');
var mongoose=require('mongoose');

//iniciar variables

const app =express();
//conexion base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{useNewUrlParser: true,useUnifiedTopology: true},(err,res)=>{
    
    if(err)throw err;
    
    console.log('base de datos online');
    
});
//rutas
app.get('/',(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"peticion realizaca completamente"
    });
});



//escuchar peticiones

app.listen(3000,()=>{
    console.log('servidor corriendo en el puerto 3000 online');
});

