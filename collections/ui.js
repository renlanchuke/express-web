/**
 * Targeted queries to be combined with aggregations for each page
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var UiSchema = new Schema (
    {
      url: {type: String, default: '', trim: true}, // page name: 'dashboard', 'assets', 'flows', 'behaviours', 'controlDevices', 'pageAdmin'
      eventId: {type: String, default: '', trim: true}, // event id (without app/socket prefix)
      functionName: {type: String, default: '', trim: true}, // index.js function name to call
      baseQuery: {type: Schema.Types.Mixed}, // baseQuery in json format to pass to the function
      timeframeOption: {type: String, default: 'LAST_DAY', trim: true},
      severity: {type: String, default: 'LOW', trim: true}, // LOW/MEDIUM/HIGH - define how often to run this query
    }
);


/**
 * Pre-remove hook
 */

UiSchema.pre('remove', function (next) {
    // things to do before removing a test
    next()
})

/**
 * Methods
 */

UiSchema.methods = {

}

/**
 * Statics
 */

UiSchema.statics = {
}

mongoose.model('Ui', UiSchema);

