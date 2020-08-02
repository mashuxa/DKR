import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';

import { GAME_SIZE } from '../../constants/settings';
import styles from './styles.module.scss';
import io from "socket.io-client";
import { server } from '../../constants/server';

const socket = io(server.URL);
const SYMBOLS = ['zero "O"', 'cross "X"'];

export default () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [fields, setFields] = useState(null);
  const [isNext, setIsNext] = useState(false);
  const [symbolIndex, setSymbolIndex] = useState(null);
  const [notification, setNotification] = useState(null);

  const eventHandler = ({ event, data }) => {
    if (event === 'connected') {
      setIsConnecting(false);
    }

    if (event === 'start') {
      setNotification(null);
      setFields(data.fields);
      setIsNext(data.isNext);
      setSymbolIndex(data.symbolIndex);

      console.warn(data);
    }

    if (event === 'disconnectUser') {
      setFields(null);
    }

    if (event === 'nextStep') {
      setFields(data.fields);
      setIsNext(data.isNext);
    }

    if (event === 'hasWinner') {
      setFields(data.fields);
      setNotification(data.message);
    }

    if (event === 'reset') {
      setNotification(null);
    }
  };
  const click = (index) => () => {
    if (isNext) {
      socket.send({
        event: 'pickField',
        data: {
          userId: socket.id,
          fieldIndex: index,
        },
      });
    }
  };
  const renderFields = () => fields.map((item, index) => {
      const className = classnames(styles.item, {
        [styles.cross]: item === 1,
        [styles.zero]: item === 0,
      });

      return <div className={className} onClick={click(index)} />;
    });
  const subscribeOnSocketEvents = useCallback(() => socket.on('message', eventHandler), []);
  const resetGame = useCallback(() => {
    socket.send({ event: 'resetGame' });
  }, []);

  useEffect(() => {
    subscribeOnSocketEvents();
  }, [subscribeOnSocketEvents]);

  return (
    <div className={styles.wrapper}>
      {isConnecting && 'connecting...'}
      {fields ? (
          <>
            <header className={styles.header}>
              {symbolIndex !== null && SYMBOLS[symbolIndex]}
              {!notification && (isNext ? <h3>Ваша очередь</h3> : <h3>Ходит соперник</h3>)}
              <button onClick={resetGame}>Начать заново</button>
              <h1>{notification}</h1>
            </header>
            <div className={styles.itemWrapper}>
              {renderFields(GAME_SIZE)}
            </div>
          </>
      ) : 'Ожидаем второго игрока...'}
    </div>
  );
}
