js_implem = require("./js_implementation.js")
c_implem = require("./c_implementation.js")
document = require("../index.html")

// tengo el array sacado del frontend
// arr

if (implementation == "js") {
  js_implem.caller(arr);
} else {
  c_implem.caller(arr);
}

// se muestra el resultado en el frontend
