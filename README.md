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


