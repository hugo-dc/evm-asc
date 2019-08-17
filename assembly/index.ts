@external("env", "log")
declare function log(a: i32): void

@external("main", "setBignumStack")
declare function setBignumStack(startData: i32, len: i32): void

@external("main", "setMemoryPtr")
declare function setMemoryPtr(startData: i32, len: i32): void

@external("main", "add256")
declare function add256(): void

@external("main", "lt")
declare function ltFunc(): void

@external("main", "isZero")
declare function isZeroFunc(): void

@external("main", "calldatasize")
declare function getcalldatasize(): i32

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

//                                                                       v
//let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87, 124, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 53, 4, 99, 38, 188, 235, 89, 129, 20, 97, 0, 63, 87, 91, 96, 0, 128, 253, 91, 52, 128, 21, 97, 0, 75, 87, 96, 0, 128, 253, 91, 80, 97, 0, 111, 96, 4, 128, 54, 3, 96, 64, 129, 16, 21, 97, 0, 98, 87, 96, 0, 128, 253, 91, 80, 128, 53, 144, 96, 32, 1, 53, 97, 0, 129, 86, 91, 96, 64, 128, 81, 145, 130, 82, 81, 144, 129, 144, 3, 96, 32, 1, 144, 243, 91, 96, 0, 128, 91, 97, 39, 16, 129, 16, 21, 97, 1, 25, 87, 146, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 146, 96, 1, 1, 97, 0, 133, 86, 91, 80, 145, 146, 145, 80, 80, 86, 254, 161, 101, 98, 122, 122, 114, 48, 88, 32, 241, 119, 162, 139, 221, 145, 28, 48, 80, 232, 56, 92, 67, 2, 134, 171, 233, 224, 172, 166, 56, 129, 39, 238, 224, 11, 209, 57, 97, 172, 186, 106, 0, 41];

// let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87];

// constructor test
let code_array: u8[] = [96, 128, 96, 64, 82, 52, 128, 21, 97, 0, 16, 87, 96, 0, 128, 253, 91, 80, 97, 1, 152, 128, 97, 0, 32, 96, 0, 57, 96, 0, 243, 254]

let result: i32 = 0
let pc: i32 = 0

const stop: u8 = 0x00
const add: u8 = 0x01
const lt: u8 = 0x10
const iszero: u8 = 0x15
const callvalue: u8 = 0x34
const calldatasize: u8 = 0x36
const codecopy: u8 = 0x39
const pop: u8 = 0x50
const mstore: u8 = 0x52
const sstore: u8 = 0x55
const jumpi: u8 = 0x57
const jumpdest: u8 = 0x5b
const push1: u8 = 0x60
const push2: u8 = 0x61
const push29: u8 = 0x7c
const dup1: u8 = 0x80
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
            let stack_slot1 = BignumStackElements[BignumStackTop]
            stack_slot1[31] = push_val1
            BignumStackTop++
            
            let push_val2 = code_array[pc]
            pc++
            let stack_slot2 = BignumStackElements[BignumStackTop]
            stack_slot2[31] = push_val2
            BignumStackTop++

            printOpcode(pc, opcode, push_val2)

            printStack()
            break
        case add:
            result++
            printOpcode(pc, add, 0)
            //let left = BignumStackElements[BignumStackTop-1];
            //let right = BignumStackElements[BignumStackTop-2];
            add256();
            break;
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
            printOpcode(pc, jumpi, 0)

            // pop destination
            BignumStackTop--
            let dest_slot = BignumStackElements[BignumStackTop]
            let dest = dest_slot[31]

            // pop condition
            BignumStackTop--
            let cond_slot = BignumStackElements[BignumStackTop]
            let cond = cond_slot[31]

            if (cond != 0) {
                log(42) // TODO: jump
            }

            printStack()
            
            break
        case jumpdest:
            result++
            printOpcode(pc, jumpdest, 0)
            break
        case push29:
            result++
            printOpcode(pc, push29, 0)
            break
        case dup1:
            printOpcode(pc, dup1, 0)

            // get value
            let value_slot = BignumStackElements[BignumStackTop - 1]
            let value = value_slot[31]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            dup_slot[31] = value

            BignumStackTop++

            printStack()
            
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
