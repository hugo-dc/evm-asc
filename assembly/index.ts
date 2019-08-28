@external("env", "log")
declare function log(a: i32): void

@external("main", "setBignumStack")
declare function setBignumStack(startData: i32, len: i32): void

@external("main", "setMemoryPtr")
declare function setMemoryPtr(startData: i32, len: i32): void

@external("main", "add256")
declare function add256(): void

@external("main", "mul256")
declare function mul256(): void

@external("main", "sub256")
declare function sub256(): void

@external("main", "div256")
declare function div256(): void

@external("main", "lt")
declare function ltFunc(): void

@external("main", "eq")
declare function eqFunc(): void

@external("main", "isZero")
declare function isZeroFunc(): void

@external("main", "not256")
declare function notFunc(): void

@external("main", "calldatasize")
declare function getcalldatasize(): i32

@external("main", "calldataload")
declare function getcalldata(offset: i32): void

@external("main", "callvalue")
declare function getcallvalue(): i32

@external("main", "finish")
declare function finish(returnOffset: i32, length: i32): void

@external("main", "calculatePC")
declare function calculatePC(pc: i32): i32

@external("main", "printOpcode")
declare function printOpcode(pc: i32, opcode: i32): void

@external("main", "printStack")
declare function printStack(): void

@external("main", "printMemory")
declare function printMemory(max: i32): void

@external("main", "printMemSlot")
declare function printMemSlot(arr: Uint8Array): void

// bignum stack size is 100 elements
// each stack element is 32 bytes
let BignumStackSize = 100
let BignumElementSize = 32
let BignumStack = new ArrayBuffer(BignumElementSize * BignumStackSize)

let BignumStackPtr = changetype<usize>(BignumStack)
setBignumStack(BignumStackPtr, 100)

let BignumStackElements = Array.create<Uint8Array>(100)

for (let i = 0; i < BignumStackSize; i++) {
  BignumStackElements[i] = Uint8Array.wrap(BignumStack, i*BignumElementSize, 32)
}

let MemorySize = 100
let MemoryElementSize = 16
let Memory = new ArrayBuffer(MemoryElementSize * MemorySize)
let MemoryPtr = changetype<usize>(Memory)
setMemoryPtr(MemoryPtr, 100)
let MemoryElements = Array.create<Uint8Array>(100)

for (let i = 0; i < MemorySize; i++) {
    MemoryElements[i] = Uint8Array.wrap(Memory, i * MemoryElementSize, 16)
}

//@global
export let BignumStackTop: i32 = 0

// EVM Bytecode
let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87, 124, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 53, 4, 99, 38, 188, 235, 89, 129, 20, 97, 0, 63, 87, 91, 96, 0, 128, 253, 91, 52, 128, 21, 97, 0, 75, 87, 96, 0, 128, 253, 91, 80, 97, 0, 111, 96, 4, 128, 54, 3, 96, 64, 129, 16, 21, 97, 0, 98, 87, 96, 0, 128, 253, 91, 80, 128, 53, 144, 96, 32, 1, 53, 97, 0, 129, 86, 91, 96, 64, 128, 81, 145, 130, 82, 81, 144, 129, 144, 3, 96, 32, 1, 144, 243, 91, 96, 0, 128, 91, 97, 39, 16, 129, 16, 21, 97, 1, 25, 87, 146, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 146, 96, 1, 1, 97, 0, 133, 86, 91, 80, 145, 146, 145, 80, 80, 86, 254, 161, 101, 98, 122, 122, 114, 48, 88, 32, 241, 119, 162, 139, 221, 145, 28, 48, 80, 232, 56, 92, 67, 2, 134, 171, 233, 224, 172, 166, 56, 129, 39, 238, 224, 11, 209, 57, 97, 172, 186, 106, 0, 41]

let result: i32 = 0
let pc: i32 = 0

const stop: u8 = 0x00
const add: u8 = 0x01
const mul: u8 = 0x02
const sub: u8 = 0x03
const div: u8 = 0x04
const lt: u8 = 0x10
const eq: u8 = 0x14
const iszero: u8 = 0x15
const opnot: u8 = 0x19
const callvalue: u8 = 0x34
const calldataload: u8 = 0x35
const calldatasize: u8 = 0x36
const codecopy: u8 = 0x39
const pop: u8 = 0x50
const mload: u8 = 0x51
const mstore: u8 = 0x52
const sstore: u8 = 0x55
const jump: u8 = 0x56
const jumpi: u8 = 0x57
const jumpdest: u8 = 0x5b
const push1: u8 = 0x60
const push2: u8 = 0x61
const push3: u8 = 0x62
const push4: u8 = 0x63
const push29: u8 = 0x7c
const dup1: u8 = 0x80
const dup2: u8 = 0x81
const dup3: u8 = 0x82
const swap1: u8 = 0x90
const swap2: u8 = 0x91
const swap3: u8 = 0x92
const opreturn: u8 = 0xf3
const revert: u8 = 0xfd
const invalid: u8 = 0xfe

