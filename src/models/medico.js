var mongoose=require('mongoose');

var Schema=mongoose.Schema;


var medicoSchema=new Schema({
    nombre:{type:String,required:[true,'el nombre del medico es requerido']},
    img:{type:String,required:false},
    usuario:{type:Schema.ObjectId,ref:'usuario',required:[true,'el id del usuario es requerido']},
    hospital:{type:Schema.ObjectId,ref:'hospital',required:[true,'el id del hospital es requerido']}


});

module.exports=mongoose.model('medico',medicoSchema);