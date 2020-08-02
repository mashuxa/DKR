class Application {
  constructor() {
    this.nextUserIndex = null;
    this.hasWinner = false;
    this.users = Array(2).fill(null);
  }

  addUser(id) {
    const index = this.randomIndex;

    if (this.users[index]) {
      this.users[Number(!index)] = id;
    } else {
      this.users[index] = id;
    }
  }

  removeUser(id) {
    const index = this.users.indexOf(id);

    this.users.splice(index, 1);
  }

  setTurn(index) {
    this.nextUserIndex = index;
  }

  toggleTurn() {
    this.setTurn(Number(!this.nextUserIndex));
  }

  setField(fieldIndex) {
    this.fields.splice(fieldIndex, 1, this.nextUserIndex);
  }

  resetFields() {
    this.fields = Array(9).fill(null);
  }

  checkWinner() {
    const fields = this.fields.reduce((acc, field, index) => {
      return field === this.nextUserIndex ? [...acc, index] : acc;
    }, []);
    const size = 3;

    let r = [];
    let c = [];
    let dr = [];
    let dl = [];

    fields.forEach(
      (curr) => {
        const rowIndex = Math.floor(curr / size);
        const colIndex = Math.floor(curr % size);

        r = r[r.length - 1] === rowIndex ? [...r, rowIndex] : [rowIndex];
        c = c[c.length - 1] === colIndex ? [...c, colIndex] : [colIndex];

        if (rowIndex === colIndex) {
          dr.push(rowIndex);
        }

        if (rowIndex + colIndex === size - 1) {
          dl.push(rowIndex);
        }
      });

    return r.length === size || c.length === size || dr.length === size || dl.length === size;
  }

  get randomIndex() {
    return Number(Math.random() < 0.5);
  }
}

module.exports = new Application();