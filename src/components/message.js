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
     * @method arg
     * @param {any} value any javascript primitive value!
     * @returns {this}
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
