'use strict';
const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  blogger : {
    type: String,
    required : true,
  },
  content: {
    type: String,
    required : true,
  },
  date : new Date().toLocaleDateString(),
});

const blogModel = mongoose.model('blogs', blogSchema);

module.exports = blogModel;