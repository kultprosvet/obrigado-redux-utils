import {ReduxBuilder, ReduxStoreStateTemplate} from '../src'
import {createStore} from 'redux'

const data = {
    user: {
        name: {
            firstName: 'Jhon',
            lastName: 'Ivanov'
        },
        age: 25,
        bd: new Date()
    },
    posts: {
        data: ['one', 'two']
    },
    isBool: true
}
// Use this type inside selectors
export type ReduxStoreState = ReduxStoreStateTemplate<typeof data>
export const buildStore = () => {
    const builder = new ReduxBuilder(data)
    const reducer = builder.createReducer()
    const store = createStore(reducer)
    const ReduxHelper = builder.createReduxHelper(store)
    return {
        store,
        ReduxHelper
    }
}
