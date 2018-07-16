/**
 * All available data node
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var dataNodeSchema = new Schema(
    {
        ip: { type: String, required: true, trim: true, index: true }, // node ip
        name: { type: String, default: '', trim: true }, // 
        OSDs: [
            {
                name: String,
                size: Number,
                disk: String, 
                info: String
            }
        ]
    },
    { timestamps: { createdAt: 'created_at' } }
);

mongoose.model('DataNode', dataNodeSchema);