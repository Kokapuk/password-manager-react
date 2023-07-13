export default (func: (args: any) => any, timeout: number) => {
  let timer: number;

  return (...args: any[]) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(null, args as [args: any]);
    }, timeout);
  };
};
