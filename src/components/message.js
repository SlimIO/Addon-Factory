"use strict";

// Require Third-party Dependencies
const is = require("@slimio/is");

// Require Internal Dependencies
const ComponentFactory = require("../componentFactory");

/**
 * @class Message
 * @augments ComponentFactory
 * @property {string} target message target
 * @property {boolean} noReturn
 * @property {Array} args
 */
class Message extends ComponentFactory {
    /**
     * @class
     * @memberof Message#
     * @param {!string} target message target
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
     * @function timeOut
     * @memberof Message#
     * @param {!number} timeMs timeOut time in Milliseconds
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
     * @function noReturn
     * @memberof Message#
     * @param {!boolean} bool New noReturn value
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
     * @function arg
     * @memberof Message#
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
     * @function toString
     * @memberof Message#
     * @param {!string} addonName current addon Name
     * @returns {string}
     */
    toString(addonName) {
        return `${addonName}.sendMessage("${this.target}", ${JSON.stringify(this.options)});\n`;
    }
}

module.exports = Message;
