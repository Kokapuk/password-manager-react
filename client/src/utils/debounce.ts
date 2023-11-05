export default <T, F>(func: (args: T) => F, timeout: number) => {
  let timer: NodeJS.Timeout;

  return (args: T) => {
    clearTimeout(timer);

    timer = setTimeout(() => func(args), timeout);
  };
};
