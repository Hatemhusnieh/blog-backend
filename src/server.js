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
io.use(cors());
app.use(express.json());

io.on('connection', socket => {

  socket.on('join', (payload) => {
    socket.join('feeds');
    console.log(`room was entered by ${socket.id} by: ${payload.name} with ${payload.password}`);
  });

  socket.on('read', async () => {
    const data = await blog.read();
    socket.emit('blogs', data);
  });

  socket.on('write', async payload => {
    const newBlog = await blog.create(payload);
    const data = await blog.read();
    socket.to('feeds').emit('newBlog', newBlog.blogger);
    io.in('feeds').emit('blogs', data);
  });

  socket.on('comments', async payload => {
    const updatedBlog = await blog.comment(payload);
    const data = await blog.read();
    io.in('feeds').emit('blogs', data);
    // console.log(payload.commenter,updatedBlog.blogger);
    io.to('feeds').emit('newComment', { blogger: updatedBlog.blogger, commenter: payload.commenter });
  });

  socket.on('delete', async payload => {
    const errorMessage = await blog.delete(payload);
    if (typeof (errorMessage) != 'string') {
      const data = await blog.read();
      io.in('feeds').emit('blogs', data);
    } else {
      io.to(socket.id).emit('error', errorMessage);
    }
  });
  socket.on('like', async (payload) => {
    const likedBlog = await blog.like(payload);
    const data = await blog.read();
    io.in('feeds').emit('blogs', data);
    io.to('feeds').emit('newLike', { blogger: likedBlog.blogger, reader: payload.user });
  });
  socket.on('updateBlog', async (payload) => {

    const updated = await blog.update(payload);
    if (typeof (updated) != 'string') {
      const data = await blog.read();
      io.in('feeds').emit('blogs', data);
    } else {
      io.to(socket.id).emit('error', updated);
    }

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