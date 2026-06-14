const { Server } = require('socket.io');

let io;

exports.init = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialised');
  return io;
};
