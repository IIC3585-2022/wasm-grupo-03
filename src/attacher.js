import * as js_implem from "./js_implementation"
import * as c_implem from "./c_implementation"

// Leer array del frontend
function parseInput(textField){
  return textField.value.split(',').map(Number)
}
// arr

const textField = document.getElementById('numbers')
const buttonCalc = document.getElementById('calcButton')
buttonCalc.addEventListener('click', () => console.log(parseInput(textField)))

if (implementation == "js") {
  let result = js_implem.caller(arr);
} else {
  let result = c_implem.caller(arr);
}

// se muestra el resultado en el frontend
