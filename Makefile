EMCC=emcc

all: src/algorithm.cpp
	$(EMCC) src/algorithm.cpp -s WASM=1 -o src/c_implementation.js
