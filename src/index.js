// Require Factories
const AddonFactory = require("./addonFactory");
const CallbackFactory = require("./callbackFactory");

// Require Components
const Message = require("./components/message");

module.exports = {
    AddonFactory,
    CallbackFactory,
    Components: {
        Message
    }
};
