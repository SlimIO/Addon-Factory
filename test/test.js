// Require Third-party Dependencies
const avaTest = require("ava");

// Require Internal Dependencies
const { AddonFactory } = require("..");

avaTest("AddonFactory (name argument should be typeof string)", (assert) => {
    const { message } = assert.throws(() => {
        new AddonFactory(5);
    }, TypeError);
    assert.is(message, "(name argument should be typeof string)");
});
