'use strict';
const server = require('./src/server');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, 
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => server.start(process.env.PORT || 6666))
  .catch((e) => console.error(e.message));

