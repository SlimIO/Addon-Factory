"use strict";

// Require Third-party Dependencies
const isSnakeCase = require("is-snake-case");
const is = require("@slimio/is");

// Require Internal Dependencies
const ComponentFactory = require("./componentFactory");

/**
 * @class CallbackFactory
 *
 * @property {string} name
 * @property {string} returnValue
 * @property {Set} components
 */
class CallbackFactory {
    /**
     * @function
     * @memberof CallbackFactory#
     * @param {!string} name Callback name
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
        /** @type {string} */
        this.returnValue = null;
        this.components = new Set();
    }

    /**
     * @public
     * @function add
     * @memberof CallbackFactory#
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
     * @function return
     * @memberof CallbackFactory#
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
     * @function toString
     * @memberof CallbackFactory#
     * @param {!string} addonName name of the current Addon!
     * @returns {string}
     */
    toString(addonName) {
        const components = [...this.components]
            .map((co) => `\t${co.toString(addonName)}`)
            .join("").concat("\n");
        const returnValue = this.returnValue === null ? "" : `\treturn ${this.returnValue};`;

        return `async function ${this.name}() {\n${components}${returnValue}\n}`;
    }

    // eslint-disable-next-line
    get [Symbol.toStringTag]() {
        return "Callback";
    }
}

module.exports = CallbackFactory;

