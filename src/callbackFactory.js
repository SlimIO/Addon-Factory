// Require Third-party Dependencies
const isSnakeCase = require("is-snake-case");
const is = require("@slimio/is");

// Require Internal Dependencies
const ComponentFactory = require("./componentFactory");

/**
 * @class CallbackFactory
 *
 * @property {String} name
 * @property {String} returnValue
 * @property {any[]} components
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
        /** @type {String} */
        this.returnValue = null;
        this.components = new Set();
    }

    /**
     * @public
     * @method add
     * @param {!ComponentFactory} component component to add
     * @returns {this}
     *
     * @throws {TypeError}
     */
    add(component) {
        if (!(component instanceof ComponentFactory)) {
            throw new TypeError("component should be instanceof ComponentFactory!");
        }

        this.components.add(component);

        return this;
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
     * @param {!String} addonName name of the current Addon!
     * @returns {String}
     */
    toString(addonName) {
        const components = [...this.components]
            .map((co) => `\t${co.toString(addonName)}`)
            .join("").concat("\n");

        return `async function ${this.name}() {\n${components}\treturn ${this.returnValue};\n}`;
    }

    // eslint-disable-next-line
    get [Symbol.toStringTag]() {
        return "Callback";
    }

}

module.exports = CallbackFactory;

