export const curry = f => (...args) => 
    args.length < f.length ? curry(f).bind(null, ...args)
: /*else*/                   f.call(null, ...args)
