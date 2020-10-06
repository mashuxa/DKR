// const x = () => 'return value here';
// У стрелочных функций нет «this». Значение берётся снаружи
// const mainObject = {
//   someText: "text",
//   cars: ["111", "222", "333"],
//   test() {
//     const secondObject = {
//       x: () => {
//         console.warn(this);
//
//         this.cars.forEach(car => console.warn(`${this.someText}: car`)); // внутри forEach стрелочный callback, иначе бы error 'title' of undefined
//       },
//       y: function () {
//         console.warn(this);
//       }
//     };
//
//     secondObject.x(); // mainObject
//     secondObject.y(); // secondObject
//   }
// };
//
// mainObject.test();
// стрелочные функции не могут быть использованы как конструкторами, т.к. нет this

// const test = {
//   x: 100,
//   y: function () {
//     console.warn(this);
//   },
//   xy: () => {
//     console.warn(this);
//   }
// };
//
// test.y(); // test object
// test.xy(); // undefined
//
// const test2 = {
//   z: 333
// };
//
// test.y.call(test2); // test object2
// test.xy.call(test2); // undefined


// у => нет arguments
//
// const x = function (x, y) { console.warn(arguments); }
// const y = (x, y) => { console.warn(arguments); }
// x(1, 2); // [1, 2, ...]
// y(1, 2); // error

// setTimeout(callback, 1000); // у callback теряется контекст. можно передать замыканием (с функцией оберткой) или bind, или передать аргументом
