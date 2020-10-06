const { GAME_STARTED, GAME_FINISHED, NEXT_STEP } = require('../../constants/actions');
const { GAME_SIZE } = require('../../constants/common');

class Game {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    if (this.users.length < 2) {
      const usersCount = this.users.push(user);

      user.setIndex(usersCount - 1);

      if (usersCount === 2) {
        this.start();
      }

      return true;
    }

    return false;
  }

  removeUser(user) {
    const index = this.users.findIndex((currentUser) => currentUser === user);

    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  start() {
    this.currentUser = Math.round(Math.random());
    this.fields = Array(Math.pow(GAME_SIZE, 2)).fill(null);

    this.users.forEach(({ socket, index }) => {
      const payload = { fields: this.fields, isNext: index === this.currentUser, index };

      socket.emit(GAME_STARTED, payload);
    });
  }

  checkIsUserStep(userId) {
    const index = this.users.findIndex(({ id }) => userId === id);

    return this.currentUser === index;
  }

  doStep({ userId, fieldIndex }) {
    if(this.checkIsUserStep(userId) && this.checkIsEmptyField(fieldIndex)) {
      this.setField(fieldIndex);
      const hasWinner = this.hasWinner();
      const eventType = hasWinner ? GAME_FINISHED : NEXT_STEP;

      if(!hasWinner) {
        this.switchCurrentUser();
      }

      this.users.forEach(({ socket, index }) => {
        socket.emit(eventType, {
          fields: this.fields,
          isNext: index === this.currentUser,
        });
      });
    }
  }

  checkIsEmptyField(fieldIndex) {
    return this.fields[fieldIndex] === null;
  }

  setField(fieldIndex) {
    this.fields.splice(fieldIndex, 1, this.currentUser);
  }

  hasWinner() {
    let rows = [];
    let columns = [];
    let lineToTopRight = [];
    let lineToTopLeft = [];

    return this.fields.find(
      (curr, index) => {
        if (curr !== this.currentUser) {
          return false;
        }

        const rowIndex = Math.floor(index / GAME_SIZE);
        const colIndex = Math.floor(index % GAME_SIZE);
        const isSameRow = columns[columns.length - 1] === rowIndex;
        const isSameColumn = rows[rows.length - 1] === colIndex;

        columns = isSameRow ? [...columns, rowIndex] : [rowIndex];
        rows = isSameColumn ? [...rows, colIndex] : [colIndex];

        if (rowIndex === colIndex) {
          lineToTopRight.push(rowIndex);
        }

        if (rowIndex + colIndex === GAME_SIZE - 1) {
          lineToTopLeft.push(rowIndex);
        }

        return (
          rows.length === GAME_SIZE
          || columns.length === GAME_SIZE
          || lineToTopRight.length === GAME_SIZE
          || lineToTopLeft.length === GAME_SIZE
        );
      }) !== undefined;
  }

  switchCurrentUser() {
    this.currentUser = 1 - this.currentUser;
  }
}

module.exports = Game;
