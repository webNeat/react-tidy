import { Storage } from './types'

export const createMemoryStorage = (): Storage => {
  let memory: { [key: string]: string } = {}
  const getItem = (key: string) => {
    return memory[key] || null
  }
  const setItem = (key: string, value: string) => {
    memory[key] = value
  }
  const removeItem = (key: string) => {
    delete memory[key]
  }
  const clear = () => {
    memory = {}
  }
  return { getItem, setItem, removeItem, clear }
}
