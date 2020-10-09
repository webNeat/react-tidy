export const createMemoryStorage = (): Storage => {
  return new MemoryStorage()
}

class MemoryStorage implements Storage {
  protected memory: {[key: string]: string} = {}

  public get length() {
    return Object.keys(this.memory).length
  }

  public getItem(key: string) {
    return this.memory[key] || null
  }

  public setItem(key: string, value: string) {
    this.memory[key] = value
  }

  public removeItem(key: string) {
    delete this.memory[key]
  }

  public key(index: number) {
    const keys = Object.keys(this.memory)
    return keys[index] || null
  }

  public clear() {
    this.memory = {}
  }
}
