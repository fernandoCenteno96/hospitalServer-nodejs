var mongoose=require('mongoose');
var uniqueValidator=require('mongoose-unique-validator');

 var Schema=mongoose.Schema;

 var rolesValidos={
     values:['ADMIN_ROLE','USER_ROLE'],
     message:'{VALUE} no es un rol valido'
 }

 var userSchema=new Schema({
     nombre:{type:String,required:[true,'el nombre es necesario']},
     apellido:{type:String,required:[true,'el apellido es necesario']},
     email:{type:String,unique:true,required:[true,'el correo es necesario']},
     password:{type:String,required:[true,'la contraseña  es necesaria']},
     img:{type:String,required:false},
     role:{type:String,required:true,default:'USER_ROLE',enum:rolesValidos}

 });
 userSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'});

 module.exports=mongoose.model('usuario',userSchema);