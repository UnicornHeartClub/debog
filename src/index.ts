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

        for (let param of params) {
          const method = param as string
          this[method] = this.__time(this[method], method)
        }
      }

      __time = (method: Function, name: string) => (...args: any[]) => {
        const s = now()
        const call = method(...args)
        if (call instanceof Promise) {
          return call.then(result => {
            const t = now() - s
            if (t >= threshold) {
              console.log('%c%s took %fms', 'color: red', name, t)
            }
            return result
          })
        }

        const t = now() - s
        if (t >= threshold) {
          console.log('%c%s took %fms', 'color: red', name, t)
        }

        return call
      }
    }
  }
}
