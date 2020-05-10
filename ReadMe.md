# Obrigado-Redux utils

obrigado-redux-utils is a small library designed to automatically generate Redux store, actions and reducers. 

It uses [Immutable.js](https://immutable-js.github.io/immutable-js/) Records to ensure store immutability.

Can be easily set up with [redux-persist](https://github.com/rt2zz/redux-persist).

TypeScript types are included.

## Setup with Redux
The first step is to create an object which will define your future store's initial state.

Next import ReduxHelper class and pass previously defined object to the constructor. Call ```createReducers()``` method to create an object containing automatically generated reducers.

Use ES6 spread operator and combineReducers function from Redux to create rootReducer. You can add your own reducers there as well. 

Finally, create your store with createStore from redux and pass your root reducer to the ```createReduxHelper()``` method.

```javascript
import { ReduxBuilder } from 'obrigado-redux-utils'
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

const builder= new ReduxBuilder(data)
const reducers = builder.createReducers()

const rootReducer = combineReducers({
    ...reducers,
    // your other reducers
})

const store = createStore(rootReducer)

export const ReduxHelper = builder.createReduxHelper(store)
``` 

Now you can import ReduxHelper anywhere in your app and call the following methods on your store:
* setIn
* mergeIn
* mergeDeepIn
* updateIn
* reset

## Setup with redux-persist
If you want to use [redux-persist](https://github.com/rt2zz/redux-persist) with this package, obrigado-redux-utils already comes with a built-in method for this purpose.

Simply use ```createPersistsReducers()``` method instead of ```createReducers()```.

You will need to pass in storage engine, a list of whitelisted reducers. 

Optionally, you can also pass an object with your custom reducers.

```javascript
import { ReduxBuilder } from 'obrigado-redux-utils'
import { createStore } from 'redux'
import storage from 'redux-persist/lib/storage'
import { data } from 'path/to/data/object'
import { customReducer } from 'path/to/custom/reducer'

const builder = new ReduxBuilder(data)
const persistedReducer = builder.createPersistsReducers(storage, ['user', 'custom'], { custom: customReducer })

const store = createStore(persistedReducer)

export const ReduxeHelper = builder.createReduxHelper(store)
```

## ReduxeHelper's  methods 

#### setIn (path, payload)
Path is an array of strings or numbers (for Lists) to the value you want to update.
Use seIn to fully replace data at given path
#### mergeIn (path, payload)
Path is an array of strings or numbers (for Lists) to the value you want to update.

Uses mergeIn from Immutable.js to merge payload with store. Payload can be a plain JS object, an array or an Immutable structure.

```javascript
import { ReduxHelper } from 'path/to/ReduxHelper'

ReduxHelper.mergeIn(['user', 'name'], {firstName:'Jane'}) // will change firstName from John to Jane
ReduxHelper.mergeIn(['posts', 'data'], ['three']) // will result in posts.data = ['one', 'two', 'three']
```
#### mergeDeepIn (path, payload)

Uses mergeDeepIn from Immutable.js to merge payload with store. Arguments work in the same way as in the previous method.

```javascript
ReduxHelper.mergeDeepIn(['user', 'name'], {
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
ReduxHelper.updateIn(['user', 'name', 'firstName'], value => value.toUpperCase())
// this will change the value of firstName to upper case
```

#### reset (key)
This method simply resets your store back to its initial state based on the type value.
Key is a string that specifies what part of the store you want to reset.
```javascript
ReduxHelper.reset('user') // will reset user to initial state
``` 
#### setInAction, mergeInAction, mergeDeepInAction, updateIn, resetAction
These methods only create action object, that can be dispatched to store. They can be very useful in sagas.
# Sagas
You can easily create rootSaga and SagaHelper which helps you to run sagas from components.
## Root saga
1. Import all modules with sagas into object:
```javascript
import * as module1 from './sagas/module1'
import * as module2 from './sagas/module2'
const sagaModules = {module1,module2}
``` 
2. Call createRootSaga , that's all! 
```javascript 
import { createRootSaga} from 'obrigado-redux-utils'
...
sagaMiddleware.run(createRootSaga(sagaModules))
```
createRootSaga generates action handler for each saga in format \[RUN_sagaName in upperCase\]
## Saga helper
SagaHelper is created in way similar to creating rootSaga
```javascript  
import { createSagaHelper} from 'obrigado-redux-utils'
...
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))
//@ts-ignore current version of redux-saga has wrong type mapping and reuires 2 args
sagaMiddleware.run(createRootSaga(sagaModules))
export const SagaHelper = createSagaHelper(sagaModules, store)
```
### Calling sagas
```javascript  
import {SagaHelper} from './store'
function Component(){
     useEffect(() => {
        SagaHelper.run(["module1","loadData"],{page:1}).then(
                (data)=>console.log(data))
        .catch((e)=>console.warn(e))
        return () => {};
      });
}
```
Saga for handling such call can look like this:
```javascript   
export function* loadData(params:{page:number}){
    let res= yield appCall(params.page)
    if (!res) throw new Error("Empty result")
    return res;
} 
```
