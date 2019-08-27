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
declare function finish(returnOffset: i32): void

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
let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87, 124, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 53, 4, 99, 38, 188, 235, 89, 129, 20, 97, 0, 63, 87, 91, 96, 0, 128, 253, 91, 52, 128, 21, 97, 0, 75, 87, 96, 0, 128, 253, 91, 80, 97, 0, 111, 96, 4, 128, 54, 3, 96, 64, 129, 16, 21, 97, 0, 98, 87, 96, 0, 128, 253, 91, 80, 128, 53, 144, 96, 32, 1, 53, 97, 0, 129, 86, 91, 96, 64, 128, 81, 145, 130, 82, 81, 144, 129, 144, 3, 96, 32, 1, 144, 243, 91, 96, 0, 128, 91, 97, 39, 16, 129, 16, 21, 97, 1, 25, 87, 146, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 146, 96, 1, 1, 97, 0, 133, 86, 91, 80, 145, 146, 145, 80, 80, 86, 254, 161, 101, 98, 122, 122, 114, 48, 88, 32, 241, 119, 162, 139, 221, 145, 28, 48, 80, 232, 56, 92, 67, 2, 134, 171, 233, 224, 172, 166, 56, 129, 39, 238, 224, 11, 209, 57, 97, 172, 186, 106, 0, 41];

// partial code test
// let code_array: u8[] = [96, 128, 96, 64, 82, 96, 4, 54, 16, 97, 0, 58, 87, 124, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 53, 4, 99, 38, 188, 235, 89, 129, 20, 97, 0, 63, 87, 91, 96, 0, 128, 253, 91, 52, 128, 21, 97, 0, 75, 87, 96, 0, 128, 253, 91, 80, 97, 0, 111, 96, 4, 128, 54, 3, 96, 64, 129, 16, 21, 97, 39, 98, 87, 96, 0, 128, 253, 91, 80, 128, 53, 144, 96, 32, 1, 53, 97, 0, 129, 86, 91, 96, 64, 128, 81, 145, 130, 82, 81, 144, 129, 144, 3, 96, 32, 1, 144, 243, 91, 96, 0, 128, 91, 97, 39, 16, 129, 16, 21, 91, 1, 25, 87, 146, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 130, 2, 146, 96, 1, 1, 97, 0, 133];

