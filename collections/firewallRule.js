/**
 * All available agents (a agent is a probe on a iface)
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var FirewallRuleSchema = new Schema (
  {
    probe: {type: String, default: '', trim: true}, // ntopng probe name
    iface: {type: String, default: '', trim: true}, // interface name
    name: {type: String, default: '', trim: true}, // rule name
    srcIp: {type: String, default: '', trim: true}, // source IP
    srcIpNegate: {type: Boolean, default: false}, // if negate source IP condition
    srcPort: {type: String, default: '', trim: true}, // source port
    srcPortNegate: {type: Boolean, default: false},
    dstIp: {type: String, default: '', trim: true}, // destination IP
    dstIpNegate: {type: Boolean, default: false},
    dstPort: {type: String, default: '', trim: true}, // destination port
    dstPortNegate: {type: Boolean, default: false},
    protocolL4: [{type: String, default: '', trim: true}], // L4 protocol => PROTOCOL
    protocolL4Negate: {type: Boolean, default: false},
    protocolL7: [{type: String, default: '', trim: true}], // L7 protocol => L7_PROTO
    protocolL7Negate: {type: Boolean, default: false},
    query: {type: Schema.Types.Mixed}, // elastic query
    histogramOption: {type: String, default: 'ONE_HOUR_LAST_DAY', trim: true},
    severity: {type: String, default: 'LOW', trim: true}, // LOW/MEDIUM/HIGH
    monitorFlow: {type: Boolean, default: true}, // if the flow is monitored for this rule
    monitorTraffic: {type: Boolean, default: true} // if the traffic is monitored for this rule
  }
);


/**
 * Pre-remove hook
 */

FirewallRuleSchema.pre('remove', function (next) {
  // things to do before removing a test
  next()
})

/**
 * Methods
 */

FirewallRuleSchema.methods = {

}

/**
 * Statics
 */

FirewallRuleSchema.statics = {
}

mongoose.model('FirewallRule', FirewallRuleSchema);
