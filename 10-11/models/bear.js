var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
    longdescription: String,
    shortdescription: String
});

module.exports = mongoose.model('Bear', BearSchema);
