# AddonFactory
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/Addon-Factory/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/Addon-Factory/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/Addon-Factory)
![size](https://img.shields.io/github/languages/code-size/SlimIO/Addon-Factory)
[![Known Vulnerabilities](https://snyk.io//test/github/SlimIO/Addon-Factory/badge.svg?targetFile=package.json)](https://snyk.io//test/github/SlimIO/Addon-Factory?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Addon-Factory.svg?branch=master)](https://travis-ci.com/SlimIO/Addon-Factory) [![Greenkeeper badge](https://badges.greenkeeper.io/SlimIO/Addon-Factory.svg)](https://greenkeeper.io/)

SlimIO Addon Factory. This package has been created to programmatically generate a SlimIO Addon (with all required default settings).

## Requirements
- [Node.js](https://nodejs.org/en/) v12 or higher

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

## API

### AddonFactory

<details><summary>constructor(name: string, options?: AddonOptions)</summary>

Create a new Addon Factory. First argument is the name of the Addon.
```js
const myAddon = new AddonFactory("myAddon");
```

Available options are:

| name | default value | description |
| --- | --- | --- |
| splitCallbackRegistration | **true** | separe function declaration from callback declaration |

</details>

<details><summary>addCallback(callback: CallbackFactory): this</summary>

Add a given Callback to the Addon. The callback must be created using the CallbackFactory class.
</details>

<details><summary>scheduleCallback(callbackName: string, options: any): this</summary>

Schedule a callback by his name (must has been declared with addCallback before). Options are the same as the SlimIO Official Scheduler.
</details>

<details><summary>generate(path: string): Promise< this ></summary>

Generate addon at the given **path** location.
</details>

### CallbackFactory

<details><summary>constructor(name: string)</summary>

Create a new CallbackFactory Object with a given **name** (the name of the callback). name must be indented in snake_case.
</details>

<details><summary>add(component: ComponentFactory): this</summary>

Add a new ComponentFactory. Look at the ComponentFactory and Built-in components sections.
</details>

<details><summary>return(value: any): this</summary>

Return any value. Under the hood we use **JSON.stringify** to put your value in the String source.
</details>

### ComponentFactory
ComponentFactory has been designed to be an Abstraction for CallbackFactory. Use it to extend any component you want to add into a callback.

Exemple taken from the core test:
```js
class MyStream extends ComponentFactory {
    // eslint-disable-next-line
    toString() {
        return "\tconst wS = new Addon.Stream();\n" +
            "\tsetTimeout(() => {wS.write('hello');wS.end();}, 200);\n" +
            "\treturn wS;\n";
    }
}
```

## Built-in Components

### Message
Message component has been build to publish a given message in a Callback.
```js
const {
    AddonFactory, CallbackFactory, Components: { Message }
} = require("@slimio/addon-factory");

const cb = new CallbackFactory("callme")
    .add(new Message("AddonName.callme"))
    .add(new Message("AddonName.stream_com"))
    .return({ error: null });

const Ex = new AddonFactory("Ex")
    .addCallback(cb)
    .generate(__dirname);
```

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|Type checker|
|[@slimio/utils](https://github.com/SlimIO/Utils#readme)|Minor|High|Bunch of useful functions|
|[is-snake-case](https://github.com/sunitJindal/is-snake-case#readme)|Minor|Low|Snake case checker|

## License
MIT
