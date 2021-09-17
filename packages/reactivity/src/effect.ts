import { isArray, isIntegerKey } from "@vue/shared/src"

export function effect(fn,options: any = {}) {
    //需要让这个effect变成响应的effect,可以做到数据变化重新执行
    const effect  = createReactiveEffect(fn,options)
    //响应式的effect默认会先执行一次
    if(!options?.lazy) {
        effect()
    }

    return effect
}

let uid = 0
let activeEffect
let effectStack = []
/**
 *  effect(()=> {
 *      effect(()=> {
 *      })
 *  
 *  })

 */

function createReactiveEffect(fn,options){
    const effect = function reactiveEffect() {
        if(!effectStack.includes(effect)) { // ++
            try{
                effectStack.push(effect)
                activeEffect = effect
                return fn()
            }finally{
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }

    effect.id = uid++
    effect._isEffect = true
    effect.raw = fn 
    effect.options = options

    return effect
}


//收集依赖
let targetMap = new WeakMap()

// { target : key :   [effect,effect]}
export function track(target,type,key) {
    if(!activeEffect) { //当前正在运行的effect
        return
    }

    let depsMap = targetMap.get(target)
    if(!depsMap) {
        targetMap.set(target,(depsMap = new Map()))
    }

    let keysSet = depsMap.get(key)
    if(!keysSet){
        depsMap.set(key,(keysSet = new Set()))
    }

    if(!keysSet.has(activeEffect)){
        keysSet.add(activeEffect)
    }

}


export function trigger (target,type,key?,newValue?,oldValue?){
 
    //在依赖收集里找
    const depsMap = targetMap.get(target)
    console.log(depsMap,'依赖')
    if(!depsMap) {
        //根本没有依赖收集
        return
    }

    const effects =  new Set(); //将所有的effect放在一堆，一起执行,有可能effect会重复
    const add = (effectsToAdd) => {
            effectsToAdd?.forEach(effect => effects.add(effect) )
    }
    console.log(target,key,'触发')
    if(key === 'length' && isArray(target)) {
        //如果改的是长度,影响得多

        depsMap.forEach((dep,subkey) => {
            // arr[100] = 10    arr = []
            if(subkey === 'length' || (typeof subkey === 'string' && subkey >  newValue)) {
                add(dep)
            }
        } )
    }else {

        if(key !== undefined) {
            add(depsMap.get(key))
        }

        if(type == 'ADD' ){
            console.log('进入')
            //如果修改数组索引
            if(isArray(target) && isIntegerKey(key) ) {
                add(depsMap.get('length'))
            }
        }
    }

    console.log(effects,'effects')

    effects.forEach( (effect:any) => effect())
}