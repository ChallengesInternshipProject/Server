var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
    //The id can be a number or a string
    id: String,
    message: {
        type: String,
        required: true
    },
    sender: String,
    reciever: String,
    time: Date
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
