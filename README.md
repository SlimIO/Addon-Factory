# AddonFactory
SlimIO Addon Factory. This API has been created to generate generic boilerplate of SlimIO Addon(s).

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/addon-factory
# or
$ yarn add @slimio/addon-factory
```

## Usage example

This example show you how to create an Addon with name `myAddon` and a callback that will return `null`.

```js
const { AddonFactory, CallbackFactory } = require("@slimio/addon-factory");

async function main() {
    const cbTest = new CallbackFactory("callme")
        .return({ error: null });

    const myAddon = new AddonFactory("myAddon")
        .addCallback(cbTest);

    await myAddon.generate("./addons");
}
main().catch(console.error);
```
