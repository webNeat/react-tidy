---
title: createMemoryStorage
---

Creates a storage object that stores data in memory and implements the [Storage](storage.md) interface. Similar to `window.sessionStorage` but the data is lost once the page is closed or reloaded.

## Usage
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