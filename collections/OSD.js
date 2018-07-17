var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OSDSchema=new Schema({
    _id: Schema.Types.ObjectId,
    name: {type:String,required:true},
    size: {type:Number},
    disk: {type:String}, 
    info: {type:String},
    dataNode:{type:Schema.Types.ObjectId,ref:'DataNode'}

});

module.exports=mongoose.model('OSD', OSDSchema);