// constructor test
// let code_array: u8[] = [96, 128, 96, 64, 82, 52, 128, 21, 97, 0, 16, 87, 96, 0, 128, 253, 91, 80, 97, 1, 152, 128, 97, 0, 32, 96, 0, 57, 96, 0, 243, 254]

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
            pc++;
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

            printStack()
            break
        case push29: // 0x7c
            result++
            printOpcode(pc, push29)

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

            BignumStackTop = BignumStackTop - 3;
            let result_slot = BignumStackElements[BignumStackTop];
            finish(result_slot.dataStart);
            break;
        case pop: // 0x50
            result++
            printOpcode(pc, pop)
            BignumStackTop--
            printStack()
            break
        case mstore:
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
            printOpcode(pc, opcode)
            let call_value = getcallvalue()

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[31] = call_value

            BignumStackTop++

            printStack()
            break
        case calldataload:
            result++
            printOpcode(pc, opcode)

            // pop position
            BignumStackTop--
            let pos_slot = BignumStackElements[BignumStackTop]
            let pos = pos_slot[31]

            getcalldata(pos)
            printStack()
            break
        case calldatasize:
            result++
            printOpcode(pc, opcode)
            
            let data_size = getcalldatasize()

            let stack_slot = BignumStackElements[BignumStackTop]
            stack_slot[31] = data_size

            BignumStackTop++
            
            printStack()
            break
        case codecopy:
            result++
            printOpcode(pc, codecopy)
            break
        case lt:
            result++
            printOpcode(pc, lt)
            ltFunc()
            printStack()
            break
        case eq:
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
        case jump:
            result++

            // pop destination
            BignumStackTop--
            let dest_slot = BignumStackElements[BignumStackTop]
            let dest = dest_slot[31]

            printOpcode(pc, opcode)

            pc = dest

            printStack()
            break
        case jumpi:
            result++
            printOpcode(pc, jumpi)
            pc = calculatePC(pc)
            log(pc)
            printStack()
            
            break
        case jumpdest:
            result++
            printOpcode(pc, jumpdest)
            printStack()
            break
        case dup1:
            printOpcode(pc, dup1)

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
            printOpcode(pc, opcode)

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
        case dup3:
            //printOpcode(pc, opcode)
            
            // get value
            let value_slot = BignumStackElements[BignumStackTop - 3]

            // push value
            let dup_slot = BignumStackElements[BignumStackTop]
            for (var i= 0; i < 32; i++) {
                dup_slot[i] = value_slot[i]
            }

            BignumStackTop++
            //printStack()
            break
        case swap1: // 0x90
            printOpcode(pc, opcode)
            
            // get stack top
            let top_slot = BignumStackElements[BignumStackTop - 1]

            // get value
            let value = BignumStackElements[BignumStackTop - 2]

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
            temp[0] = value[0]
            temp[1] = value[1]
            temp[2] = value[2]
            temp[3] = value[3]
            temp[4] = value[4]
            temp[5] = value[5]
            temp[6] = value[6]
            temp[7] = value[7]
            temp[8] = value[8]
            temp[9] = value[9]
            temp[10] = value[10]
            temp[11] = value[11]
            temp[12] = value[12]
            temp[13] = value[13]
            temp[14] = value[14]
            temp[15] = value[15]
            temp[16] = value[16]
            temp[17] = value[17]
            temp[18] = value[18]
            temp[19] = value[19]
            temp[20] = value[20]
            temp[21] = value[21]
            temp[22] = value[22]
            temp[23] = value[23]
            temp[24] = value[24]
            temp[25] = value[25]
            temp[26] = value[26]
            temp[27] = value[27]
            temp[28] = value[28]
            temp[29] = value[29]
            temp[30] = value[30]
            temp[31] = value[31]

            value[0] = top_slot[0]
            value[1] = top_slot[1]
            value[2] = top_slot[2]
            value[3] = top_slot[3]
            value[4] = top_slot[4]
            value[5] = top_slot[5]
            value[6] = top_slot[6]
            value[7] = top_slot[7]
            value[8] = top_slot[8]
            value[9] = top_slot[9]
            value[10] = top_slot[10]
            value[11] = top_slot[11]
            value[12] = top_slot[12]
            value[13] = top_slot[13]
            value[14] = top_slot[14]
            value[15] = top_slot[15]
            value[16] = top_slot[16]
            value[17] = top_slot[17]
            value[18] = top_slot[18]
            value[19] = top_slot[19]
            value[20] = top_slot[20]
            value[21] = top_slot[21]
            value[22] = top_slot[22]
            value[23] = top_slot[23]
            value[24] = top_slot[24]
            value[25] = top_slot[25]
            value[26] = top_slot[26]
            value[27] = top_slot[27]
            value[28] = top_slot[28]
            value[29] = top_slot[29]
            value[30] = top_slot[30]
            value[31] = top_slot[31]

            top_slot[0] = temp[0]
            top_slot[1] = temp[1]
            top_slot[2] = temp[2]
            top_slot[3] = temp[3]
            top_slot[4] = temp[4]
            top_slot[5] = temp[5]
            top_slot[6] = temp[6]
            top_slot[7] = temp[7]
            top_slot[8] = temp[8]
            top_slot[9] = temp[9]
            top_slot[10] = temp[10]
            top_slot[11] = temp[11]
            top_slot[12] = temp[12]
            top_slot[13] = temp[13]
            top_slot[14] = temp[14]
            top_slot[15] = temp[15]
            top_slot[16] = temp[16]
            top_slot[17] = temp[17]
            top_slot[18] = temp[18]
            top_slot[19] = temp[19]
            top_slot[20] = temp[20]
            top_slot[21] = temp[21]
            top_slot[22] = temp[22]
            top_slot[23] = temp[23]
            top_slot[24] = temp[24]
            top_slot[25] = temp[25]
            top_slot[26] = temp[26]
            top_slot[27] = temp[27]
            top_slot[28] = temp[28]
            top_slot[29] = temp[29]
            top_slot[30] = temp[30]
            top_slot[31] = temp[31]

            printStack()
            break
        case opreturn:
            printOpcode(pc, opcode)
            printStack()
            break
        case revert: // 0xfd
            pc = code_array.length      // finish execution
            printOpcode(pc, revert)
            printStack()
            //printMemory(10)

            // TODO:
            // get offset
            // get length
            // get return data from memory
            // finish w/ return data
            break
        case invalid:
            printOpcode(pc, invalid)
            printStack()
            break
        default:
            log(opcode)
            break;
        }

        //pc++;
    }

    return result;
}
