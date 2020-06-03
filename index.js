"use strict";

// Require Third-party Dependencies
const astring = require("astring");
const { Program, VariableDeclaration, Identifier, Helpers } = require("node-estree");
const oop = require("@slimio/oop");

// Require Internal Dependencies
const {
    importPackage,
    exportAddon,
    createAddon,
    createCallback,
    registerCallback,
    scheduleCallback,
    addonLockOn,
    addonIsReady,
    onEvent
} = require("./src/presets");

class AddonFactory {
    #hasConfigPackage = false;

    constructor(addonName, options = Object.create(null)) {
        this.addonName = oop.toString(addonName);
        this.addonOptions = {
            verbose: Boolean(options.verbose),
            description: oop.toNullableString(options.description) ?? ""
        };

        this.callbacks = new Map();
        this.scheduled = [];
        this.locks = [];
        this.importProfiles = Boolean(options.importProfiles);
    }

    lockOn(addonName) {
        this.locks.push(addonLockOn(this.addonName, addonName));

        return this;
    }

    registerCallback(name, body = []) {
        this.callbacks.set(name, createCallback(name, body));

        return this;
    }

    scheduleCallback(callbackName, options = {}) {
        if (!this.callbacks.has(callbackName)) {
            throw new Error("unknown callback");
        }

        this.scheduled.push(scheduleCallback(this.addonName, callbackName, options));

        return this;
    }

    generateCode() {
        const AST = new Program("module");
        AST.add(importPackage("Addon", "@slimio/addon"));
        if (this.scheduled.length > 0) {
            AST.add(importPackage("Scheduler", "@slimio/scheduler"));
        }
        if (this.importProfiles) {
            AST.add(importPackage("Config", "@slimio/config"));
            AST.add(importPackage("profilesLoader", "@slimio/profiles"));
            this.#hasConfigPackage = true;
        }

        AST.add({ type: "NewLine" });
        if (this.importProfiles) {
            // TODO: implement void declaration in node-estree
            // console.log(VariableDeclaration.createOne("let", "profiles").toJSON());
            // AST.add();
        }
        AST.add(createAddon(this.addonName, this.addonOptions));
        for (const node of this.locks) {
            AST.add(node);
        }

        AST.add({ type: "NewLine" });
        AST.add(addonIsReady(this.addonName, this.locks.length > 0 ? "awake" : "start"));
        AST.add({ type: "NewLine" });
        if (this.importProfiles) {
            const node = onEvent(this.addonName, "stop", {
                body: [Helpers.FastCall(null, ["profiles", "free"])()]
            });
            AST.add(node);
        }

        AST.add({ type: "NewLine" });
        for (const [callbackName, node] of this.callbacks.entries()) {
            AST.add(node);
            AST.add(registerCallback(this.addonName, callbackName));
        }

        for (const node of this.scheduled) {
            AST.add(node);
        }

        AST.add({ type: "NewLine" });
        AST.add(exportAddon(this.addonName));

        return astring.generate(AST.toJSON(), {
            comments: true,
            generator: {
                ...astring.baseGenerator,
                NewLine(node, state) {
                    state.write("");
                }
            }
        });
    }
}

const addon = new AddonFactory("cpu", { importProfiles: true });
addon.lockOn("events");
addon.registerCallback("SayHello");
addon.scheduleCallback("SayHello");
console.log(addon.generateCode());

// module.exports = AddonFactory;

