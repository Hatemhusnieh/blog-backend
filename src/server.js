'use strict';
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const model = require('./models/blog.schema');
const Interface = require('./Controllers/blog');
const blog = new Interface(model);
const io = require('socket.io')(http);

io.listen(server);
app.use(cors());
app.use(express.json());

io.on('connection', socket => {

  socket.on('read', async () => {
    const data = await blog.read({});
    socket.emit('blogs', data);
  });

  socket.on('write', async payload => {
    await blog.create(payload);
    const data = await blog.read({});
    socket.emit('blogs', data);
  });

});

// prof of life
app.get('/', (req, res) => {
  res.status(200).send('<p>“A day may come when the courage of men fails, when we forsake our friends and break all bonds of fellowship, but it is not this day. Aragorn, The Lord of the Rings: Return of the King” </p>');
});

module.exports = {
  app,
  start: port => {
    app.listen(port, () => console.log(`server is up at ${port}`));
  },
};