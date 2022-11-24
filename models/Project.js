let mongoose = require('mongoose')
let validator = require('validator')

let projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});
module.exports = mongoose.model('Project', projectSchema);