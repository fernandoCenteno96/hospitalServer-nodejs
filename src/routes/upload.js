var express=require('express');
var app=express();
const fileUpload = require('express-fileupload');
var fs = require('fs');
// default options
app.use(fileUpload());
var Usuario = require('../models/user');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');




app.put('/:tipo/:id',(req,res,next)=>{

    var tipo=req.params.tipo;
    var id=req.params.id;


    //tipos de coleccion
    var tipoValidos=['hospital','usuario','medico'];
    if(tipoValidos.indexOf(tipo)<0){
        res.status(400).json({
            success:false,
            message:"tipo de collecion no valida",
            error:{message:'tipo de collecion no es valida'}
        });

    }

    if(!req.files){
        res.status(400).json({
            success:false,
            message:"no hay archivos seleccionados",
            error:{message:'no sa seleccionado nada'}
        });
    }
    //obtener nombre del archivo
    var archivo=req.files.imagen;
    var ext=archivo.name.split('.');
    var extencionNombre=ext[ext.length - 1];

    //solo las siguientes extenciones
    var extencionValida=['png','jpg','gif','jpeg'];
    if(extencionValida.indexOf(extencionNombre)<0){
        res.status(400).json({
            success:false,
            message:"extencion no valida",
            error:{message:'las extenciones permitidas son :png jpg gif jpeg'}
        });
    }
    //nombre personalizado
    var  nombreArchivo=`${id}-${ new Date().getMilliseconds() }.${ extencionNombre }`;

    //mover el archivo del tempo al un path
    
    var path=`./upload/${tipo}/${nombreArchivo}`;
    
    archivo.mv(path,(err)=>{
            
        if(err){
            res.status(500).json({
                success:false,
                message:"error al mover archivo",
                error:err,
                
            });
        }
       subirPorTipo(tipo, id, nombreArchivo, res);
      
    });

   
});
function subirPorTipo(tipo, id, nombreArchivo, res) {

   
    if (tipo === 'usuario') {

        
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            

            var pathViejo = './upload/usuario/' + usuario.img;
            
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo,(err)=>{
                    
                });
            }
           
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });


        });

    }

    if (tipo === 'medico') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }

            var pathViejo = './upload/medico/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo,(err)=>{
                    if (err) throw err;
                });
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    usuario: medicoActualizado
                });

            })

        });
    }

    if (tipo === 'hospital') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './upload/hospital/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo,(err)=>{
                    if (err) throw err;
                });
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    usuario: hospitalActualizado
                });

            })

        });
    }
}


module.exports=app;