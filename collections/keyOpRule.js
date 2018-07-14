/**
 * All available snort rules on all probe/iface
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var KeyOpRuleSchema = new Schema (
    {
        probe: {type: String, default: '', trim: true}, // probe
        iface: {type: String, default: '', trim: true}, // interface name
        name: {type: String, default: '', trim: true}, // rule name
        srcIp: {type: String, default: '', trim: true}, // source IP
        dstIp: {type: String, default: '', trim: true}, // destination IP
        query: {type: Schema.Types.Mixed}, // elastic query
            /** snort rule properties **/
        signatureId: {type: Number},
        title: {type: String, default: '', trim: true}, // to be displayed
        path: {type: String, default: '', trim: true}, // where to deploy to
        content: {type: String, default: '', trim: true}, // rule content
        histogramOption: {type: String, default: 'ONE_HOUR_LAST_DAY', trim: true},
        severity: {type: String, default: 'LOW', trim: true} // LOW/MEDIUM/HIGH
    }
);


/**
 * Pre-remove hook
 */

KeyOpRuleSchema.pre('remove', function (next) {
    // things to do before removing a test
    next()
})

/**
 * Methods
 */

KeyOpRuleSchema.methods = {

}

/**
 * Statics
 */

KeyOpRuleSchema.statics = {
}

mongoose.model('KeyOpRule', KeyOpRuleSchema);

