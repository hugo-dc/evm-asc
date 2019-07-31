const fs = require('fs');
const loader = require('assemblyscript/lib/loader')

let BignumStackTop = 0;
let Memory;
let BignumStackStartOffset;

function pp(arr) {
  let res = '['
  for (var i=0; i< arr.length; i++)
    res += arr[i] + ', '
  res = res.substr(0, res.length - 2) + ']'
  return res
}

function hexstr(arr) {
  let res = '0x'
  for (var i=0; i < arr.length; i++)
    res += arr[i].toString(16)
  return res
}

const obj = loader.instantiateBuffer(fs.readFileSync(__dirname + '/build/optimized.wasm'), {
  main: {
    setBignumStack(startData, len) {
      console.log('[setBignumStack] startData:', startData);
      BignumStackStartOffset = startData;
      console.log('[setBignumStack] len:', len);
      console.log('[setBignumStack] BignumStackTop:', BignumStackTop);
    },
    add256() {
      console.log('[add256] BignumStackTop:', BignumStackTop)
      console.log('[add256] BignumStackTop.value:', BignumStackTop.value);
      let stack_elem_a_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 1);
      let stack_elem_b_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 2);
      console.log('[add256] stack_elem_a_pos:', stack_elem_a_pos);
      console.log('[add256] stack_elem_b_pos:', stack_elem_b_pos);
      const elemA = new Uint8Array(Memory.buffer, stack_elem_a_pos, 32);
      const elemB = new Uint8Array(Memory.buffer, stack_elem_b_pos, 32);
      console.log('[add256] elemA:', pp(elemA));
      console.log('[add256] elemB:', pp(elemB));
      //console.log('[add256] Memory.buffer: ', Memory.buffer);
      let memoryview = new Uint8Array(Memory.buffer);
      //console.log('[add256] memory:', hexstr(memoryview))

      result8 = elemA[31] + elemB[31];
      const resultBytes = new Uint8Array(32);
      resultBytes[31] = result8;

      let outOffset = stack_elem_b_pos;
      // pop 2 push 1, top is reduced by 1;
      BignumStackTop = BignumStackTop - 1;
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32);
      outputBytes.set(resultBytes);
    },
    finish(returnOffset) {
      const returnVal = new Uint8Array(Memory.buffer, returnOffset, 32);
      let returnHex = '';
      for (var i = 0; i < 32; i++) {
        if (returnVal[i] < 16) returnHex += '0';
            returnHex += returnVal[i].toString(16);
      }
      console.log("[finish] return val:", returnHex);
    }
  },
  env: {
    abort(_msg, _file, line, column) {
      console.error("[abort] abort called at main.ts:" + line + ":" + column);
    },
    log(value) {
      var op = ''
      if (value > 1000) {
        value = value - 1000
        if (value == 0x60)
          op = '- PUSH1'
        if (value == 0x01)
          op = '- ADD'
        if (value == 0x55)
          op = '- SSTORE'
      }
      
      if (op == '') {
        console.log('[log]', value)
      } else {
        console.log('[log]', '0x' + value.toString(16), op)
      }4
    }
  },
})

Memory = obj.memory
BignumStackTop = obj.BignumStackTop
console.log('BignumStackTop: ', BignumStackTop)
var res = obj.run_evm()

