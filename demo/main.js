const tea = window.tea.tea

const { diff, render, mount, elements, attributes } = tea.HTML

const { div, h1, p, li, ul, input, button } = elements
const { click, className, style } = attributes

//this is the default app model.
const MODEL = { 
    greeting: 'Hello',
    active: false
}

//an event. Events must return a Tea State object { model?: any, view?: VDOM, selector: string } 
const handleClick = (_e, {model}) => ({
    model: { 
        greeting: !model.active ? 'Bonjour' : 'Hello', 
        active: !model.active 
    },
    view: hello,
    task: ({model}) => alert(JSON.stringify(model))
})

//a component that takes the Tea State's model property as an argument and produces HTML
const inner = ({active}) => 
    div([ className(active ? 'magenta' : 'hidden')],
        [ p([ style({textStyle: 'italic'})],
            [ `this is some text.`
            ]) 
        ])

// Entry component. Takes the full Tea State object as a parameter. Returns a VDOM object.
const hello = ({model}) => 
    div([ className(model.active ? 'red' : 'blue')],
        [ h1    ([],
                    [`${model.greeting}, World!`
                    ]),
          button([ click(handleClick)
                    ], 
                    [ `click me`
                    ]),
          inner(model)
        ])

//start the program with these initial Tea State parameters
mount(() => ({
    selector: '#root',
    view: hello,
    model: MODEL
}))