// Require Third-party Dependencies
const isSnakeCase = require("is-snake-case");
const is = require("@slimio/is");

/**
 * @class CallbackFactory
 *
 * @property {String} name
 * @property {any} returnValue
 */
class CallbackFactory {

    /**
     * @constructor
     * @param {!String} name Callback name
     * @throws {TypeError}
     */
    constructor(name) {
        if (typeof name !== "string") {
            throw new TypeError("name argument should be typeof string");
        }
        if (!isSnakeCase(name)) {
            throw new TypeError("name convention should be snake_case");
        }

        this.name = name;
        this.returnValue = null;
    }

    /**
     * @public
     * @chainable
     * @method return
     * @param {any} value Any JavaScript Object
     * @returns {this}
     *
     * @throws {TypeError}
     */
    return(value) {
        if (is.func(value)) {
            throw new TypeError("Function are not supported by the factory!");
        }
        this.returnValue = is.object(value) ? JSON.stringify(value) : String(value);

        return this;
    }

    /**
     * @public
     * @method toString
     * @returns {String}
     */
    toString() {
        return `async function ${this.name}() {\n    return ${this.returnValue};\n}`;
    }

    // eslint-disable-next-line
    get [Symbol.toStringTag]() {
        return "Callback";
    }

}

module.exports = CallbackFactory;

