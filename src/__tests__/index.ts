/** @format */

import debog from '../'

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

  async examineMeaningOfLife() {
    return new Promise(resolve => setTimeout(() => resolve(42), 10))
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
    @debog('examineMeaningOfLife')
    class TestClass extends ExampleClass {}

    const example = new TestClass()
    const life = await example.examineMeaningOfLife()

    expect(log).toHaveBeenCalledTimes(1)
    expect(life).toBe(42)
  })
})
