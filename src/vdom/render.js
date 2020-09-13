
const dom = document.createElement.bind(document)


export const render = e => 
    typeof e === 'string'  ? document.createTextNode(e)
// :   e.tag === TEA_FRAGMENT ? renderFragment(e)
:  /*else*/                  renderEl(e)

// function renderFragment(fragment) {
//     const { elements } = fragment

//     const d = document.createDocumentFragment()

//     for(let i = 0; i < elements.length; i++) {
//         d.appendChild(render(elements[i]))
//     }

//     return d
// }

function renderEl(v_el) {
    const { tag, attributes, elements } = v_el
    const d = dom(tag)

    for(let i = 0; i < attributes.length; i++) {
        const { prop, value } = attributes[i]
        
        if(typeof value === 'function') {
            const drop = window.tea.listen(prop, value)
            const fn = e => {
                window.tea.emit(prop, e)
            }
            fn.drop = drop
            console.log(fn)
            d[`on${prop}`] = fn
        }
        else if(prop === 'style')           d.style = value
        else if(prop === 'className')       d.className = value
        else                                d.setAttribute(prop, value)
    }

    for(let i = 0; i < elements.length; i++) {
        d.appendChild(render(elements[i]))
    }

    return d
}
