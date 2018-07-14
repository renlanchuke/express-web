/**
 * All aggregation queries use to present data
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var FilterSchema = new Schema (
    {
        key: {type: String, default: '', trim: true}, // key of the aggregation
        name: {type: String, default: '', trim: true}, // name of the aggregation
        index: {type: String, default: '', trim: true},
        type: {type: String, default: '', trim: true},
        filterQuery: {type: Schema.Types.Mixed}
    }
);


/**
 * Pre-remove hook
 */

FilterSchema.pre('remove', function (next) {
    // things to do before removing a test
    next()
})

/**
 * Methods
 */

FilterSchema.methods = {

}

/**
 * Statics
 */

FilterSchema.statics = {
}

mongoose.model('Filter', FilterSchema);

