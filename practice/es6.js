//конструктор == класс

class Person {
  constructor(name) {
    this.name = name;
  }

  printName() {
    console.warn(this.name);
  }
}

//наследование

class Driver extends Person {
  constructor(name, car) {
    super(name);

    this.car = car;
  }

  printCar() {
    console.warn(this.car);
  }

  printFullInfo() {
    this.printName();
    this.printCar();
  }
}

const driver = new Driver('Max', 'audi');

// driver.printFullInfo();
