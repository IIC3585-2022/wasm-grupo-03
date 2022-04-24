all: src/algorithm.cpp
	emcc src/algorithm.cpp -s WASM=1 -o src/c_implementation.js
