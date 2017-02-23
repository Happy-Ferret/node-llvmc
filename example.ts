import * as llvmc from './src/wrapped';
import { LLVM } from './src/llvmc';

// Create a module.
let mod = llvmc.Module.create("some_module");

// Add a function to the module.
let paramtypes = new Buffer(0);
let functype = LLVM.LLVMFunctionType(LLVM.LLVMInt32Type(), paramtypes, 0,
                                     false);
let main = mod.addFunction("main", functype);

// Add a single basic block to the function.
let entry = main.appendBasicBlock("entry");

// Build a tiny program in the block.
let builder = llvmc.Builder.create();
builder.positionAtEnd(entry);
let arg1 = llvmc.constInt(34, llvmc.Type.int32());
let arg2 = llvmc.constInt(8, llvmc.Type.int32());
let sum = builder.add(arg1, arg2, "sum");
builder.ret(sum);
builder.free();

// Dump the IR as bitcode to disk.
let err = mod.writeBitcodeToFile("out.bc");
if (err) {
  console.error("write failed", err);
}

// Write the IR as text to the console.
console.log(mod.toString());

mod.free();
