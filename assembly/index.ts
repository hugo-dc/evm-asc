@external("env", "log")
declare function log(a: i32): void

@external("main", "setBignumStack")
declare function setBignumStack(startData: i32, len: i32): void

@external("main", "setMemoryPtr")
declare function setMemoryPtr(startData: i32, len: i32): void

@external("main", "add256")
declare function add256(): void

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

@external("main", "calldatasize")
declare function getcalldatasize(): i32

@external("main", "calldataload")
declare function getcalldata(offset: i32): void

@external("main", "callvalue")
declare function getcallvalue(): i32

@external("main", "finish")
declare function finish(returnOffset: i32): void

@external("main", "printOpcode")
declare function printOpcode(pc: i32, opcode: i32, value: i32): void

@external("main", "printStack")
declare function printStack(): void

@external("main", "printMemory")
declare function printMemory(max: i32): void

@external("main", "printMemSlot")
declare function printMemSlot(arr: Uint8Array): void

// 0x6001600101600055
// [ 96, 1, 96, 1, 1, 96, 0, 85 ]

// bignum stack size is 100 elements
// each stack element is 32 bytes
let BignumStackSize = 100;
let BignumElementSize = 32;
let BignumStack = new ArrayBuffer(BignumElementSize * BignumStackSize);

let BignumStackPtr = changetype<usize>(BignumStack);
setBignumStack(BignumStackPtr, 100);

//let BignumStackElements = new Array<Uint8Array>(100);
let BignumStackElements = Array.create<Uint8Array>(100);

for (let i = 0; i < BignumStackSize; i++) {
  BignumStackElements[i] = Uint8Array.wrap(BignumStack, i*BignumElementSize, 32);
}

let MemorySize = 100;
let MemoryElementSize = 16;
let Memory = new ArrayBuffer(MemoryElementSize * MemorySize);
let MemoryPtr = changetype<usize>(Memory);
setMemoryPtr(MemoryPtr, 100);
let MemoryElements = Array.create<Uint8Array>(100);

for (let i = 0; i < MemorySize; i++) {
    MemoryElements[i] = Uint8Array.wrap(Memory, i * MemoryElementSize, 16);
}

//@global
//export let BignumStackTop: i32 = 96;
export let BignumStackTop: i32 = 0;

//let code_array: u8[] = [96, 171, 96, 13, 1, 96, 0, 85];
//let code_array: u8[] = [96, 7, 96, 13, 1, 96, 0, 85];

// actual code test                                                            v
//let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87, 124, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 53, 4, 99, 38, 188, 235, 89, 129, 20, 97, 0, 63, 87, 91, 96, 0, 128, 253, 91, 52, 128, 21, 97, 0, 75, 87, 96, 0, 128, 253, 91, 80, 97, 0, 111, 96, 4, 128, 54, 3, 96, 64, 129, 16, 21, 97, 0, 98, 87, 96, 0, 128, 253, 91, 80, 128, 53, 144, 96, 32, 1, 53, 97, 0, 129, 86, 91, 96, 64, 128, 81, 145, 130, 82, 81, 144, 129, 144, 3, 96, 32, 1, 144, 243, 91, 96, 0, 128, 91, 97, 39, 16, 129, 16, 21, 97, 1, 25, 87, 146, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 146, 96, 1, 1, 97, 0, 133, 86, 91, 80, 145, 146, 145, 80, 80, 86, 254, 161, 101, 98, 122, 122, 114, 48, 88, 32, 241, 119, 162, 139, 221, 145, 28, 48, 80, 232, 56, 92, 67, 2, 134, 171, 233, 224, 172, 166, 56, 129, 39, 238, 224, 11, 209, 57, 97, 172, 186, 106, 0, 41];

