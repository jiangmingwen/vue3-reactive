export const isObject = (value) => typeof value === 'object' && value !== 'null'
export const isArray = Array.isArray
export const isIntegerKey = key => parseInt(key)+'' === key
export const hasOwn = (target,key) => Object.prototype.hasOwnProperty.call(target,key)
export const isNumber = val => typeof val === 'number'
export const isFun = val => typeof val === 'function'
export const isString = val => typeof val === 'string'