// Require Third-party Dependencies
const avaTest = require("ava");

// Require Internal Dependencies
const { AddonFactory } = require("..");

avaTest("AddonFactory (name argument should be typeof string)", (assert) => {
    assert.throws(() => {
        new AddonFactory(5);
    }, { instanceOf: TypeError, message: "name argument should be typeof string" });
});
