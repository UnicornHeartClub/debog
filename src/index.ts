/**
 * Timer decorator for measuring the performance of class method calls
 *
 * @format
 */
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
          this[method] = this.time(this[method], method as string)
        }
      }

      private time = (method: Function, name: string) => async (...args: any[]) => {
        const s = performance.now()
        const result = await method(...args)
        const t = performance.now() - s
        if (t >= threshold) {
          console.log('%c%s took %fms', 'color: red', name, t)
        }
        return result
      }
    }
  }
}
