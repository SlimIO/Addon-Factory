// Require Third-party Dependencies
const is = require("@slimio/is");

// Require Internal Dependencies
const ComponentFactory = require("../componentFactory");

/**
 * @class Message
 * @extends ComponentFactory
 */
class Message extends ComponentFactory {
    /**
     * @constructor
     * @param {!String} target message target
     */
    constructor(target) {
        super();
        if (typeof target !== "string") {
            throw new TypeError("target should be typeof string!");
        }

        this.target = target;
        this.options = {
            noReturn: true,
            args: []
        };
    }

    /**
     * @method timeOut
     * @param {!Number} timeMs timeOut time in Milliseconds
     * @returns {Message}
     *
     * @throws {TypeError}
     */
    timeOut(timeMs) {
        if (!is.number(timeMs)) {
            throw new TypeError("timeMs should be typeof number");
        }
        Reflect.set(this.options, "timeout", timeMs);

        return this;
    }

    /**
     * @method noReturn
     * @param {!Boolean} bool New noReturn value
     * @returns {Message}
     *
     * @throws {TypeError}
     */
    noReturn(bool) {
        if (!is.bool(bool)) {
            throw new TypeError("bool should be typeof Boolean");
        }
        this.options.noReturn = bool;

        return this;
    }

    /**
     * @method arg
     * @param {any} value any javascript primitive value!
     * @returns {Message}
     *
     * @throws {TypeError}
     */
    arg(value) {
        if (!is.primitive(value)) {
            throw new TypeError("value should be a primitive javascript value");
        }
        this.options.args.push(value);

        return this;
    }

    /**
     * @method toString
     * @param {!String} addonName current addon Name
     * @returns {String}
     */
    toString(addonName) {
        return `${addonName}.sendMessage("${this.target}", ${JSON.stringify(this.options)});\n`;
    }
}

module.exports = Message;
