# tea - tiny epic auto-DOM

Its a tiny functional, declarative component rendering library. Try me out!

This will output typical Hello World application:

```javascript
    const myComponent = () => 
        div([], 
            [ h1([], 
                 ['Hello, World!'])
            ])

    mount(() => ({
        selector: '#root',
        view: myComponent
    }))
```

## Features: (So far...)

-   Automatic re-rendering on changed state values

-   Injects state data into component function calls as well as events

-   Receive input and push output with the same simple model throughout the application

-   Isolate side-effects within the 'task' portion of the Tea State Object.

```javascript
    //the task is handled on a separate loop apart from standard state updates
    //so we can isolate side-effects. Is also passed the Tea State object
    const handleClick = (e, {model}) => ({
        task: () => alert(`${JSON.stringify(model)}`)
    })

```

