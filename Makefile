EMCC=emcc

all: src/main.cpp
	$(EMCC) -03 src/main.cpp -s WASM=1 -o main.js
