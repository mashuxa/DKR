import { useState } from 'react';

const [isFirst] = useState(false);

const messageHandler = (message) => {
  console.warn('message: ', message);
};

const sendUserMessage = (message) => {
  socket.send(message);
}
