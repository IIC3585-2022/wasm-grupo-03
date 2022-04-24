import Module from "./c_implementation.js";

function generateArrayC(array, mymod) {
    const newArray = mymod._calloc(array.length, 4)
    for (let i = 0; i < array.length; i++) {
      mymod.setValue(newArray + i * 4, array[i], "i32");
    }
    return newArray;
}

function caller(array){
    let answer;
    Module().then(function (mymod) {
        const newArray = generateArrayC(array, mymod);
        return {newArray, mymod}
      }).then(({newArray, mymod}) => {
        answer = mymod._caller(newArray);
      });

    return answer
}

module.exports = {caller};