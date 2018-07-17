/**
 * All available data node
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var dataNodeSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        ip: { type: String, required: true, trim: true, index: true }, // node ip
        name: { type: String, default: '', trim: true }, // 
        OSDs: [
            {
                type:Schema.Types.ObjectId,ref:'OSD'
            }
        ]
    },
    { timestamps: { createdAt: 'created_at' } }
);

var OSDSchema=new Schema({
    _id: Schema.Types.ObjectId,
    name: {type:String,required:true},
    size: {type:Number},
    disk: {type:String}, 
    info: {type:String},
    dataNode:{type:Schema.Types.ObjectId,ref:'DataNode'}

});

module.exports=mongoose.model('DataNode', dataNodeSchema);
mongoose.model('OSD', OSDSchema);