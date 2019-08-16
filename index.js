const fs = require('fs');
const loader = require('assemblyscript/lib/loader')

let BignumStackTop = 0;
let Memory;

let BignumStackStartOffset;
let EVMMemoryStartOffset;


//let calldata = '26bceb59802431afcbce1fc194c9eaa417b2fb67dc75a95db0bc7ec6b1c8af11df6a1da9a1f5aac137876480252e5dcac62c354ec0d42b76b0642b6181ed099849ea1d57'
let calldata = new Uint8Array([38, 188, 235, 89, 128, 36, 49, 175, 203, 206, 31, 193, 148, 201, 234, 164, 23, 178, 251, 103, 220, 117, 169, 93, 176, 188, 126, 198, 177, 200, 175, 17, 223, 106, 29, 169, 161, 245, 170, 193, 55, 135, 100, 128, 37, 46, 93, 202, 198, 44, 53, 78, 192, 212, 43, 118, 176, 100, 43, 97, 129, 237, 9, 152, 73, 234, 29, 87])
let calldatasize = calldata.length

function arrayToBn(arr) {
  var hexstr = []
  arr.forEach((i) => {
    var h = i.toString(16)
    if (h.length % 2)
      h = '0' + h
    hexstr.push(h)
  })
  return BigInt('0x'+ hexstr.join(''))
}

function bnToArray(bn) {
  var totalLength = 32
  var hex = bn.toString(16)
  if (hex.length % 2)
    hex = '0' + hex

  var len = hex.length / 2
  var res = new Uint8Array(totalLength)

  var start = totalLength - len

  var i = 0
  var j = 0
  while (i < totalLength) {
    if (i < start) {
      res[i] = 0;
    } else {
      res[i] = parseInt(hex.slice(j, j+2), 16)
      j += 2
    }
    i += 1
  }

  return res
}

function pp(arr) {
  let res = []
  arr.forEach((i) => {
    res.push(i)
  })

  return '[' + res.join(', ') + ']'
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
    setMemoryPtr(startData, len) {
      EVMMemoryStartOffset = startData
    },
    add256() {
      console.log('[add256] BignumStackTop:', BignumStackTop)
      console.log('[add256] BignumStackTop.value:', BignumStackTop.value);
      let stack_elem_a_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 1);
      let stack_elem_b_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 2);
      console.log('[add256] stack_elem_a_pos:', stack_elem_a_pos);
      console.log('[add256] stack_elem_b_pos:', stack_elem_b_pos);
      const arrayA = new Uint8Array(Memory.buffer, stack_elem_a_pos, 32);
      const arrayB = new Uint8Array(Memory.buffer, stack_elem_b_pos, 32);
      console.log('[add256] arrayA:', pp(arrayA));
      console.log('[add256] arrayB:', pp(arrayB));
      
      const elemA = arrayToBn(arrayA);
      const elemB = arrayToBn(arrayB);

      console.log('[add256] elemA:', elemA);
      console.log('[add256] elemB:', elemB);

      const result = elemA + elemB;
      console.log('[add256] result:', result)
      //const resultBytes = new Uint8Array(32);
      const resultBytes = bnToArray(result);
      console.log('[add256] resultBytes:', pp(resultBytes))

      let outOffset = stack_elem_b_pos;
      // pop 2 push 1, top is reduced by 1;
      BignumStackTop = BignumStackTop - 1;
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32);
      outputBytes.set(resultBytes);
    },
    calldatasize() {
      //console.log('calldatasize: ', calldatasize)
      return calldatasize
    },
    finish(returnOffset) {
      const returnVal = new Uint8Array(Memory.buffer, returnOffset, 32);
      let returnHex = '';
      for (var i = 0; i < 32; i++) {
        if (returnVal[i] < 16) returnHex += '0';
            returnHex += returnVal[i].toString(16);
      }
      console.log("[finish] return val:", returnHex);
    },
    printStack() {
      console.log('STACK')
      var i = 0;
      while (i < BignumStackTop.value) {
        let elem_pos = BignumStackStartOffset + 32 * i;
        const elem = new Uint8Array(Memory.buffer, elem_pos, 32);
        console.log(elem_pos + ':' + i + ' | ' + pp(elem))
        i++;
      }
      console.log('')
    },
    printMemory(max) {
      console.log('MEMORY')
      var i = 0;
      while (i < max) {
        let elem_pos = EVMMemoryStartOffset + 16 * i;

        const elem = new Uint8Array(Memory.buffer, elem_pos, 16);
        let ix = i * 16
        console.log(elem_pos + ': 0x' + ix.toString(16) + ' | ' + pp(elem))
        i++;
      }
      console.log('')
    },
    printMemSlot(arr) {
      console.log('>', arr)
      const elem = new Uint8Array(Memory.buffer, arr, 32);
      console.log(pp(elem))
    },
    printOpcode(pc, opnum, value) {
      var opcode = 'UNK'
      switch (opnum) {
      case 0x52:
        opcode = 'MSTORE'
        break
      case 0x60:
        opcode = 'PUSH1'
        break
      case 0x36:
        opcode = 'CALLDATASIZE'
        break
      }
      
      console.log('====================================================')
      console.log((pc - 1) + ' ' +  opcode, ' [' + value.toString(16) + ']')
      console.log('====================================================')
    }
  },
  env: {
    abort(_msg, _file, line, column) {
      console.error("[abort] abort called at main.ts:" + line + ":" + column);
    },
    log(value) {
      var op = ''
      if (value >= 1000) {
        value = value - 1000
        if (value == 0x60)
          op = '- PUSH1'
        if (value == 0x01)
          op = '- ADD'
        if (value == 0x52)
          op = '- MSTORE'
        if (value == 0x55)
          op = '- SSTORE'
        if (value == 0x36)
          op = '- CALLDATASIZE'
        if (value == 0x10)
          op = '- LT'
        if (value == 0x00)
          op = '- STOP'
        if (value == 0x57)
          op = '- JUMPI'
        if (value == 0x7c)
          op = '- PUSH29'
      }
      
      if (op == '') {
        console.log('[log]', value, '-', value.toString(16))
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

