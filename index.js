const { AddonFactory, CallbackFactory } = require("./src");

async function main() {
    const cpu = new AddonFactory("cpu");
    cpu.addCallback(new CallbackFactory("cb_a").return({ yo: 9 }));
    cpu.addCallback(new CallbackFactory("cb_b").return(true));
    await cpu.generate("./test");
}
main().catch(console.error);
