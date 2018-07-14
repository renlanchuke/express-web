/**
 * All aggregation queries use to present data
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var AggregationSchema = new Schema (
    {
        key: {type: String, default: '', trim: true}, // key of the aggregation
        name: {type: String, default: '', trim: true}, // name of the aggregation
        index: {type: String, default: '', trim: true},
        type: {type: String, default: '', trim: true},
        aggregation: {type: Schema.Types.Mixed}
    }
);


/**
 * Pre-remove hook
 */

AggregationSchema.pre('remove', function (next) {
    // things to do before removing a test
    next()
})

/**
 * Methods
 */

AggregationSchema.methods = {

}

/**
 * Statics
 */

AggregationSchema.statics = {
}

mongoose.model('Aggregation', AggregationSchema);

