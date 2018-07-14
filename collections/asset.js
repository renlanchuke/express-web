var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var AssetSchema = new Schema (
    {
        probe: {type: String, default: '', trim: true}, // ntopng probe name
        iface: {type: String, default: '', trim: true}, // interface name
        ip: {type: String, default: '', trim: true}, //
        mac: {type: String, default: '', trim: true}, //
        os: {type: String, default: '', trim: true},
        name: {type: String, default: '', trim: true},
        group: {type: String, default: '', trim: true},
        status: {type: String, default: 'NEW', trim: true}, // NEW / VALID / INVALID / IGNORED
        latitude: {type: Number}, // optional geo location
        longitude: {type: Number}, // optional geo location
        x: {type: Number, default: 0}, // optional static x cord ratio
        y: {type: Number, default: 0}, // optional static y cord ratio
        timestamp: {type: Date, default: Date.now},
    }
);


/**
 * Pre-remove hook
 */

AssetSchema.pre('remove', function (next) {
    // things to do before removing a test
    next()
})

/**
 * Methods
 */

AssetSchema.methods = {

}

/**
 * Statics
 */

AssetSchema.statics = {
}

mongoose.model('Asset', AssetSchema);

