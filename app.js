//requires 
const express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');

//iniciar variables

const app =express();


//body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())




//importar rutas
var appRoute=require('./src/routes/app');
var userRoute=require('./src/routes/user');
var loginRoute=require('./src/routes/login');
var medicoRoute=require('./src/routes/medico');
var hospitalRoute=require('./src/routes/hospital');
var busquedaRoute=require('./src/routes/busqueda');
var uploadRoute=require('./src/routes/upload');
var imgRoute=require('./src/routes/imagen');

//conexion base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{useNewUrlParser: true,useUnifiedTopology: true},(err,res)=>{
    
    if(err)throw err;
    
    console.log('base de datos online');
    
});
//rutas
app.use('/user',userRoute);
app.use('/login',loginRoute);
app.use('/medico',medicoRoute);
app.use('/hospital',hospitalRoute);
app.use('/busqueda',busquedaRoute);
app.use('/upload',uploadRoute);
app.use('/img',imgRoute);
app.use('/',appRoute);




//escuchar peticiones

app.listen(3000,()=>{
    console.log('servidor corriendo en el puerto 3000 online');
});