// partial code test
let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87, 124, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 53, 4, 99, 38, 188, 235, 89, 129, 20, 97, 0, 63, 87, 91, 96, 0, 128, 253, 91, 52, 128, 21, 97, 0, 75, 87, 96, 0, 128, 253, 91, 80, 97, 0, 111, 96, 4, 128, 54, 3, 96, 64, 129, 16, 21, 97, 39, 98, 87, 96, 0, 128, 253, 91, 80, 128, 53, 144];

// constructor test
// let code_array: u8[] = [96, 128, 96, 64, 82, 52, 128, 21, 97, 0, 16, 87, 96, 0, 128, 253, 91, 80, 97, 1, 152, 128, 97, 0, 32, 96, 0, 57, 96, 0, 243, 254]

let result: i32 = 0
let pc: i32 = 0

const stop: u8 = 0x00
const add: u8 = 0x01
const sub: u8 = 0x03
const div: u8 = 0x04
const lt: u8 = 0x10
const eq: u8 = 0x14
const iszero: u8 = 0x15
const callvalue: u8 = 0x34
const calldataload: u8 = 0x35
const calldatasize: u8 = 0x36
const codecopy: u8 = 0x39
const pop: u8 = 0x50
const mstore: u8 = 0x52
const sstore: u8 = 0x55
const jumpi: u8 = 0x57
const jumpdest: u8 = 0x5b
const push1: u8 = 0x60
const push2: u8 = 0x61
const push3: u8 = 0x62
const push4: u8 = 0x63
const push29: u8 = 0x7c
const dup1: u8 = 0x80
const dup2: u8 = 0x81
const swap1: u8 = 0x90
const opreturn: u8 = 0xf3
const revert: u8 = 0xfd
const invalid: u8 = 0xfe

