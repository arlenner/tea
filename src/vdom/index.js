import { TeaAtt }   from './v_att'
import { TeaNode }  from './v_elem'
import { render }   from './render'
import { mount }    from './mount'
import { getPatch }     from './patch'
import { comp_names, att_names } from '../utils/names'

const elements = { }
const attributes = {}

for(let i = 0; i < comp_names.length; i++) {
    const name = comp_names[i]
    elements[name] = TeaNode(name) 
}

for(let i = 0; i < att_names.length; i++) {
    const k = att_names[i]
    attributes[k] = TeaAtt(k)
}

export const HTML = {
    elements, attributes, render, mount, getPatch
}


