
export const debounce = <Args extends unknown[]>(
    mainFunction: (...args: Args) => void,
    delay: number
  ): ((...args: Args) => void) => {
    let timer: ReturnType<typeof setTimeout>;
  
    return (...args: Args): void => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        mainFunction(...args);
      }, delay);
    };
  }