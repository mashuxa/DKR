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
  socket.json.send({ event: 'connected', data: application.nextUserIndex });

  const startGame = () => {
    const firstUserIndex = Number(Math.random() < 0.5);
    const isNext = socket.id === application.users[firstUserIndex];

    application.fillFields();
    application.setTurn(firstUserIndex);

    const getResponse = (isNext) => ({
      event: 'start',
      data: {
        fields: application.fields,
        isNext,
      },
    });

    application.setTurn(firstUserIndex);
    socket.json.send(getResponse(isNext));
    socket.broadcast.json.send(getResponse(!isNext));
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

  if (application.users.length === 2) {
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