# Debog 

![npm](https://img.shields.io/npm/v/debog.svg)
![david-dm](https://david-dm.org/UnicornHeartClub/debog.svg)
[![Build Status](https://travis-ci.com/UnicornHeartClub/debog.svg?branch=master)](https://travis-ci.com/UnicornHeartClub/debog)

A simple TypeScript decorator to add performance timing to your class methods.

![minified size](https://badgen.net/bundlephobia/min/debog)
![minzipped size](https://badgen.net/bundlephobia/minzip/debog)

## Installation

```bash
$ yarn add debog
```

### Requirements

This library uses [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html). Ensure `experimentalDecorators` is enabled in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

## Usage

Import `debog` into a TypeScript file and append your classes with the decorator. Pass the names of any methods you want to profile.
`debog` automatically waits for async methods to resolve before timing!

```typescript
import debog from 'debog'

@debog('longMethod', 'shortMethod', 'asyncMethod')
export default class MyClass {
  longMethod = () => {
    let output = 0
    for (let i = 0; i < 100000; i++) {
      output += i
    }
    return output
  }

  shortMethod = () => {
    let output = 0
    for (let i = 0; i < 10; i++) {
      output += i
    }
    return output
  }

  asyncMethod = async () => new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
}

const example = new MyClass()
example.shortMethod() // logs "shortMethod took 0ms"
example.longMethod() // logs "longMethod took 3ms"
example.asyncMethod() // logs "asyncMethod took 1000ms"
```

You can alternatively restrict output until a certain threshold is reached. For example, to log when a method takes longer than 5ms:

```typescript
import debog from 'debog'

@debog(5, 'waitMethod', 'instantMethod')
export default class MyClass {
  waitMethod = async () => new Promise(resolve => {
    setTimeout(resolve, 10)
  })

  instantMethod = () => {
    return 42
  }
}

const example = new MyClass()
await example.waitMethod() // logs "waitMethod took 10ms"
example.instantMethod() // logs nothing
```

### Output

You are not restricted to using `console.log` as output. In fact, you can
output any timing call to any destination you want such as statsd, prometheus,
etc.

Simply override the expose `logger` attribute.

```typescript
import debog from 'debog'

debog.logger = (timing: number, methodName: string) => {
  // process information
  // default: console.log(`%c%d took %sms`, 'color: red', method, timing)
}
```

## API

This library exports one default decorator function, defined as:

```typescript
interface Debog {
  (...params: [number | string, ...string[]]): any
  logger(timing: number, method: string): void
}
```

## License

MIT
