/** @format */

import debog from '../'

import Bluebird from 'bluebird'
import { Promise as ShimPromise } from 'es6-promise'

/**
 * Example class
 *
 * We purporsely define functions in different ways to ensure we properly wrap them all
 */
class ExampleClass {
  noopLoop() {
    let output = 0
    for (let i = 0; i < 10; i++) {
      output += i
    }
    return output
  }

  longLoop = () => {
    let output = 0
    for (let i = 0; i < 1000000; i++) {
      output += i
    }
    return output
  }

  // Ensure multiple types of async functions are properly awaited
  async asyncFunction() {
    await Promise.resolve('test')
    return 'async'
  }

  nativePromise() {
    return new Promise(resolve => setTimeout(() => resolve('native'), 10))
  }

  bluebirdPromise() {
    return new Bluebird(resolve => setTimeout(() => resolve('bluebird'), 10))
  }

  shimPromise() {
    return new ShimPromise(resolve => setTimeout(() => resolve('shim'), 10))
  }
}

describe('debog', () => {
  let log: jest.SpyInstance

  beforeEach(() => {
    // prevent actual console logs, we just care if it was called or not
    log = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    log.mockClear()
  })

  it('logs when a class method is invoked', () => {
    @debog('noopLoop')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    example.noopLoop()

    expect(log).toHaveBeenCalled()
  })

  it('returns the original value of the method', () => {
    @debog('noopLoop')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    const power = example.noopLoop()

    expect(power).toBe(45)
  })

  it('logs when a threshold is exceeded', () => {
    @debog(1, 'longLoop')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    example.longLoop()

    expect(log).toHaveBeenCalled()
  })

  it('does not log when a threshold is not met', () => {
    @debog(20, 'longLoop')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    example.longLoop()

    expect(log).not.toHaveBeenCalled()
  })

  it('logs when an async class method is invoked', async () => {
    @debog('asyncFunction')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    const type = await example.asyncFunction()

    expect(log).toHaveBeenCalledTimes(1)
    expect(type).toBe('async')
  })

  it('logs when a native promise method is invoked', async () => {
    @debog('nativePromise')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    const type = await example.nativePromise()

    expect(log).toHaveBeenCalledTimes(1)
    expect(type).toBe('native')
  })

  it('logs when a bluebird promise method is invoked', async () => {
    @debog('bluebirdPromise')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    const type = await example.bluebirdPromise()

    expect(log).toHaveBeenCalledTimes(1)
    expect(type).toBe('bluebird')
  })

  it('logs when a shimmed es6 promise method is invoked', async () => {
    @debog('shimPromise')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    const type = await example.shimPromise()

    expect(log).toHaveBeenCalledTimes(1)
    expect(type).toBe('shim')
  })
})