export function run_evm(): i32 {
    while (pc < code_array.length) {
        let opcode: u8 = code_array[pc]
        pc++

        switch (opcode) {
        case push1:
            result++
            let push_val = code_array[pc]
            
            printOpcode(pc, opcode, push_val)
            
            // now that the value has been read, advance pc to the next opcode
            pc++;
            let stack_slot = BignumStackElements[BignumStackTop]
            // 1 byte value goes in the last byte of the 32-byte stack slot
            stack_slot[31] = push_val
            
            BignumStackTop++

            printStack()
            
            break
        case push2:
            result++
            let push_val1 = code_array[pc]
            pc++
            let push_val2 = code_array[pc]
            pc++
            
            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[0] = 0
            stack_slot[1] = 0
            stack_slot[2] = 0
            stack_slot[3] = 0
            stack_slot[4] = 0
            stack_slot[5] = 0
            stack_slot[6] = 0
            stack_slot[7] = 0
            stack_slot[8] = 0
            stack_slot[9] = 0
            stack_slot[10] = 0
            stack_slot[11] = 0
            stack_slot[12] = 0
            stack_slot[13] = 0
            stack_slot[14] = 0
            stack_slot[15] = 0
            stack_slot[16] = 0
            stack_slot[17] = 0
            stack_slot[18] = 0
            stack_slot[19] = 0
            stack_slot[20] = 0
            stack_slot[21] = 0
            stack_slot[22] = 0
            stack_slot[23] = 0
            stack_slot[24] = 0
            stack_slot[25] = 0
            stack_slot[26] = 0
            stack_slot[27] = 0
            stack_slot[28] = 0
            stack_slot[29] = 0
            stack_slot[30] = push_val1
            stack_slot[31] = push_val2
            BignumStackTop++
            
            printOpcode(pc, opcode, push_val2)
            printStack()
            break
        case push4:
            result++
            let push_val1 = code_array[pc]
            pc++
            let push_val2 = code_array[pc]
            pc++
            let push_val3 = code_array[pc]
            pc++
            let push_val4 = code_array[pc]
            pc++

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[0] = 0
            stack_slot[1] = 0
            stack_slot[2] = 0
            stack_slot[3] = 0
            stack_slot[4] = 0
            stack_slot[5] = 0
            stack_slot[6] = 0
            stack_slot[7] = 0
            stack_slot[8] = 0
            stack_slot[9] = 0
            stack_slot[10] = 0
            stack_slot[11] = 0
            stack_slot[12] = 0
            stack_slot[13] = 0
            stack_slot[14] = 0
            stack_slot[15] = 0
            stack_slot[16] = 0
            stack_slot[17] = 0
            stack_slot[18] = 0
            stack_slot[19] = 0
            stack_slot[20] = 0
            stack_slot[21] = 0
            stack_slot[22] = 0
            stack_slot[23] = 0
            stack_slot[24] = 0
            stack_slot[25] = 0
            stack_slot[26] = 0
            stack_slot[27] = 0
            stack_slot[28] = push_val1
            stack_slot[29] = push_val2
            stack_slot[30] = push_val3
            stack_slot[31] = push_val4
            BignumStackTop++

            printOpcode(pc, opcode, push_val4)
            printStack()
            break
        case push29:
            result++

            let push_val1 = code_array[pc]
            pc++
            let push_val2 = code_array[pc]
            pc++
            let push_val3 = code_array[pc]
            pc++
            let push_val4 = code_array[pc]
            pc++
            let push_val5 = code_array[pc]
            pc++
            let push_val6 = code_array[pc]
            pc++
            let push_val7 = code_array[pc]
            pc++
            let push_val8 = code_array[pc]
            pc++
            let push_val9 = code_array[pc]
            pc++
            let push_val10 = code_array[pc]
            pc++
            let push_val11 = code_array[pc]
            pc++
            let push_val12 = code_array[pc]
            pc++
            let push_val13 = code_array[pc]
            pc++
            let push_val14 = code_array[pc]
            pc++
            let push_val15 = code_array[pc]
            pc++
            let push_val16 = code_array[pc]
            pc++
            let push_val17 = code_array[pc]
            pc++
            let push_val18 = code_array[pc]
            pc++
            let push_val19 = code_array[pc]
            pc++
            let push_val20 = code_array[pc]
            pc++
            let push_val21 = code_array[pc]
            pc++
            let push_val22 = code_array[pc]
            pc++
            let push_val23 = code_array[pc]
            pc++
            let push_val24 = code_array[pc]
            pc++
            let push_val25 = code_array[pc]
            pc++
            let push_val26 = code_array[pc]
            pc++
            let push_val27 = code_array[pc]
            pc++
            let push_val28 = code_array[pc]
            pc++
            let push_val29 = code_array[pc]
            pc++

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[3] = push_val1
            stack_slot[4] = push_val2
            stack_slot[5] = push_val3
            stack_slot[6] = push_val4
            stack_slot[7] = push_val5
            stack_slot[8] = push_val6
            stack_slot[9] = push_val7
            stack_slot[10] = push_val8
            stack_slot[11] = push_val9
            stack_slot[12] = push_val10
            stack_slot[13] = push_val11
            stack_slot[14] = push_val12
            stack_slot[15] = push_val13
            stack_slot[16] = push_val14
            stack_slot[17] = push_val15
            stack_slot[18] = push_val16
            stack_slot[19] = push_val17
            stack_slot[20] = push_val18
            stack_slot[21] = push_val19
            stack_slot[22] = push_val20
            stack_slot[23] = push_val21
            stack_slot[24] = push_val22
            stack_slot[25] = push_val23
            stack_slot[26] = push_val24
            stack_slot[27] = push_val25
            stack_slot[28] = push_val26
            stack_slot[29] = push_val27
            stack_slot[30] = push_val28
            stack_slot[31] = push_val29

            BignumStackTop++

            printOpcode(pc, push29, 0)
            printStack()
            
            break
        case add:
            result++
            printOpcode(pc, add, 0)
            add256()
            printStack()
            break;
        case sub:
            result++
            printOpcode(pc, opcode, 0)
            sub256()
            printStack()
            break
        case div:
            result++
            printOpcode(pc, opcode, 0)
            div256()
            printStack()
            break
        case sstore:
            result++
            //log(1000 + opcode)
            BignumStackTop = BignumStackTop - 3;
            let result_slot = BignumStackElements[BignumStackTop];
            finish(result_slot.dataStart);
            break;
        case pop:
            result++
            printOpcode(pc, pop, 0)
            BignumStackTop--
            printStack()
            break
        case mstore:
            result++
            printOpcode(pc, opcode, 0)

            // pop memid
            BignumStackTop--
            let memid_slot = BignumStackElements[BignumStackTop]
            let memid = memid_slot[31]

            // pop memval
            BignumStackTop--
            let memval_slot = BignumStackElements[BignumStackTop]
            let memval = memval_slot[31]

            // set value in memory
            memid = memid / 16 + 1 // + 1 move to next half
            let mem_slot = MemoryElements[memid]
            mem_slot[15] = memval

            // show stack
            printStack()
            
            // print memory
            printMemory(memid + 1)

            break
        case callvalue:
            result++
            printOpcode(pc, opcode, 0)
            let call_value = getcallvalue()

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[31] = call_value

            BignumStackTop++

            printStack()
            break
        case calldataload:
            result++
            printOpcode(pc, opcode, 0)
            BignumStackTop--
            let pos_slot = BignumStackElements[BignumStackTop]
            let pos = pos_slot[31]

            getcalldata(pos)
            printStack()
            break
        case calldatasize:
            result++
            printOpcode(pc, opcode, 0)

            let data_size = getcalldatasize()

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[31] = data_size

            BignumStackTop++
            
            printStack()
            //printMemory(6)
            break
        case codecopy:
            result++
            printOpcode(pc, codecopy, 0)
            break
        case lt:
            result++
            printOpcode(pc, lt, 0)
            ltFunc()
            printStack()
            break
        case eq:
            result++
            printOpcode(pc, opcode, 0)
            eqFunc()
            printStack()
            break
        case iszero:
            result++
            printOpcode(pc, iszero, 0)

            isZeroFunc()

            printStack()
            
            break
        case stop:
            result++
            printOpcode(pc, stop, 0)
            break
        case jumpi:
            result++

            // pop destination
            BignumStackTop--
            let dest_slot = BignumStackElements[BignumStackTop]
            let dest = dest_slot[31]

            // pop condition
            BignumStackTop--
            let cond_slot = BignumStackElements[BignumStackTop]
            let cond = cond_slot[31]

            printOpcode(pc, jumpi, dest)

            if (cond != 0) {
                pc = dest
            }

            printStack()
            
            break
        case jumpdest:
            result++
            printOpcode(pc, jumpdest, 0)
            printStack()
            break
        case dup1:
            printOpcode(pc, dup1, 0)

            // get value
            let value_slot = BignumStackElements[BignumStackTop - 1]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            dup_slot[30] = value_slot[30]
            dup_slot[31] = value_slot[31]

            BignumStackTop++
            printStack()
            
            break
        case dup2:
            printOpcode(pc, opcode, 0)

            // get value
            let value_slot = BignumStackElements[BignumStackTop - 2]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            dup_slot[28] = value_slot[28]
            dup_slot[29] = value_slot[29]
            dup_slot[30] = value_slot[30]
            dup_slot[31] = value_slot[31]

            BignumStackTop++
            printStack()
            break
        case swap1: // TODO
            printOpcode(pc, opcode, 0)

            // get stack top
            let top_slot = BignumStackElements[BignumStackTop - 1]

            // get value 
            break
        case opreturn:
            printOpcode(pc, opreturn, 0)
            break
        case revert:
            printOpcode(pc, revert, 0)
            printMemory(10)
            // get offset
            // get length
            // get return data from memory
            // finish w/ return data
            break
        case invalid:
            printOpcode(pc, invalid, 0)
            break
        default:
            log(opcode)
            break;
        }

        //pc++;
    }

    return result;
}
