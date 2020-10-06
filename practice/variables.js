// // error
// const x;
// console.warn(x);
// x = 2;


// let x; || var x;
// var - область видимости fn()
// let - область видимости {}
// console.warn(x); // undefined
// x = 2;
// console.warn(x); // 2

// for (let i = 1; i < 5; i++) {
//   console.warn(i);  // 1 2 3 4
// }
// for (var i = 1; i < 5; i++) {
//   console.warn(i);  // 1 2 3 4
// }
// for (const i = 1; i < 5; i++) {
//   console.warn(i);  // 1 error
// }

// let message = "1";
// let message = "2"; // error

// var message = "1";
// var message = "2"; // no error
