/**
 * Timer decorator for measuring the performance of class method calls
 *
 * @format
 */
import now from 'performance-now'

export interface Debog {
  (...params: [number | string, ...string[]]): any
  logger(timing: number, methodName: string): void
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
          const methodName = param as string
          if(this[methodName] !== undefined) {
            this[methodName] = this.__time(this[methodName], methodName)
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
              self.logger(t, name)
            }
            return result
          })
        }

        const t = now() - s
        if (t >= threshold) {
          self.logger(t, name)
        }
        return call
      }
    }
  }
}

debog.logger = (timing: number, methodName: string) => console.log(`%c%d took %sms`, 'color: red', methodName, timing)

export default debog
