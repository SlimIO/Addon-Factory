// Require NodeJS Dependencies
const { writeFile } = require("fs").promises;
const { join } = require("path");

// Require Third-Party Dependencies
const { taggedString, createDirectory } = require("@slimio/utils");
const is = require("@slimio/is");

// Require Internal Dependencies
const CallbackFactory = require("./callbackFactory");

// Helpers
const AddonParts = {
    require: "const Addon = require(\"@slimio/addon\");\n",
    requireScheduler: "const Scheduler = require(\"@slimio/scheduler\");\n",
    create: taggedString`const ${0} = new Addon("${0}");\n\n`,
    export: taggedString`module.exports = ${0};\n`,
    schedule: taggedString`${0}.schedule("${1}", new Scheduler(${2}));\n`,
    registerCallback: taggedString`${0}.registerCallback("${1}", ${1});\n`,
    registerCallbackInOne: taggedString`${0}.registerCallback("${1}", ${2});\n\n`,
    ready: taggedString`${0}.on(\"start\", () => {\n    ${0}.ready();\n});\n\n`
};

// Symbols
const Callbacks = Symbol("Callbacks");

/**
 * @class AddonFactory
 *
 * @property {String} name
 * @property {Boolean} splitCallbackRegistration
 */
class AddonFactory {

    /**
     * @constructor
     * @param {!String} name addonName
     * @param {Object=} [options={}] Factory Options
     * @throws {TypeError}
     */
    constructor(name, options = Object.create(null)) {
        if (typeof name !== "string") {
            throw new TypeError("name argument should be typeof string");
        }

        this.name = name;
        /** @type {CallbackFactory[]} */
        this[Callbacks] = [];

        /** @type {Set<String>} */
        this.callbacks = new Set();

        /** @type {Map<String, String>} */
        this.schedules = new Map();

        this.splitCallbackRegistration = is.bool(options.splitCallbackRegistration) ?
            options.splitCallbackRegistration : true;
    }

    /**
     * @public
     * @method addCallback
     * @param {!CallbackFactory} callback callback
     * @returns {this}
     */
    addCallback(callback) {
        if (!(callback instanceof CallbackFactory)) {
            throw new TypeError("callback should be instanceof CallbackFactory!");
        }
        this.callbacks.add(callback.name);
        this[Callbacks].push(callback);

        return this;
    }

    /**
     * @public
     * @method scheduleCallback
     * @param {!String} callbackName callback name
     * @param {Object=} options scheduler options!
     * @returns {this}
     */
    scheduleCallback(callbackName, options) {
        if (!this.callbacks.has(callbackName)) {
            throw new Error(`Unknow callback ${callbackName}`);
        }
        this.schedules.set(callbackName, JSON.stringify(options));

        return this;
    }

    /**
     * @public
     * @async
     * @method generater
     * @param {!String} path directory (or path) where we want to create the Addon
     * @returns {Promise<this>}
     *
     * @throws {TypeError}
     */
    async generate(path) {
        if (typeof path !== "string") {
            throw new TypeError("path argument should be typeof string");
        }

        // Create Addon dir
        const addonDir = join(path, this.name);
        await createDirectory(addonDir);

        // Generate the Addon code
        const fRet = [AddonParts.require];
        if (this.schedules.size > 0) {
            fRet.push(AddonParts.requireScheduler);
        }

        fRet.push("\n", AddonParts.create(this.name));
        if (this.splitCallbackRegistration) {
            fRet.push(...this[Callbacks].map((cb) => `${cb.toString()}\n\n`));
            for (const cb of this[Callbacks]) {
                fRet.push(AddonParts.registerCallback(this.name, cb.name));
            }
            fRet.push("\n");
        }
        else {
            for (const cb of this[Callbacks]) {
                fRet.push(AddonParts.registerCallbackInOne(this.name, cb.name, cb.toString()));
            }
        }

        for (const [name, options] of this.schedules.entries) {
            fRet.push(AddonParts.schedule(this.name, name, options));
        }

        fRet.push(AddonParts.ready(this.name), AddonParts.export(this.name));

        // Write Index.js File
        await writeFile(join(addonDir, "index.js"), fRet.join(""));

        return this;
    }
}

module.exports = AddonFactory;
