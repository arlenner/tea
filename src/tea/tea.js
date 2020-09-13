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

const Tea = () => {

    let _dom        = null,
        _selector   = '',
        _state = {
        view: null,
        model: {},
        task: null,
        result: null
    }
    
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
            EVENT_REGISTRY[name].forEach(fn => 
                window.tea.step(() => fn(data, _state)))
        }
    
        return { listen, emit }
    }

    const {listen, emit} = teaventer()

    return {
        get model() { return _state.model },
        set model(value) { 
            _state.model = value
        },
        get view() { return _state.view },
        set view(value) {
            console.log(this.model)
            console.log(value)
            let next = value(_state)
            const patch = getPatch(_dom, next)
            _dom = patch(_dom)
        },
        get task() { return _state.task },
        set task(value) {
            this.step(() => ({
                result: value(_state)
            }))

        },
        get result() { _state.result },
        set result(value) { _state.result = value },
        set err(value) {
            console.error(value)
        },
        start(config) {
            this.step(config)
        },
        step(nextFn) {
            const next = nextFn(_state) // order of execution actually matters here.
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
                
            if(next.hasOwnProperty('task'))     
                this.task = next.task

            if(next.hasOwnProperty('result')) 
                _state.result = next.result 
        },
        listen, 
        emit
    }
}


export { Tea }
