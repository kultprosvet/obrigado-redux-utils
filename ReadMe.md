# Obrigado-Redux utils

obrigado-redux-utils is a small library designed to automatically generate Redux store, actions and reducers. 

It uses [Immutable.js](https://immutable-js.github.io/immutable-js/) Records to ensure store immutability.

Can be easily set up with [redux-persist](https://github.com/rt2zz/redux-persist).

TypeScript types are included.

## Setup with Redux
The first step is to create an object which will define your future store's initial state.

Next import ReduxHelper class and pass previously defined object to the constructor. Call ```generateReducers()``` method to create an object containing automatically generated reducers.

Use ES6 spread operator and combineReducers function from Redux to create rootReducer. You can add your own reducers there as well. 

Finally, create your store with createStore from redux and pass your root reducer to the ```generateActions()``` method.

```javascript
import { ReduxHelper } from 'obrigado-redux-utils'
import { createStore, combineReducers } from 'redux'

const data = {
  user: {
    name: {
      firstName: 'Jhon',
      lastName: 'Doe'
    },
    age: 25
  },
  posts: {
    data: List(['one', 'two'])
  }
}

const rHelper = new ReduxHelper(data)
const generatedReducers = rHelper.generateReducers()

const rootReducer = combineReducers(
    ...generatedReducers,
    // your other reducers
)

const store = createStore(rootReducer)

export const actions = rHelper.generateActions(store)
``` 

Now you can import actions anywhere in your app and call the following methods on your store:
* mergeIn
* mergeDeepIn
* updateIn
* reset

## Setup with redux-persist
If you want to use [redux-persist](https://github.com/rt2zz/redux-persist) with this package, obrigado-redux-utils already comes with a built-in method for this purpose.

Simply use ```generatePersistsReducers()``` method instead of ```generateReducers()```.

You will need to pass in storage engine, a list of whitelisted reducers. 

Optionally, you can also pass an object with your custom reducers.

```javascript
import { ReduxHelper } from 'obrigado-redux-utils'
import { createStore } from 'redux'
import storage from 'redux-persist/lib/storage'
import { data } from 'path/to/data/object'
import { customReducer } from 'path/to/custom/reducer'

const rHelper = new ReduxHelper(data)
const persistedReducer = rHelper.generatePersistsReducers(storage, ['user', 'custom'], { custom: customReducer })

const store = createStore(persistedReducer)

export const actions = rHelper.generateActions(store)
```

## Method description 

#### mergeIn (path, payload)

Path is an array of strings or numbers (for Lists) to the value you want to update.

Uses mergeIn from Immutable.js to merge payload with store. Payload can be a plain JS object, an array or an Immutable structure.

```javascript
import { actions } from 'path/to/actions'

actions.mergeIn(['user', 'name'], {firstName:'Jane'}) // will change firstName from John to Jane
actions.mergeIn(['posts', 'data'], ['three']) // will result in posts.data = ['one', 'two', 'three']
```
#### mergeDeep (path, payload)

Uses mergeDeepIn from Immutable.js to merge payload with store. Arguments work in the same way as in the previous method.

```javascript
actions.mergeDeepIn(['user', 'name'], {
  name: {
    firstName: 'Sam'
  },
  age: 34
})
```
When merging plain JS objects with the store and changing several fields in one merge like in the example above, it is recommended to use ```mergeDeepIn()```. 

This method will change only specified fields and leave others unchanged, unlike ```mergeIn()``` that will remove unspecified fields on that level. Meaning that if in this example we had used ```mergeIn()``` instead, it would have removed lastName field completely. 

#### updateIn (path, updater)
Uses updateIn method from Immutable js to update store values.

Path works the same way as in two previous methods.
Updater parameter allows you to pass in a function to do something with the values that you got from specified path.  

```javascript
actions.updateIn(['user', 'name', 'firstName'], value => value.toUpperCase())
// this will change the value of firstName to upper case
```

#### reset (type)
This method simply resets your store back to its initial state based on the type value.
Type is a string that specifies what part of the store you want to reset.
```javascript
actions.reset('user') // will reset user to initial state
``` 
