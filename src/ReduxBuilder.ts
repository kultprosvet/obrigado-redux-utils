//@ts-ignore
import { ReduxHelper } from './ReduxHelper'
import { transformToImmutable } from './persists/transformToImmutable'
import { combineReducers } from 'redux'

type ReduxAction = {
    type: string
    payload: {
        path: string[]
        payload: any
        updater: (state: any) => any
    }
}
export class ReduxBuilder<StoreState> {
    readonly data: StoreState

    /**
     *
     * @param data initial store state
     */
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
            const initialState = transformToImmutable(this.data[key])
            reducers[key] = (state = initialState, action: ReduxAction) => {
                const reg = new RegExp(`^${key.toUpperCase()}(_.*__|__)(SET_IN|MERGE_IN|MERGE_DEEP_IN|UPDATE_IN|RESET)$`)
                const match = action.type.match(reg)
                if (!match) return state
                const path = [...action.payload.path]
                if (match && (!path || path?.length == 0)) throw new Error('Please specify path')
                path.splice(0, 1)
                const type = match?.[2]
                if (type == `SET_IN`) {
                    const payload = transformToImmutable(action.payload.payload)
                    if (path.length == 0) {
                        return transformToImmutable(payload)
                    } else if (!state) {
                        const state = initialState
                        return state.setIn(path, payload)
                    } else {
                        return state.setIn(path, payload)
                    }
                } else if (type == `MERGE_IN`) {
                    const payload = transformToImmutable(action.payload.payload)
                    if (path.length == 0) {
                        return state.merge(payload);
                    } else {
                        return state.mergeIn(path, payload)
                    }
                } else if (type == `MERGE_DEEP_IN`) {
                    const payload = transformToImmutable(action.payload.payload)
                    if (path.length == 0) {
                        return state.mergeDeep(payload);
                    } else {
                        return state.mergeDeepIn(path, payload)
                    }
                } else if (type == `UPDATE_IN`) {
                    return state.updateIn(path, action.payload.updater)
                } else if (type == `RESET`) {
                    return initialState
                }
                return state
            }
        }
        return reducers
    }
    createReducer() {
        return combineReducers(this.createReducers())
    }
}
