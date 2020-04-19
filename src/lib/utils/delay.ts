export default (time: number) =>
  new Promise((resolve: Function) => {
    setTimeout(() => resolve(), time)
  })
