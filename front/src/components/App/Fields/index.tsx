import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';
import { Events } from '../../../constants/events';
import { socket } from '../index';

interface IFieldsProps {
  fields: number[];
  isNext: null | boolean;
}

const Fields: React.FC<IFieldsProps> = ({ fields, isNext }) => {
  const click = useCallback((index) => () => {
    if (isNext) {
      socket.emit(Events.pickField, {
        userId: socket.id,
        fieldIndex: index,
      });
    }
  }, [isNext]);
  const fieldSize = useMemo(() => `calc(100% / ${Math.sqrt(fields.length)})`, [fields.length]);
  const items = useMemo(() => fields.map((item, index) => {
    const className = classnames(styles.item, {
      [styles.cross]: item === 1,
      [styles.zero]: item === 0,
    });

    return <div className={className} style={{ width: fieldSize, height: fieldSize }} onClick={click(index)} key={index} />;
  }), [click, fieldSize, fields]);

  return (
    <div className={styles.itemWrapper}>
      {items}
    </div>
  );
}

export default Fields;
