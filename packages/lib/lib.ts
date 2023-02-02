'use strict'

import type { storageOpts, namespaced } from '../types/storage'
import { hasReflect } from '../utils/compat'

export default class Storage {
  static namespaced = 'rs-'

  static _getStaticKey = (namespaced: namespaced, key: string) =>
    `${namespaced ?? this.namespaced}${key}`

  static install(app: any, options: storageOpts) {
    const { namespaced = this.namespaced, memory } = options
    memory && this.clearAll(namespaced, memory)
    return new Storage(app, options)
  }

  static clearAll(nameSpace: namespaced, memory: object) {
    Object.keys(memory).forEach(key => {
      const alias: string = nameSpace + key
      if (Object.prototype.hasOwnProperty.call(window.localStorage, alias)) {
        window.localStorage.removeItem(alias)
      }
    })
  }

  static get(key: string) {
    return JSON.parse(window.localStorage.getItem(key) as string)
  }

  static set(key: string, val: string) {
    val = typeof val === 'object' ? JSON.stringify(val) : val
    window.localStorage.setItem(key, val)
  }

  static getData(key: string, nameSpace?: string) {
    if (
      Object.prototype.hasOwnProperty.call(
        window.localStorage,
        this._getStaticKey(nameSpace!, key)
      )
    )
      return JSON.parse(
        window.localStorage.getItem(
          this._getStaticKey(nameSpace!, key)
        ) as string
      )
  }

  static reflectProxy(target: object, key: string, namespaced: namespaced) {
    Reflect.defineProperty(target, key, {
      get: () => this.get(this._getStaticKey(namespaced, key)),
      set: val => this.set(this._getStaticKey(namespaced, key), val),
      configurable: true
    })
  }

  static objProxy(target: object, key: string, namespaced: namespaced) {
    Object.defineProperty(target, key, {
      get: () => this.get(this._getStaticKey(namespaced, key)),
      set: val => this.set(this._getStaticKey(namespaced, key), val),
      configurable: true
    })
  }


  public constructor(app: any, options: storageOpts) {
    const that = Storage;
    
    const { namespaced, memory } = options
    let _storage: any = memory

    if (Object.keys(_storage).length === 0) console.warn('key cannot be empty')

    Object.keys(_storage).forEach(key => {
      const val = _storage[key]
      that.set(that._getStaticKey(key, namespaced), val)

      hasReflect
        ? that.reflectProxy(_storage, key, namespaced)
        : that.objProxy(_storage, key, namespaced)
      app.util.defineReactive(_storage, key, _storage[key])
    })

    let _target = app.prototype
    hasReflect
      ? Reflect.defineProperty(_target, '$storage', {
          get: () => _storage
        })
      : Object.defineProperty(_target, '$storage', {
          get: () => _storage
        })
  }
}
