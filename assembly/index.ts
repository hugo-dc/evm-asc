@external("env", "log")
declare function log(a: i32): void

@external("main", "setBignumStack")
declare function setBignumStack(startData: i32, len: i32): void

@external("main", "add256")
declare function add256(): void

@external("main", "finish")
declare function finish(returnOffset: i32): void

// 0x6001600101600055
// [ 96, 1, 96, 1, 1, 96, 0, 85 ]

// bignum stack size is 100 elements
// each stack element is 32 bytes
let BignumStackSize = 100;
let BignumElementSize = 32;
let BignumStack = new ArrayBuffer(BignumElementSize*BignumStackSize);

let BignumStackPtr = changetype<usize>(BignumStack);
setBignumStack(BignumStackPtr, 100);

//let BignumStackElements = new Array<Uint8Array>(100);
let BignumStackElements = Array.create<Uint8Array>(100);

for (let i = 0; i < BignumStackSize; i++) {
  BignumStackElements[i] = Uint8Array.wrap(BignumStack, i*BignumElementSize, 32);
}

//@global
//export let BignumStackTop: i32 = 96;
export let BignumStackTop: i32 = 96;

//let code_array: u8[] = [96, 7, 96, 13, 1, 96, 0, 85];
let code_array: u8[] = [96, 171, 96, 13, 1, 96, 0, 85];
let result: i32 = 0;
let pc: i32 = 0;

const push1: u8 = 0x60;
const add: u8 = 0x01;
const sstore: u8 = 0x55;

export function getBignumStackTop(): i32 {
    return BignumStackTop;
}

export function run_evm(): i32 {
    //code_array = [ 96, 1, 96, 1, 1, 96, 0, 85 ]

    while (pc < code_array.length) {
        let opcode: i8 = code_array[pc];
        pc++;
        log(1000 + opcode)
        switch (opcode) {
        case push1:
            
            result = result + 1;
            let push_val = code_array[pc];
            //log(push_val)
            // now that the value has been read, advance pc to the next opcode
            pc++;
            log(BignumStackTop);
            let stack_slot = BignumStackElements[BignumStackTop];
            // 1 byte value goes in the last byte of the 32-byte stack slot
            stack_slot[31] = push_val;

            BignumStackTop++;
            break;

        case add:
            //let left = BignumStackElements[BignumStackTop-1];
            //let right = BignumStackElements[BignumStackTop-2];
            add256();
            break;

        case sstore:
            //sayHello();
            BignumStackTop = BignumStackTop - 3;
            let result_slot = BignumStackElements[BignumStackTop];
            finish(result_slot.dataStart);
            break;

        default:
            break;
        }

        //pc++;
    }

    return result;
}
