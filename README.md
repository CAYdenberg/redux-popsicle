Redux middleware for making HTTP requests via the [Popsicle](https://www.npmjs.com/package/popsicle) library. The emphasis is on keeping actions creators as pure functions that return simple objects (as opposed to promises, functions, thunks, iterators) to simplify unit testing on your end.

## Installation

```bash
npm i --save redux-popsicle
```

```js
import reduxPopsicle from 'redux-popsicle'

// when you create your store
const store = createStore(reducer, initialState, applyMiddleware([reduxPopsicle, ...otherMiddleware]))
```

## How it works

Any action that contains a `popsicle` property will be handled by the middleware. The contents of that property (usually an object) will be passed to Popsicle to create the request. For example, if your action creator is:

```js
const weatherRequest = location => {
    return {
        type: 'WEATHER_REQUEST',
        popsicle: {
            method: 'GET',
            url: `https://api.weatherservice.com/${location}`
        }
    }
}
```

See the [Popsicle README](https://www.npmjs.com/package/popsicle) for the full lowdown on the popsicle API.

Note that the action is still passed to the reducer. You can use that to indicate within the store that the request has been made.

## Responses

In the example above, redux-popsicle will dispatch a default action once the response arrives (`{type: '@@redux-popsicle/RESPONSE'}`). In most cases, however, you will want to do something with the data. You can include a `response` property in the action, which is itself an action creator that describes what to do with the response body:

```js
const weatherRequest = location => {
    return {
        type: 'WEATHER_REQUEST',
        popsicle: {
            method: 'GET',
            url: `https://api.weatherservice.com/${location}`
        },
        response: body => ({type: 'WEATHER_RESPONSE', data: body.data})
    }
}
```

where `body` represents the (JSON-parsed) request body, assuming the request is successful.

Note that `response` can also contain a simple action object, instead of an action creator.

## Errors

Responses with 4xx and 5xx status codes will not trigger the `response` action creator. In the example above, they would dispatch a default error action (`{type: '@@redux-popsicle/ERROR'}`). You can include an `error` property that can be an action:

```js
const weatherRequest = location => {
    return {
        type: 'WEATHER_REQUEST',
        popsicle: {
            method: 'GET',
            url: `https://api.weatherservice.com/${location}`
        },
        response: body => ({type: 'WEATHER_RESPONSE', data: body.data}),
        error: {type: 'WEATHER_ERROR'}
    }
}
```

or an action creator:

```js
const weatherRequest = location => {
    return {
        type: 'WEATHER_REQUEST',
        popsicle: {
            method: 'GET',
            url: `https://api.weatherservice.com/${location}`
        },
        response: body => ({type: 'WEATHER_RESPONSE', data: body.data}),
        error: (statusCode, body) => ({type: 'WEATHER_ERROR', statusCode, body})
    }
}
```
