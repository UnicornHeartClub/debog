/**
 * Timer decorator for measuring the performance of class method calls
 *
 * @format
 */
import now from 'performance-now'

/**
 * Default message
 */
const message = '%s took %fms'

interface Debog {
  (...params: [number | string, ...string[]]): any
  logger: Function
}

interface Export {
  default: Debog
}

const debog: Debog = function debog(this: Export, ...params: [number | string, ...string[]]) {
  const self = this.default as Debog
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
          if(this[method] !== undefined) {
            this[method] = this.__time(this[method], method)
          }
        }
      }

      __time = (method: Function, name: string) => (...args: any[]) => {
        const s = now()
        const call = method(...args)
        if (call instanceof Promise || Promise.resolve(call) === call || typeof call.then === 'function') {
          return call.then(result => {
            const t = now() - s
            if (t >= threshold) {
              self.logger(message, name, t)
            }
            return result
          })
        }

        const t = now() - s
        if (t >= threshold) {
          self.logger(message, name, t)
        }
        return call
      }
    }
  }
}

debog.logger = (message: string, ...args: any[]) => console.log(`%c${message}`, 'color: red', ...args)

export default debog
