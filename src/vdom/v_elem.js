// export const TEA_FRAGMENT = 'tea-fragment'

// export const __ = elements => new v_elem(TEA_FRAGMENT, [], elements)

export function v_elem(tag, attributes, elements) {
    this.tag = tag
    this.attributes = attributes
    this.elements = elements
}

export function TeaNode(tag) {
    return function(atts, els) {
        return new v_elem(tag, atts, els)
    }
}