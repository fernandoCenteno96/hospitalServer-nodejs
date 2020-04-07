var express=require('express');
var app=express();
var Hospital=require('../models/hospital');
var Medicos=require('../models/medico');
var Usuario=require('../models/user');

app.get('/todo/:busqueda',(req,res,next)=>{
    var busqueda=req.params.busqueda;
    var regex=new RegExp(busqueda,'i');

    Promise.all([
        BuscarHospitales(busqueda,regex),
        BuscarMedico(busqueda,regex),
        BuscarUsuario(busqueda,regex)
    ]).then(respuestas=>{
        res.status(200).json({
            success:true,
            hospitales:respuestas[0],
            medicos:respuestas[1],
            usuario:respuestas[2]
        });
    });

  
});
app.get('/coleccion/:tabla/:busqueda',(req,res,next)=>{
    var busqueda=req.params.busqueda;
    var regex=new RegExp(busqueda,'i');
    var tabla=req.params.tabla;
    var pormesa;
    switch(tabla){
        case 'usuarios':
        pormesa=BuscarUsuario(busqueda,regex);
            break;
            case 'medicos':
        pormesa=BuscarMedico(busqueda,regex);
            break;
            case 'hospitales':
        pormesa=BuscarHospitales(busqueda,regex);
            break;
        default:
            return res.status(400).json({
                ok:false,
                message:"los tipos de busquedas son:usuarios,medicos,hospitales",
                error:{message:'tipo de tabla/coleccion no valido'}
            });

    }
    pormesa.then( data=>{
    res.status(200).json({
        ok:true,
        [tabla]:data

    });

    });
  
});
function BuscarHospitales(busqueda,regex){
    return new Promise((resolve,reject)=>{
        Hospital.find({nombre:regex})
        .populate('usuario','nombre email')    
        .exec((err,hospitales)=>{
                if (err){
                    reject('error al cargar hospitales',err)

                }else{
                    resolve(hospitales);
                }
        });
    });
}
function BuscarMedico(busqueda,regex){
    return new Promise((resolve,reject)=>{
        Medicos.find({nombre:regex})
            .populate('usuario','nombre email')
            .populate('hospital')
            .exec((err,medicos)=>{
                if (err){
                    reject('error al cargar medico',err)

                }else{
                    resolve(medicos);
                }
        });
    });

}
function BuscarUsuario(busqueda,regex){
   

    return new Promise((resolve,reject)=>{
        Usuario.find({},'nombre email role ')
        .or([{nombre:regex},{'email':regex}])
        .exec((err,usuario)=>{
            if (err){
                reject('error al cargar usuario',err)

            }else{
                resolve(usuario);
            }
            
        });
    });
}


module.exports=app;