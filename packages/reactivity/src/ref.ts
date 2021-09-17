import { isObject } from "@vue/shared/src";
import { track, trigger } from "./effect";
import { reactive } from "./reactive";

export function ref(value) {
    
    return createRef(value)
}

export function shallowRef(value){
    return createRef(value,true)
}

function createRef(rawValue,isShallow = false) {
    return new RefImpl(rawValue,isShallow)
} 


const convert = val => isObject(val) ? reactive(val) : val

class RefImpl {
    public _value;
    public __v_isRef = true;
    public _rawValue;
     
    constructor(rawValue,private isShallow){
        this._rawValue = isShallow ? rawValue  : convert(rawValue)
        this._value = this._rawValue 

    }

    get value(){ //会被转换成 defineProperty
        //track
        track(this,'GET','value')
        return this._value
    }

    set value(newValue){
        //trigger
        if(newValue !== this._rawValue){
            this._rawValue = this.isShallow ? newValue : convert(newValue)
            this._value = newValue
        }
        trigger(this,'EDIT','value',newValue)
    }
}

class ObjectRefImpl {

    public __v_isRef = true;
    constructor(private target,private key) {
    }

    get value(){
        return this.target[this.key]
    }

    set value(newValue){
        this.target[this.key] = newValue
    }
}


export function toRef(target,key) {
    return new ObjectRefImpl(target,key)
}

export function toRefs(target) {
    const ret  = {}
    for(let key in target){
        ret[key] = toRef(target,key)
    }
    return ret 
}