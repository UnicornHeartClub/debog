# Debog 

A simple TypeScript decorator to add performance timing to your class methods.

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

```typescript
import debog from 'debog'

@debog('longMethod', 'shortMethod')
export default class MyClass {
  /**
   * Loops a lot
   */
  longMethod = () => {
    let output = 0
    for (let i = 0; i < 100000; i++) {
      output += i
    }
    return output
  }

  /**
   * Loops a little
   */
  shortMethod = () => {
    let output = 0
    for (let i = 0; i < 10; i++) {
      output += i
    }
    return output
  }
}

const example = new MyClass()
example.shortMethod() // logs "shortMethod took 0ms"
example.longMethod() // logs "longMethod took 3ms" (you can expect your own numbers here)
```

You can alternatively restrict output until a certain threshold is reached. For example, to log when a method takes longer than 5ms:

```typescript
import debog from 'debog'

@debog(5, 'asyncMethod', 'instantMethod')
export default class MyClass {
  asyncMethod = async () => new Promise(resolve => {
    setTimeout(resolve, 6)
  })

  instantMethod = () => {
    return 42
  }
}

const example = new MyClass()
await example.asyncMethod() // logs "waitMethod took 6ms"
example.instantMethod() // logs nothing
```

## API

This library exports one default decorator function, defined as:

```typescript
function debog(...params: [number | string, ...string[]]);
```

## License

MIT
