const PORT = process.env.PORT || 9000;
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Game = require('./models/Game/Game');
const User = require('./models/User/User');
const { PICK_FIELD, USER_DISCONNECTED, FORBIDDEN, GAME_STARTED } = require('./constants/actions');

http.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

const games = new Map();

io.sockets.on('connection', (socket) => {
  const { roomId } = socket.handshake.query;

  socket.join(roomId);

  if (!games.has(roomId)) {
    games.set(roomId, new Game());
  }

  let game = games.get(roomId);
  const user = new User(socket);

  if (game.addUser(user)) {
    socket.on('disconnect', () => {
      game.removeUser(user);
      socket.broadcast.emit(USER_DISCONNECTED);
    });
  } else {
    socket.emit(FORBIDDEN);
  }

  socket.on(PICK_FIELD, (data) => {
    game.doStep(data);
  });

  socket.on(GAME_STARTED, () => {
    game.start();
  });
});
