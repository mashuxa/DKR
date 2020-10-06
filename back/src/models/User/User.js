class User {
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.index = null;
  }

  setIndex(index) {
    this.index = index;
  }
}

module.exports = User;
