

export function v_att(prop, value) {
    this.prop = prop
    this.value = value
}


export function TeaAtt(prop) {
    return function(value) {
        return new v_att(prop, value)
    }
}