export function run_evm(): i32 {
    while (pc < code_array.length) {
        let opcode: u8 = code_array[pc]
        pc++

        switch (opcode) {
        case push1: // 0x60
            result++
            let push_val = code_array[pc]
            
            printOpcode(pc, opcode)
            
            // now that the value has been read, advance pc to the next opcode
            pc++
            let stack_slot = BignumStackElements[BignumStackTop]

            for (let i = 0; i < 32; i++) {
                stack_slot[i] = 0
            }
            
            // 1 byte value goes in the last byte of the 32-byte stack slot
            stack_slot[31] = push_val
            
            BignumStackTop++

            printStack()
            
            break
        case push2: // 0x61
            result++
            printOpcode(pc, opcode)
            
            let push_val1 = code_array[pc]
            pc++
            let push_val2 = code_array[pc]
            pc++
            
            let stack_slot = BignumStackElements[BignumStackTop]

            for (let i = 0; i < 30 ; i++) {
                stack_slot[i] = 0
            }

            stack_slot[30] = push_val1
            stack_slot[31] = push_val2
            BignumStackTop++
            
            printStack()
            break
        case push4: // 0x63
            result++
            printOpcode(pc, opcode)
            
            let push_val1 = code_array[pc]
            pc++
            let push_val2 = code_array[pc]
            pc++
            let push_val3 = code_array[pc]
            pc++
            let push_val4 = code_array[pc]
            pc++

            let stack_slot = BignumStackElements[BignumStackTop]

            for (let i = 0; i < 28; i++) {
                stack_slot[i] = 0
            }

            stack_slot[28] = push_val1
            stack_slot[29] = push_val2
            stack_slot[30] = push_val3
            stack_slot[31] = push_val4
            BignumStackTop++

            printStack()
            break
        case push29: // 0x7c
            result++
            printOpcode(pc, push29)

            let stack_slot = BignumStackElements[BignumStackTop]
            for (let i = 0; i < 29; i++) {
                stack_slot[i+3] = code_array[pc]
                pc++
            }

            BignumStackTop++

            printStack()
            
            break
        case add: // 0x01
            result++
            printOpcode(pc, add)
            add256()
            printStack()
            break
        case mul: // 0x02
            result++
            //printOpcode(pc, opcode)
            mul256()
            //printStack()
            break
        case sub: // 0x03
            result++
            printOpcode(pc, opcode)
            sub256()
            printStack()
            break
        case div: // 0x04
            result++
            printOpcode(pc, opcode)
            div256()
            printStack()
            break
        case sstore: // 0x55
            result++
            BignumStackTop = BignumStackTop - 3
            let result_slot = BignumStackElements[BignumStackTop]
            finish(result_slot.dataStart, 32)
            break
        case pop: // 0x50
            result++
            printOpcode(pc, pop)
            BignumStackTop--
            printStack()
            break
        case mload: // 0x51
            result++
            printOpcode(pc, opcode)

            // pop memid
            let memid_slot = BignumStackElements[BignumStackTop - 1]
            let memid = memid_slot[31]

            // get value from memory
            memid = memid / 16 + 1
            let mem_slot = MemoryElements[memid]
            let value = mem_slot[15]

            let stack_slot = BignumStackElements[BignumStackTop - 1]

            for (let i = 0; i < 32; i++) {
                stack_slot[i] = 0
            }

            stack_slot[31] = value

            printStack()
            printMemory(10)
            break
        case mstore: // 0x52
            result++
            printOpcode(pc, opcode)

            // pop memid
            BignumStackTop--
            let memid_slot = BignumStackElements[BignumStackTop]
            let memid = memid_slot[31]

            // pop memval
            BignumStackTop--
            let memval_slot = BignumStackElements[BignumStackTop]
            let memval = memval_slot[31]

            memid = memid / 16

            let mem_slot1 = MemoryElements[memid]
            let mem_slot2 = MemoryElements[memid + 1]

            // set value in memory
            for(let i = 0; i < 32; i++) {
                if (i > 15) {
                    mem_slot2[i-16] = memval_slot[i]
                } else {
                    mem_slot1[i] = memval_slot[i]
                }
            }

            // show stack
            printStack()
            
            // print memory
            printMemory(memid + 2)

            break
        case callvalue: // 0x34
            result++
            printOpcode(pc, opcode)
            let call_value = getcallvalue()

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[31] = call_value

            BignumStackTop++

            printStack()
            break
        case calldataload: // 0x35
            result++
            printOpcode(pc, opcode)

            // pop position
            BignumStackTop--
            let pos_slot = BignumStackElements[BignumStackTop]
            let pos = pos_slot[31]

            getcalldata(pos)
            printStack()
            break
        case calldatasize: // 0x36
            result++
            printOpcode(pc, opcode)
            
            let data_size = getcalldatasize()

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[31] = data_size

            BignumStackTop++
            
            printStack()
            break
        case codecopy: // 0x39
            result++
            printOpcode(pc, codecopy)
            break
        case lt:      // 0x10
            result++
            printOpcode(pc, lt)
            ltFunc()
            printStack()
            break
        case eq:     // 0x14
            result++
            printOpcode(pc, opcode)
            eqFunc()
            printStack()
            break
        case iszero: // 0x15
            result++
            printOpcode(pc, iszero)

            isZeroFunc()
            printStack()
            
            break
        case opnot: // 0x19
            result++
            printOpcode(pc, opcode)
            notFunc()
            printStack()
            break
        case stop: // 0x00
            printOpcode(pc, opcode)
            pc = code_array.length     // finish execution
            printStack()
            break
        case jump: // 0x56
            result++

            // pop destination
            BignumStackTop--
            let dest_slot = BignumStackElements[BignumStackTop]
            let dest = dest_slot[31]

            printOpcode(pc, opcode)

            pc = dest

            printStack()
            break
        case jumpi: // 0x57
            result++
            printOpcode(pc, jumpi)
            pc = calculatePC(pc)
            printStack()
            
            break
        case jumpdest: // 0x5b
            result++
            printOpcode(pc, jumpdest)
            printStack()
            break
        case dup1:    // 0x80
            printOpcode(pc, dup1)

            // get value
            let value_slot = BignumStackElements[BignumStackTop - 1]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            for (let i = 0; i < 32; i++) {
                dup_slot[i] = value_slot[i]
            }

            BignumStackTop++
            printStack()
            
            break
        case dup2:  // 0x81
            printOpcode(pc, opcode)

            // get value
            let value_slot = BignumStackElements[BignumStackTop - 2]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            for (let i = 0; i < 32; i++) {
                dup_slot[i] = value_slot[i]
            }

            BignumStackTop++
            printStack()
            break
        case dup3:  // 0x82
            printOpcode(pc, opcode)
            
            // get value
            let value_slot = BignumStackElements[BignumStackTop - 3]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            for (var i= 0; i < 32; i++) {
                dup_slot[i] = value_slot[i]
            }

            BignumStackTop++
            printStack()
            break
        case swap1: // 0x90
            printOpcode(pc, opcode)
            
            // get stack top
            let top_slot = BignumStackElements[BignumStackTop - 1]

            // get value
            let value = BignumStackElements[BignumStackTop - 2]

            let temp = new Uint8Array(32)

            for (let i = 0; i < 32; i++) {
                temp[i] = value[i]
            }

            for (let i = 0; i < 32; i++) {
                value[i] = top_slot[i]
            }

            for (let i = 0; i < 32; i++) {
                top_slot[i] = temp[i]
            }

            printStack()
            break
        case swap2: // 0x91
            printOpcode(pc, opcode)

            // get stack top
            let top_slot = BignumStackElements[BignumStackTop - 1]

            // get value
            let value = BignumStackElements[BignumStackTop - 3]

            let temp = new Uint8Array(32)

            for (let i = 0; i < 32; i++) {
                temp[i] = value[i]
            }

            for (let i = 0; i < 32; i++) {
                value[i] = top_slot[i]
            }

            for (let i = 0; i < 32; i++) {
                top_slot[i] = temp[i]
            }

            printStack()
            break
        case swap3: // 0x92
            printOpcode(pc, opcode)

            // get stack top
            let top_slot = BignumStackElements[BignumStackTop - 1]

            // get value
            let value = BignumStackElements[BignumStackTop - 4]

            // temp
            let temp = new Uint8Array(32)

            for (let i = 0; i < 32; i++) {
                temp[i] = value[i]
            }

            for (let i = 0; i < 32; i++) {
                value[i] = top_slot[i]
            }

            for (let i = 0; i < 32; i++) {
                top_slot[i] = temp[i]
            }

            printStack()
            break
        case opreturn:  // 0xf3
            printOpcode(pc, opcode)

            // pop offset
            let offset_slot = BignumStackElements[BignumStackTop - 1]
            let offset = offset_slot[31]

            // pop length
            let length_slot = BignumStackElements[BignumStackTop - 2]
            let length = length_slot[31]

            offset = offset / 16

            let mem_slot = MemoryElements[offset]
            
            printStack()
            printMemory(offset + 2)
            
            finish(mem_slot.dataStart, length)

            pc = code_array.length // finish execution
            break
        case revert: // 0xfd
            pc = code_array.length      // finish execution
            printOpcode(pc, revert)
            printStack()

            break
        case invalid:
            pc = code_array.length     // finish execution
            printOpcode(pc, invalid)
            printStack()
            break
        default:
            printOpcode(pc, opcode)
            pc = code_array.length  // unknown opcode, finish execution
            break
        }
    }

    return result
}
