"use strict";

// Require Third-party Dependencies
const {
    Identifier, Literal, VariableDeclaration, FunctionDeclaration,
    Modules: { ImportDeclaration, ExportDefaultDeclaration },
    Expression: { NewExpression, ArrowFunctionExpression, AwaitExpression },
    Helpers: { CreateSimpleObject, FastCall }
} = require("node-estree");
const is = require("@slimio/is");

function importPackage(name, source) {
    return ImportDeclaration(source, [name]);
}

function exportAddon(identifier) {
    return ExportDefaultDeclaration(identifier);
}

function createAddon(name, options, classIdentifier = Identifier.stringToIdentifier("Addon")) {
    const args = [new Literal(name)];
    if (is.plainObject(options)) {
        args.push(CreateSimpleObject(Object.entries(options)));
    }
    const init = NewExpression(classIdentifier, args);

    return VariableDeclaration.createOne("const", name, init);
}

function addonIsReady(name, defaultEvent = "start") {
    const body = [
        FastCall(AwaitExpression, [name, "ready"])()
    ];

    return onEvent(name, defaultEvent, { async: true, body });
}

function scheduleCallback(name, callbackName, options = {}) {
    const args = [
        new Literal(callbackName),
        NewExpression(new Identifier("Scheduler"), [CreateSimpleObject(Object.entries(options))])
    ];

    return FastCall(null, [name, "schedule"])(args);
}

function addonLockOn(name, lockOnName) {
    return FastCall(null, [name, "lockOn"])(
        [new Literal(lockOnName)]
    );
}

function onEvent(name, eventName, options = Object.create(null)) {
    const { async = false, body = [] } = options;

    return FastCall(null, [name, "on"])([
        new Literal(eventName), ArrowFunctionExpression(body, void 0, async)
    ]);
}

function createCallback(name, body = []) {
    const params = [new Identifier("header")];

    return new FunctionDeclaration(name, params, body, {
        async: true
    });
}

function registerCallback(name, identifier) {
    return FastCall(null, [name, "registerCallback"])(
        [new Identifier(identifier)]
    );
}

module.exports = {
    importPackage,
    exportAddon,
    createAddon,
    addonIsReady,
    addonLockOn,
    createCallback,
    scheduleCallback,
    registerCallback,
    onEvent
};
