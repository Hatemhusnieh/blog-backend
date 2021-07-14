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

  socket.on('join', (payload) => {
    socket.join('feeds');
    console.log(`room was entered by ${socket.id} by: ${payload.name} with ${payload.password}`);
  });

  socket.on('read', async () => {
    const data = await blog.read();
    // console.log(data);
    socket.emit('blogs', data);
  });

  socket.on('write', async payload => {
    const newBlog = await blog.create(payload);
    const data = await blog.read();
    socket.to('feeds').emit('newBlog', newBlog.blogger);
    io.in('feeds').emit('blogs', data);
  });

  // socket.on('comments', async payload => {
  //   const updatedBlog = await blog.update(payload);
  //   const data = await blog.read();
  //   socket.in('feeds').emit('blogs', data);
  //   socket.to('feeds').emit('newComment', { blogger: updatedBlog.blogger });
  // });

  socket.on('delete', async payload => {
    await blog.delete(payload);
    const data = await blog.read();
    socket.emit('blogs', data);
  });
});
// proof of life
app.get('/', (req, res) => {
  res.status(200).send('<p>"A day may come when the courage of men fails, when we forsake our friends and break all bonds of fellowship, but it is not this day. Aragorn, The Lord of the Rings: Return of the King" </p>');
});
module.exports = {
  app,
  start: port => {
    server.listen(port, () => console.log(`server is up at ${port}`));
  },
};