import { noop } from "../utils/noop"
import { getPatch } from "../vdom/patch"

export const teaventer = () => {
    const EVENT_REGISTRY = {}

    const listen = (name, fn) => {
        EVENT_REGISTRY[name] = EVENT_REGISTRY[name] || []
        EVENT_REGISTRY[name].push(fn)
        return drop(name, fn)
    }

    const drop = (name, fn) => _ => {
        EVENT_REGISTRY[name].splice(EVENT_REGISTRY[name].indexOf(fn))
    }

    const emit = (name, data) => 
        EVENT_REGISTRY[name].forEach(fn => fn(data, _state))

    return { listen, emit }
}

/** Tea Runtime. Wraps the DOM and injects via output it's state into views and events , while
 *  accepting as input Tea State objects, expected to be returned by your views and event handlers 
*/
const Tea = () => {

    let _dom = null,
        _selector = '',
        _state = {
            view: null,
            model: {},
            result: null,
            intervals: [],
            deferred: []
        }
    
    //Internal event wrapper injects state into events and automatically calls dom update
    //using the returned value
    const teaventer = () => {
        const EVENT_REGISTRY = {}
    
        const listen = (name, fn) => {
            EVENT_REGISTRY[name] = EVENT_REGISTRY[name] || []
            EVENT_REGISTRY[name].includes(fn) ? noop() : EVENT_REGISTRY[name].push(fn)
            return drop(name, fn)
        }
    
        const drop = (name, fn) => (cleanup = noop) => {
            cleanup()
            EVENT_REGISTRY[name].splice(EVENT_REGISTRY[name].indexOf(fn))
        }
    
        //inject internal state data into listener
        const emit = (name, data) => {
            if(EVENT_REGISTRY[name])
                EVENT_REGISTRY[name].forEach(fn => 
                    window.tea.step(() => fn(data, _state)))
        }
    
        return { listen, emit }
    }

    const { listen, emit } = teaventer()

    return {
        get model() { return _state.model },
        set model(value) { 
            _state.model = value
        },

        get view() { return _state.view },
        set view(value) {
            let next = value(_state)
            const patch = getPatch(_dom, next)
            _dom = patch(_dom)
        },

        set interval(value) {
            console.log(value)
            for(const int of value) {
                const { func, ms } = int
                int.id = setInterval(() => window.tea.step(() => func(_state, int)), ms)
            }
        },

        set defer(value) {
            for(const def in value) {
                const { func, ms } = def
                def.id = setTimeout(() => { window.tea.step(() => func(_state)); clearTimeout(def.id) }, ms)
            }
        },
        
        start(config) {
            this.step(config)
        },
        step(nextFn) {
            console.log('step:')
            const next = nextFn(_state) // order of execution actually matters here.
            console.log(JSON.stringify(next))
            if(next.hasOwnProperty('selector')) {
                if(_selector !== '') { noop() }
                else {
                    _selector = next.selector
                    _dom = document.querySelector(next.selector)
                }
            }
            if(next.hasOwnProperty('model'))   
                this.model = next.model

            if(next.hasOwnProperty('view'))     
                this.view = next.view

            if( next.hasOwnProperty('defer'))
                this.defer = next.defer

            if( next.hasOwnProperty('interval'))
                this.interval = next.interval            

        },
        listen, 
        emit
    }
}


export { Tea }
