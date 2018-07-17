/**
 * All available physical machine
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var NodeSchema = new Schema (
    {
      ip: {type: String, required:true, trim: true,index:true}, // ntopng probe name
      name: {type: String, default: '', trim: true}, // interface name
      isMgr:{type:Boolean,default:false},
      isMon:{type:Boolean,default:false},
      isData:{type:Boolean,default:false},
      isRgw:{type:Boolean,default:false},
      isMDS:{type:Boolean,default:false},
      location: {type: String, default: '',trim:true}
    },{
        timestamps: true
    }
);

module.exports = mongoose.model('PNode', NodeSchema);

