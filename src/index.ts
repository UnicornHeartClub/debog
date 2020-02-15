/**
 * Timer decorator for measuring the performance of class method calls
 *
 * @format
 */
import now from 'performance-now'

export default function debog(...params: [number | string, ...string[]]) {
  const checkThreshold = typeof params[0] === 'number'
  let threshold = 0
  if (checkThreshold) {
    threshold = params.unshift()
  }

  return function TimerFactory<T extends { new (...args: any[]): {} }>(Target: T) {
    return class Timed extends Target {
      constructor(...args: any[]) {
        super(...args)

        for (let method of params) {
          this[method] = this.__time(this[method], method as string)
        }
      }

      // @FIXME this should be private or protected but tsc is throwing an error
      __time = (method: Function, name: string) => (...args: any[]) => {
        const s = now()

        let result = method(...args)

        const t = now() - s
        if (t >= threshold) {
          console.log('%c%s took %fms', 'color: red', name, t)
        }

        return result
      }
    }
  }
}

export function asyncDebog(...params: [number | string, ...string[]]) {
  const checkThreshold = typeof params[0] === 'number'
  let threshold = 0
  if (checkThreshold) {
    threshold = params.unshift()
  }

  return function TimerFactory<T extends { new (...args: any[]): {} }>(Target: T) {
    return class Timed extends Target {
      constructor(...args: any[]) {
        super(...args)

        for (let method of params) {
          this[method] = this.__asyncTime(this[method], method as string)
        }
      }

      // @FIXME this should be private or protected but tsc is throwing an error
      __asyncTime = (method: Function, name: string) => async (...args: any[]) => {
        const s = now()

        let result = await method(...args)

        const t = now() - s
        if (t >= threshold) {
          console.log('%c%s took %fms', 'color: red', name, t)
        }

        return result
      }
    }
  }
}
