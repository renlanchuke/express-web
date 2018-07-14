/**
 * All available agents (a agent is a probe on a iface)
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var FlowRuleSchema = new Schema (
  {
    probe: {type: String, default: '', trim: true}, // ntopng probe name
    iface: {type: String, default: '', trim: true}, // interface name
    name: {type: String, default: '', trim: true}, // rule name
    ip: {type: String, default: '', trim: true}, // IP
    port: {type: String, default: '', trim: true}, // port
    direction: {type: String, default: 'IN', trim: true}, // IN/OUT
    query: {type: Schema.Types.Mixed}, // elastic query
    histogramOption: {type: String, default: 'ONE_HOUR_LAST_DAY', trim: true},
    severity: {type: String, default: 'LOW', trim: true}, // LOW/MEDIUM/HIGH
    alertSpikeOn: {type: Boolean, default: false}, // if elastalert spike alert is on
    alertSpike: {type: Schema.Types.Mixed}, // elastalert spike
    cronAlertSpikeOn: {type: Boolean, default: false}, // if elastalert spike alert is on
    cronAlertSpike: {type: Schema.Types.Mixed}, // elastalert spike
  }
);


/**
 * Pre-remove hook
 */

FlowRuleSchema.pre('remove', function (next) {
  // things to do before removing a test
  next()
})

/**
 * Methods
 */

FlowRuleSchema.methods = {

}

/**
 * Statics
 */

FlowRuleSchema.statics = {
}

mongoose.model('FlowRule', FlowRuleSchema);
