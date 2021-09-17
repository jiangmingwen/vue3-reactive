import { hasOwn, isArray, isIntegerKey, isObject } from "@vue/shared/src"
import { track,trigger } from "./effect"
import { reactive, readonly } from "./reactive"

const get = createGetter()
const shallowGet = createGetter(false,true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true,true)

const set = createSetter() 
const shallowSet = createSetter(true) 

export const mutableHandlers = {
    get,
    set
}

export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set (target,key,reciver) {
        console.warn(`set on key: ${key} failed`)
    }
}

export const shallowHandlers = {
    get: shallowGet,
    set: shallowSet
}

export const readonlyHandlers = {
    get: readonlyGet,
    set (target,key,receiver) {
        console.warn(`set on key: ${key} failed`)
    }
}

function createGetter(isReadonly = false, isShallow = false) {
    return function get(target,key,receiver) {
        const res = Reflect.get(target,key,receiver)
        console.log(res,'res')
        if(!isReadonly){
            //收集依赖
            track(target,'GET',key)
        }

        if(isShallow){
            return res
        }

        if(isObject(res)){
            return isReadonly ? readonly(res) : reactive(res)
        }
        
        return res
    }
}

function createSetter( isShallow = false) {
    return function set(target,key,value,receiver) {
        const oldValue = target[key] //之前的值
        const hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target,key)
        const res = Reflect.set(target,key,value,receiver)
        if(hasKey) { //修改
            trigger(target,'EDIT',key,value,oldValue)
        }else { //新增
            console.log('进入了add')
            trigger(target,'ADD',key,value)
        }
        return res
    }
}