import { render } from './render'

function getChildPatch(prev, next) {
    const parent_ups  = [],
          child_ups   = []          
    
    for(let i = 0; i < next.length; i++) {
        if(i >= prev.length) 
            parent_ups.push(d => 
                (d.appendChild(render(next[i])), d))
  
        child_ups.push(d =>
            getPatch(d, next[i]))
    } //end for
    
    return d => {
        for(let i = 0; i < child_ups.length; i++) {
            child_ups[i](d.childNodes[i])
        }

        for(let i = 0; i < parent_ups.length; i++){
            parent_ups[i](d)
        }

        return d
    }
}

  
function getAttsPatch(prev, next) {
    const att_ups = []
    const drop = d => {
        d[`on${prop}`].drop()
        d[`on${prop}`] = null
        return d
    }
    const runRemoveCheck = (prop, value) =>
        att_ups.push(d => //match ->
            typeof value === 'function' ? drop(d)
        :   prop === 'style'            ? (d.style = next.style, d) 
        :   prop === 'className'        ? (d.className = '', d)
        :   /*else*/                      (d.removeAttribute(prop), d)
        ) //end match

    const longest = Math.max(prev.length, next.length)

    const getTeaEvent = (prop, value, d) => {
        const drop = window.tea.listen(prop, value)
        const fn = e => {
            tea.emit(prop, e)
        }
        fn.drop = drop
        d[`on${prop}`] = fn
    }

    for(let i = 0; i < longest; i++) {
        const {prop, value} = next[i]
        
        //tail branch
        if(i >= prev.length) {
            att_ups.push(d => //match ->
                typeof value === 'function' ? (getTeaEvent(prop, value, d), d)
            :   prop === 'className'        ? (d.className = value, d)
            :   prop === 'style'            ? (d.style = next.style, d)
            :   /* else */                    (d.setAttribute(prop, value), d)
            )//end match
            break
        }
        if(i >= next.length) {
            runRemoveCheck(prop, value)   
            break
        }
        //end tail branch

        //standard branch
        if(prev[prop] !== value)
            att_ups.push(d =>
                value === null              ? (runRemoveCheck(), d)
            :   typeof value === 'function' ? (d.addEventListener(prop, value), d)
            :   prop === 'style'            ? (d.style = next.style, d)
            :   prop === 'className'        ? (d.className = value, d)
            :   /**else */                    (d.setAttribute(prop), d)
            )
        //end standard branch
    } //end for 

    return d => {
        for(let i = 0; i < att_ups.length; i++) {
            att_ups[i](d)
        }
    }
}

export function getPatch(prev, next) {
    if(next === undefined) 
      return d => d.remove()
    
    if((typeof prev === 'string' || typeof next === 'string')
    &&  prev !== next) {
        return replaceDom(next)
    }
    
    if((typeof prev !== 'string' && typeof next !== 'string')
    && prev.tagName !== next.tag) {
        return replaceDom(next)
    }
    
    const runAtts = getAttsPatch(prev.attributes, next.atts)
    const runChildren = getChildPatch(prev.childNodes, next.els)
    
    return d => {
        runChildren(d)
        runAtts(d)
        return d
    }
        
}

function replaceDom(next) {
    return d => {
        const n = render(next)
        d.replaceWith(n)
        return n;
    }
}