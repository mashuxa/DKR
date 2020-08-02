const PORT = process.env.PORT || 9000;
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const application = require('./models/Application');

http.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

io.sockets.on('connection', (socket) => {
  application.addUser(socket.id);
  socket.on('disconnect', () => {
    application.removeUser(socket.id);
    socket.broadcast.json.send({ event: 'disconnectUser' });
  });
  socket.json.send({ event: 'connected' });

  const startGame = () => {
    const isCurrentUserTurn = Boolean(application.randomIndex);
    const userIndex = application.users.indexOf(socket.id);
    const getEvent = (symbolIndex, isNext) => ({
      event: 'start',
      data: { fields: application.fields, isNext, symbolIndex },
    });

    application.resetFields();
    application.setTurn(isCurrentUserTurn ? userIndex : 1 - userIndex);
    socket.json.send(getEvent(userIndex, isCurrentUserTurn));
    socket.broadcast.json.send(getEvent(1 - userIndex, !isCurrentUserTurn));
  };
  const pickField = (data) => {
    const { userId, fieldIndex } = data;
    const isCurrentUserTurn = application.users[application.nextUserIndex] === userId;
    const isEmptyField = application.fields[fieldIndex] === null;

    if (isCurrentUserTurn && isEmptyField) {
      application.setField(fieldIndex);

      if (!application.checkWinner()) {
        const getResponse = (isNext) => ({
          event: 'nextStep',
          data: {
            fields: application.fields,
            isNext,
          },
        });

        application.toggleTurn();
        socket.json.send(getResponse(!isCurrentUserTurn));
        socket.broadcast.json.send(getResponse(isCurrentUserTurn));
      } else {
        socket.json.send({
          event: 'hasWinner',
          data: {
            fields: application.fields,
            message: 'Вы выйграли',
          },
        });
        socket.broadcast.json.send({
          event: 'hasWinner',
          data: {
            fields: application.fields,
            message: 'Вы проиграли',
          },
        });
      }
    }
  };

  if (application.users.every((user) => user)) {
    startGame();
  }

  socket.on('message', ({ event, data }) => {
    if (event === 'pickField') {
      pickField(data);
    }

    if (event === 'resetGame') {
      startGame();
    }
  });
});