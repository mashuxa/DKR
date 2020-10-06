//конструктор

const Person = function(name) {
  this.name = name;

  this.printName = function() {
    console.warn(this.name);
  };
};

//наследование

const Driver = function(name, car) {
  Person.call(this, name);

  this.car = car;

  this.printCar = function() {
    console.warn(this.car);
  };

  this.printFullInfo = function() {
    this.printName();
    this.printCar();
  };
};

const driver = new Driver('Sam', 'bmw');

driver.printFullInfo();

const driver2 = new driver.constructor('Vasia', 'vag');
const driver3 = Object.create(driver2);

console.warn(driver2);
console.warn(driver3.name);

driver2.name = 'Vas`ka';

console.warn(driver3.name);

const Biker = function() {};

Biker.prototype = Object.create(Person.prototype);

const biker = new Biker();

biker.name = 'Mike';

console.warn(Object.create(Person.prototype));
