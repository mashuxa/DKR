// console.warn('number', typeof 123);
// console.warn('string', typeof '123');
// console.warn('boolean', typeof true);
// console.warn('null => object', typeof null);
// console.warn('undefined', typeof undefined);
// console.warn('object', typeof {});
// console.warn('symbol', typeof Symbol('symbol'));
//
// //not types
// console.warn('function', typeof function () {});
// console.warn('array => object', typeof []);
//
// const string = new String('String');
// const number = new Number(100);
//
// console.warn(typeof string); // object
// console.warn(typeof number); // object


// Type conversion

// let value = true;
// console.warn(typeof value); // boolean
// value = String(value);
// console.warn(typeof value); // string
// value = +'123';
// console.warn( value); // number
// value = '123a';
// console.warn(typeof +value); // number (value === NaN)
// console.warn(typeof !!value); // boolean (value === true)
// console.warn(typeof ("6" / "2")); // number
// console.warn(typeof Number('123')); // number
// console.warn(typeof Boolean('123')); // boolean
//
// console.warn(typeof Boolean(0)); // boolean // value === false
// console.warn(typeof Boolean('')); // boolean // value === false
// console.warn(typeof Boolean([])); // boolean // value === true
// console.warn(typeof Boolean(null)); // boolean // value === false
// console.warn(typeof Boolean(undefined)); // boolean // value === false


