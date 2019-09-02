# React Tidy

A collection of handy, flexible and well-tested React custom hooks.

**This library is still under construction!**

## Installation
```
npm i react-tidy
```

## List of Custom Hooks
- [useStorageItem](#usestorageitem)

## useStorageItem
```ts
function useStorageItem(name: string, storage: Storage = localStorage): {
  value: string | null          // The value of the localStorage item
  set: (value: string) => void  // Sets a new value and stores it on localStorage
  remove: () => void            // Removes the item from localStorage and sets the value to `null`
}
```
