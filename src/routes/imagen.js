var express=require('express');
var app=express();
const path =require('path');
var fs = require('fs');
app.get('/:tipo/:img',(req,res,next)=>{
    
    var tipo=req.params.tipo;
    var img=req.params.img;
    
    var pathImg=path.resolve( __dirname, `../../upload/${tipo}/${img}` );
    
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);

    }else{
        var pathnoimg=path.resolve(__dirname,'../../assets/no-img.jpg');
        res.sendFile(pathnoimg);
    }

  
});


module.exports=app;