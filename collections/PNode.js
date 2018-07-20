/**
 * All available physical machine
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var NodeSchema = new Schema(
    {
        _id: { type: String, required: true, trim: true },
        ip: { type: String, required: true, trim: true }, // ntopng probe name
        hostname: { type: String, default: '', trim: true }, // machine host name
        isMgr: { type: Boolean, default: false },
        isMon: { type: Boolean, default: false },
        isRgw: { type: Boolean, default: false },
        isMDS: { type: Boolean, default: false },
        osds: { type: Array, default: [] },
        location: { type: String, default: '', trim: true }
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('PNode', NodeSchema);

