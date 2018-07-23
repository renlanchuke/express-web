/**
 * All available data node
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RackSchema = new Schema(
    {
        _id: { type: String, default: '', trim: true },
        name: { type: String, default: '', trim: true },
        location: { type: String, default: '', trim: true },
        pnode: [
            {
                type: Schema.Types.String, ref: 'PNode'
            }
        ]
    },
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('Rack', RackSchema);
