export function hold<T>(value: T) {
  const get = () => value
  const set = (x: T) => {
    value = x
  }
  return [get, set] as [typeof get, typeof set]
}
