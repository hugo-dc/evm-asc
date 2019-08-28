const fs = require('fs');
const loader = require('assemblyscript/lib/loader')

const TWO_POW256 = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000')

let BignumStackTop = 0;
let Memory;

let BignumStackStartOffset;
let EVMMemoryStartOffset;


//let calldata = '26bceb59802431afcbce1fc194c9eaa417b2fb67dc75a95db0bc7ec6b1c8af11df6a1da9a1f5aac137876480252e5dcac62c354ec0d42b76b0642b6181ed099849ea1d57'
let calldata = new Uint8Array([38, 188, 235, 89, 128, 36, 49, 175, 203, 206, 31, 193, 148, 201, 234, 164, 23, 178, 251, 103, 220, 117, 169, 93, 176, 188, 126, 198, 177, 200, 175, 17, 223, 106, 29, 169, 161, 245, 170, 193, 55, 135, 100, 128, 37, 46, 93, 202, 198, 44, 53, 78, 192, 212, 43, 118, 176, 100, 43, 97, 129, 237, 9, 152, 73, 234, 29, 87])
//let calldatasize = calldata.length

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
      let stack_elem_a_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 1)
      let stack_elem_b_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 2)
      const arrayA = new Uint8Array(Memory.buffer, stack_elem_a_pos, 32)
      const arrayB = new Uint8Array(Memory.buffer, stack_elem_b_pos, 32)
      
      const elemA = arrayToBn(arrayA)
      const elemB = arrayToBn(arrayB)

      const result = elemA + elemB
      const resultBytes = bnToArray(result)

      let outOffset = stack_elem_b_pos
      // pop 2 push 1, top is reduced by 1
      BignumStackTop.value = BignumStackTop.value - 1
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)
    },
    mul256() {
      let a_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 1)
      let b_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 2)
      const arrA = new Uint8Array(Memory.buffer, a_pos, 32)
      const arrB = new Uint8Array(Memory.buffer, b_pos, 32)

      const elemA = arrayToBn(arrA)
      const elemB = arrayToBn(arrB)

      const result = ( elemA * elemB ) % TWO_POW256
      const resultBytes = bnToArray(result)

      let outOffset = b_pos
      BignumStackTop.value = BignumStackTop.value - 1
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)
    },
    sub256() {
      let a_pos = BignumStackStartOffset + 32 *(BignumStackTop.value - 1)
      let b_pos = BignumStackStartOffset + 32 *(BignumStackTop.value - 2)
      const arrA = new Uint8Array(Memory.buffer, a_pos, 32)
      const arrB = new Uint8Array(Memory.buffer, b_pos, 32)

      const elemA = arrayToBn(arrA)
      const elemB = arrayToBn(arrB)

      const result = elemA - elemB
      const resultBytes = bnToArray(result)

      let outOffset = b_pos
      BignumStackTop.value = BignumStackTop.value - 1

      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)

    }, 
    div256() {
      let a_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 1)
      let b_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 2)
      const arrA = new Uint8Array(Memory.buffer, a_pos, 32)
      const arrB = new Uint8Array(Memory.buffer, b_pos, 32)

      const elemA = arrayToBn(arrA)
      const elemB = arrayToBn(arrB)

      const result = elemA / elemB

      const resultBytes = bnToArray(result)

      let outOffset = b_pos
      BignumStackTop.value = BignumStackTop.value - 1
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)

    },
    lt() {
      let stack_elem_a_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 1)
      let stack_elem_b_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 2)
      
      const arrayA = new Uint8Array(Memory.buffer, stack_elem_a_pos, 32)
      const arrayB = new Uint8Array(Memory.buffer, stack_elem_b_pos, 32)

      const elemA = arrayToBn(arrayA)
      const elemB = arrayToBn(arrayB)

      let result = BigInt(0)
      if (elemA < elemB) {
        result = BigInt(1)
      } 

      const resultBytes = bnToArray(result)

      let outOffset = stack_elem_b_pos
      // pop 2 push 1, top is reduced by 1
      BignumStackTop.value = BignumStackTop.value - 1
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)
    },
    eq() {
      let a_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 1)
      let b_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 2)

      const arrA = new Uint8Array(Memory.buffer, a_pos, 32)
      const arrB = new Uint8Array(Memory.buffer, b_pos, 32)

      const elemA = arrayToBn(arrA)
      const elemB = arrayToBn(arrB)

      let result = BigInt(0)
      if (elemA == elemB) {
        result = BigInt(1)
      }

      const resultBytes = bnToArray(result)
      let outOffset = b_pos
      BignumStackTop.value = BignumStackTop.value - 1
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)
    },
    isZero() {
      let stack_elem_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 1)
      const arrValue = new Uint8Array(Memory.buffer, stack_elem_pos, 32)
      const value = arrayToBn(arrValue)

      let result = BigInt(0)
      if (value == 0) {
        result = BigInt(1)
      }

      const resultBytes = bnToArray(result)
      let outOffset = stack_elem_pos
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(resultBytes)
      
    },
    not256() {
      let elem_pos = BignumStackStartOffset + 32 * (BignumStackTop.value - 1)
      const arrValue = new Uint8Array(Memory.buffer, elem_pos, 32)
      const result = new Uint8Array(32)

      for (var i=0; i < 32; i++)
        result[i] = ~ arrValue[i]

      let outOffset = elem_pos
      const outputBytes = new Uint8Array(Memory.buffer, outOffset, 32)
      outputBytes.set(result)
    },
    callvalue() {
      return 0
    },
    calldataload(offset) {
      let stack_elem_pos = BignumStackStartOffset + (32 * BignumStackTop.value)
      const elem = new Uint8Array(Memory.buffer, stack_elem_pos, 32)

      for (let i = offset; i < offset+32 ; i++) {
        elem[i - offset] = calldata[i]
      }

      BignumStackTop.value = BignumStackTop.value + 1
    },
    calldatasize() {
      //console.log('calldatasize: ', calldatasize)
      return calldata.length
    },
    finish(returnOffset, len) {
      const returnVal = new Uint8Array(Memory.buffer, returnOffset, len)
      let returnHex = ''
      for (var i = 0; i < len; i++) {
        if (returnVal[i] < 16) returnHex += '0'
            returnHex += returnVal[i].toString(16)
      }
      console.log(`Return Data: 0x${returnHex}`)
    },
    calculatePC(pc) {
      let cond_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 2)
      const cond_array = new Uint8Array(Memory.buffer, cond_pos, 32)
      const cond = arrayToBn(cond_array)
      
      if (cond != 0) {
        let dest_pos = BignumStackStartOffset + 32*(BignumStackTop.value - 1)
        const dest_array = new Uint8Array(Memory.buffer, dest_pos, 32)
        const dest_bn = arrayToBn(dest_array)

        BignumStackTop.value = BignumStackTop.value - 2
        return Number(dest_bn)
      } else {
        BignumStackTop.value = BignumStackTop.value - 2
        return pc
      }
    },
    printStack() {
      console.log('STACK')
      var i = 0;
      while (i < BignumStackTop.value) {
        let elem_pos = BignumStackStartOffset + 32 * i;
        const elem = new Uint8Array(Memory.buffer, elem_pos, 32);
        const elem_bn = arrayToBn(elem)

        console.log(`${i} - ${elem_bn}`)
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
        console.log(`${elem_pos}: 0x${ix.toString(16)} | ${pp(elem)}`)
        i++;
      }
      console.log('')
    },
    printMemSlot(arr) {
      console.log('>', arr)
      const elem = new Uint8Array(Memory.buffer, arr, 32);
      console.log(pp(elem))
    },
    printOpcode(pc, opnum) {
      var opcode = `UNK (0x${opnum.toString(16)})`
      switch (opnum) {
      case 0x00:
        opcode = 'STOP'
        break
      case 0x01:
        opcode = 'ADD'
        break
      case 0x02:
        opcode = 'MUL'
        break
      case 0x03:
        opcode = 'SUB'
        break
      case 0x04:
        opcode = 'DIV'
        break
      case 0x10:
        opcode = 'LT'
        break
      case 0x14:
        opcode = 'EQ'
        break
      case 0x15:
        opcode = 'ISZERO'
        break
      case 0x19:
        opcode = 'NOT'
        break
      case 0x34:
        opcode = 'CALLVALUE'
        break
      case 0x35:
        opcode = 'CALLDATALOAD'
        break
      case 0x36:
        opcode = 'CALLDATASIZE'
        break
      case 0x39:
        opcode = 'CODECOPY'
        break
      case 0x50:
        opcode = 'POP'
        break
      case 0x51:
        opcode = 'MLOAD'
        break
      case 0x52:
        opcode = 'MSTORE'
        break
      case 0x55:
        opcode = 'SSTORE'
        break
      case 0x56:
        opcode = 'JUMP'
        break
      case 0x57:
        opcode = 'JUMPI'
        break
      case 0x5b:
        opcode = 'JUMPDEST'
        break
      case 0x60:
        opcode = 'PUSH1'
        break
      case 0x61:
        opcode = 'PUSH2'
        break
      case 0x63:
        opcode = 'PUSH4'
        break
      case 0x7c:
        opcode = 'PUSH29'
        break
      case 0x80:
        opcode = 'DUP1'
        break
      case 0x81:
        opcode = 'DUP2'
        break
      case 0x82:
        opcode = 'DUP3'
        break
      case 0x90:
        opcode = 'SWAP1'
        break
      case 0x91:
        opcode = 'SWAP2'
        break
      case 0x92:
        opcode = 'SWAP3'
        break
      case 0xf3:
        opcode = 'RETURN'
        break
      case 0xfd:
        opcode = 'REVERT'
        break
      case 0xfe:
        opcode = 'INVALID'
        break
      }
      
      console.log('------------------------------------------------------------------------------------------------------------')
      console.log(`${pc - 1} ${opcode}`)
      //console.log('====================================================')
      console.log('')
    }
  },
  env: {
    abort(_msg, _file, line, column) {
      console.error("[abort] abort called at main.ts:" + line + ":" + column);
    },
    log(value) {
      console.log('[log]', '0x' + value.toString(16), '/', value)
    }
  },
})

Memory = obj.memory
BignumStackTop = obj.BignumStackTop
console.log('BignumStackTop: ', BignumStackTop)
var res = obj.run_evm()

