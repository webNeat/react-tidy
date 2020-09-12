export function hold<T>(value: T) {
  const get = () => value
  const set = (newValue: T) => {
    value = newValue
  }
  return [get, set] as [() => T, (x: T) => void]
}
