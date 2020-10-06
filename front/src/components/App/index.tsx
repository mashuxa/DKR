import React, { useEffect, useState } from 'react';
import io from "socket.io-client";

import { server } from '../../constants/server';
import { Events } from '../../constants/events';
import { PATH, SYMBOLS } from '../../constants/common';
import styles from './styles.module.scss';
import Fields from './Fields/index';

export const roomId = window.location.href.split('/').pop();
export const socket = io(server.URL, { query: { roomId }});
const sendResetGame = () => {
  socket.emit(Events.gameStarted);
};

type DataType<T> = null | T;

interface IEventData {
  fields: DataType<number[]>;
  isNext: DataType<boolean>;
  index: DataType<number>;
  isWinner: DataType<boolean>;
}

export default () => {
  const [fields, setFields] = useState<DataType<number[]>>(null);
  const [isNext, setIsNext] = useState<DataType<boolean>>(null);
  const [index, setIndex] = useState<DataType<number>>(null);
  const [isWinner, setIsWinner] = useState<DataType<boolean>>(null);
  
  const resetGame = () => {
    setFields(null);
    setIsNext(null);
    setIndex(null);
    setIsWinner(null);
  };
  const startGame = ({ fields, isNext, index }: IEventData) => {
    setIsWinner(null);
    setFields(fields);
    setIsNext(isNext);
    setIndex(index);
  };
  const nextStep = ({ fields, isNext }: IEventData) => {
    setFields(fields);
    setIsNext(isNext);
  };
  const finishGame = ({ fields, isNext }: IEventData) => {
    setFields(fields);
    setIsWinner(isNext);
  };
  const relocation = () => {
    window.location.replace(PATH);
  };

  useEffect(() => {
    socket.on(Events.gameStarted, startGame);
    socket.on(Events.nextStep, nextStep);
    socket.on(Events.gameFinished, finishGame);
    socket.on(Events.userDisconnected, resetGame);
    socket.on(Events.forbidden, relocation);
  }, []);
  
  return (
    <div className={styles.wrapper}>
      {fields ? (
          <>
            <header className={styles.header}>
                {isWinner === null && (
                  <h3>{isNext ? 'Ваша очередь' : 'Ходит соперник'}</h3>
                )}
              <button onClick={sendResetGame} className={styles.button}>Начать заново</button>
            </header>
            {isWinner === null ? (
              <Fields fields={fields} isNext={isNext} />
            ) : (
              <h1>{isWinner ? 'Вы победили' : 'Вы проиграли'}</h1>
            )}
            {index !== null && <p>{`Вы: ${SYMBOLS[index]}`}</p>}
          </>
      ) : 'Ожидаем второго игрока...'}
    </div>
  );
}
