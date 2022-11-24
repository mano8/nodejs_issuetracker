let mongoose = require('mongoose')
let validator = require('validator')

let issueSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: String,
    default: Date.now,
  },
  updated_on: {
    type: String,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String,
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
  }
});
module.exports = mongoose.model('Issue', issueSchema);