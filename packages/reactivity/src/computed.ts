import { effect, track } from "./effect";

export function computed(fn){

    //fn  就是 effect

    const runner = effect(fn,{
        lazy: true,

    })

    let value
   let computed = {
        _isRef: true,
        // expose effect so computed can be stopped
        effect: runner,
        get value() {
        
            value = runner()
         
          track(computed, 'GET', 'value')
          return value
        },
        set value(newValue) {
            value = newValue
        }
      } 

      return computed
}