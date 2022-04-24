EMCC=emcc

all: src/algorithm.cpp
	# $(EMCC) src/algorithm.cpp -s WASM=1 -o src/c_implementation.js
	$(EMCC) -O3 -s WASM=1 -o src/c_implementation.js -s EXTRA_EXPORTED_RUNTIME_METHODS='["getValue", "setValue"]' -s EXPORTED_FUNCTIONS="['_calloc', '_caller']" -s EXPORT_ES6=1 -s MODULARIZE=1 src/algorithm.cpp

