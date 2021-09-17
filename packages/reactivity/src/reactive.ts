import { isObject } from "@vue/shared";
import { mutableHandlers, readonlyHandlers, shallowHandlers, shallowReadonlyHandlers } from "./baseHandlers";


export function reactive(target){
    return createReactiveObject(target,false,mutableHandlers)
}

export function shallowReactive(target){
    return createReactiveObject(target,false,shallowHandlers)
}

export function shallowReadonly(target){
    return createReactiveObject(target,true,shallowReadonlyHandlers)
}

export function readonly(target){
    return createReactiveObject(target,true,readonlyHandlers)
}

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

export function createReactiveObject(target,isReadonly,baseHandlers){
    //new Proxy拦截
    if(!isObject(target)) return

    const proxyMap = isReadonly? reactiveMap : readonlyMap
    const existProxy = proxyMap.get(target)
    if(existProxy) {
        return existProxy
    }

    const proxy  = new Proxy(target,baseHandlers)
    proxyMap.set(target,proxy)
    return proxy
}

