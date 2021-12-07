export function throttle(fn: Function, delay: number) {
  let timer: any = null;
  return function(this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay)
    }
  }
}