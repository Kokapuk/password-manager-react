/* eslint-disable @typescript-eslint/no-explicit-any */
export default (func: (args: any) => any, timeout: number) => {
  let timer: NodeJS.Timeout;

  return (args: any) => {
    clearTimeout(timer);

    timer = setTimeout(() => func(args), timeout);
  };
};
