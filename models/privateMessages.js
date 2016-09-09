var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var privateMessageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sender: String,
    reciever: String,
    time: Date
});

var PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = PrivateMessage;
