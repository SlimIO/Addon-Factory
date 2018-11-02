// Require Factories
const AddonFactory = require("./addonFactory");
const CallbackFactory = require("./callbackFactory");
const ComponentFactory = require("./componentFactory");

// Require Components
const Message = require("./components/message");

module.exports = {
    AddonFactory,
    CallbackFactory,
    ComponentFactory,
    Components: {
        Message
    }
};
