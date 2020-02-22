"use strict";

// Require Third-party Dependencies
const astring = require("astring");
const { Program } = require("node-estree");
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
    addonIsReady
} = require("./src/presets");

class AddonFactory {
    constructor(addonName) {
        this.addonName = oop.toString(addonName);
        this.callbacks = new Map();
        this.scheduled = [];
        this.locks = [];
    }

    lockOn(addonName) {
        this.locks.push(addonLockOn(this.addonName, addonName));
    }

    registerCallback(name, body = []) {
        this.callbacks.set(name, createCallback(name, body));

        return this;
    }

    scheduleCallback(callbackName) {
        if (!this.callbacks.has(callbackName)) {
            throw new Error("unknown callback");
        }

        this.scheduled.push(scheduleCallback(this.addonName, callbackName, { interval: 1 }));
    }

    generateCode() {
        const AST = new Program("module");
        AST.add(importPackage("Addon", "@slimio/addon"));
        if (this.scheduled.length > 0) {
            AST.add(importPackage("Scheduler", "@slimio/scheduler"));
        }
        AST.add(createAddon(this.addonName));
        for (const node of this.locks) {
            AST.add(node);
        }
        AST.add(addonIsReady(this.addonName, this.locks.length > 0 ? "awake" : "start"));

        for (const [callbackName, node] of this.callbacks.entries()) {
            AST.add(node);
            AST.add(registerCallback(this.addonName, callbackName));
        }

        for (const node of this.scheduled) {
            AST.add(node);
        }

        AST.add(exportAddon(this.addonName));

        const code = astring.generate(AST.toJSON(), {
            comments: true
        });

        return code;
    }
}

const addon = new AddonFactory("cpu");
addon.lockOn("events");
addon.registerCallback("SayHello");
addon.scheduleCallback("SayHello");
console.log(addon.generateCode());

// module.exports = AddonFactory;

