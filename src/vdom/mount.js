import { Tea } from "../tea/tea"

export const mount = config => {    
    window.tea = Tea()
    window.tea.start(config)
}