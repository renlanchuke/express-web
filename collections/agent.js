/**
 * All available agents (a agent is a probe on a iface)
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var AgentSchema = new Schema (
    {
      probe: {type: String, default: '', trim: true}, // ntopng probe name
      iface: {type: String, default: '', trim: true}, // interface name
        name: {type: String, default: 'xProbe'},
        latitude: {type: Number, default: 30.2741},
        longitude: {type: Number, default: 120.1551},
        x: {type: Number, default: 0.5}, // static x cord ratio, default to half of the x length
        y: {type: Number, default: 0.5}, // static y cord ratio, default to half of the y length
        image: {type: String, default: '', trim: true} // background image to be used with x and y
    }
);


/**
 * Pre-remove hook
 */

AgentSchema.pre('remove', function (next) {
    // things to do before removing a test
    next()
})

/**
 * Methods
 */

AgentSchema.methods = {

}

/**
 * Statics
 */

AgentSchema.statics = {
}

mongoose.model('Agent', AgentSchema);

