const tea = window.tea.tea

const { elements, attributes, mount } = tea.HTML
const { div, h1, button, span } = elements
const { click, className, style } = attributes
 
const time = new Date()

const MODEL = {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds(),
    pm: false
}

const onSecond = ({model}, ) => {
    const time = new Date()
    return {
        model: {
            second: time.getSeconds(),
            minute: model.second === 59 ? time.getMinutes() : model.minute,
            hour: model.minute === 59 ? time.getHours() : model.hour,
            pm: time.getHours >= 12
        },      
        view: app
    }
}
const getCorrectedHour = hour => hour > 12 ? hour - 12 : hour

const clock = ({hour, minute, second, pm}) =>
    div([ className('container')],
        [ div ([ className('tea') ],
               [ `TEATIME` ]),
          span([ className('digit') ], 
               [ `${getCorrectedHour(hour).toString().length < 2 
                        ? '0'+getCorrectedHour(hour) 
                        : getCorrectedHour(hour)
                  }` 
               ]),
          span([ className('digit') ],
               [ `:` 
               ]),
          span([ className('digit') ], 
               [ `${minute.toString().length < 2 ? '0'+minute : minute}` 
               ]),
          span([ className('digit') ],
               [ `:` 
               ]),
          span([ className('digit') ], 
               [ `${second.toString().length < 2 ? '0'+second : second}` 
               ]),
          span([ className('digit-small') ],
               [ `${pm ? 'a.m.' : 'p.m.'}`])
        ])

const app = ({model}) => clock(model)

mount(() => ({
    selector: '#root',
    model: MODEL,
    view: app,
    interval: [{
        func: onSecond,
        ms: 1000
    }]
}))