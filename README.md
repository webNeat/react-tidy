# React Tidy

[![Build Status](https://travis-ci.org/webNeat/react-tidy.svg?branch=master)](https://travis-ci.org/webNeat/react-tidy)
[![Coverage Status](https://coveralls.io/repos/github/webNeat/react-tidy/badge.svg?branch=master)](https://coveralls.io/github/webNeat/react-tidy?branch=master)

A collection of handy, flexible, tested and documented React custom hooks.

**This library is still under construction. The API will change many time!**

## Functions

### createMemoryStorage
Creates a storage object that stores data in memory and implements the [Storage](#storage) interface. Similar to `window.sessionStorage` but the data is lost once the page is closed or reloaded.

#### Usage
```ts
import {createMemoryStorage} from 'react-tidy'

const memoryStorage = createMemoryStorage()

// set a new item
memoryStorage.setItem('key', 'value')

// get an item
const value = memoryStorage.getItem('key') // returns `null` if missing

// remove an item
memoryStorage.removeItem('key')

// remove all items
memoryStorage.clear()
```

## Interfaces

### Storage
A simple version of the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage) interface. You can implement it to create your own storage objects.
```ts
interface Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}
```
