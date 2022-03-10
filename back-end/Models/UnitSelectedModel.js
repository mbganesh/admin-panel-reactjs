var mongoose = require('mongoose')

// unitNames model
// var unitNameSchema = new Schema({
//     unitNo: Number,
//     unitName: String
// })
// mongoose.model('unit_name',unitNameSchema ,'unit_name' )

// unitTopic model
// var unitTopicSchema = new Schema({
//     topicName: String,
//     topicUrl: String,
//     // refId:String
// })
// mongoose.model('topic_name',unitTopicSchema ,'topic_name' )

/**
 * {
        type: mongoose.Schema.Type.ObjectId,
        ref: 'unit_name'
    }
 */

var UnitSchema = new mongoose.Schema({
    boardName:String,
    className:String,
    subject:String,
    unitTopics:Array,
    mediumName:String,
    unitNames: Array
})

var UnitModel = mongoose.model('all_unit_data' , UnitSchema)

module.exports = UnitModel;