import { Record } from 'immutable'
//@ts-ignore
import { persistReducer } from 'redux-persist'
//@ts-ignore
import { combineReducers } from 'redux'
import * as immutableTransform from 'redux-persist-transform-immutable'
import { ReduxHelper } from './ReduxHelper'

export class ReduxBuilder<StoreState> {
    readonly data: StoreState
    constructor(data: StoreState) {
        this.data = data
    }

    createReduxHelper(store): ReduxHelper<StoreState> {
        if (typeof store == 'undefined') {
            throw Error('Store is undefined')
        }

        return new ReduxHelper<StoreState>(store, this.data)
    }

    createReducers() {
        let reducers: any = {}
        for (let key in this.data) {
            const initialState = Record(this.data[key], key)
            reducers[key] = (state = initialState(), action) => {
                if (action.type == `${key.toUpperCase()}_SET_IN`) {
                    action.payload.path.splice(0, 1)
                    if (action.payload.path.length == 0) {
                        return Record(action.payload.payload, key)()
                    } else if (!state) {
                        const state = initialState()
                        return state.setIn(action.payload.path, action.payload.payload)
                    } else {
                        return state.setIn(action.payload.path, action.payload.payload)
                    }
                } else if (action.type == `${key.toUpperCase()}_MERGE_IN`) {
                    action.payload.path.splice(0, 1)
                    return state.mergeIn(action.payload.path, action.payload.payload)
                } else if (action.type == `${key.toUpperCase()}_MERGE_DEEP_IN`) {
                    action.payload.path.splice(0, 1)
                    return state.mergeDeepIn(action.payload.path, action.payload.payload)
                } else if (action.type == `${key.toUpperCase()}_UPDATE_IN`) {
                    action.payload.path.splice(0, 1)
                    return state.updateIn(action.payload.path, action.payload.updater)
                } else if (action.type == `${key.toUpperCase()}_RESET`) {
                    return initialState()
                }
                return state
            }
        }
        return reducers
    }
    createPersistsReducers(storageEngine: any, whiteList: string[], customReducers?: object) {
        const reducers = this.createReducers()

        const records = []
        for (let key in this.data) {
            //@ts-ignore
            records.push(Record(this.data[key], key))
        }

        const persistConfig = {
            key: 'root',
            storage: storageEngine,
            whitelist: whiteList,
            transforms: [immutableTransform({ records: records })],
        }

        console.log('persistConfig', persistConfig)

        const rootPersistReducer = customReducers
            ? combineReducers({ ...reducers, ...customReducers })
            : combineReducers({ ...reducers })

        console.log('rootPersistReducer', rootPersistReducer)

        return persistReducer(persistConfig, rootPersistReducer)
    }
}
