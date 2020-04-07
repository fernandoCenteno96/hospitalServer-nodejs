var mongoose=require('mongoose');

var Schema =mongoose.Schema;


var hospitalSchema=new Schema({
    nombre:{type:String ,required:[true,'el nombre del hospital es requerido']},
    img:{type:String,required:false},
    usuario:{type:Schema.Types.ObjectId,ref:'usuario'}

});

module.exports=mongoose.model('hospital',hospitalSchema);