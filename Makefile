all:
	npm run asbuild
	node --experimental-wasm-mut-global index.js
