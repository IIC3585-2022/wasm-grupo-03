import Module from "./c_implementation.js";

function makePtrArrayC(array, mymod) {
  const newPtrArray = mymod._calloc(array.length, 4)
  for (let i = 0; i < array.length; i++) {
    mymod.setValue(newPtrArray + i * 4, array[i], "i32");
  }
  return newPtrArray;
}

function caller(array) {
  return Module().then(async (mymod) => {
    let newArray = makePtrArrayC(array, mymod);
    return await mymod._caller(newArray, array.length);
  });
}

module.exports = { caller };