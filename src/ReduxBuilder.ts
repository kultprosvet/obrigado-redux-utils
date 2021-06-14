//@ts-ignore
import { ReduxHelper } from './ReduxHelper'
import { transformToImmutable } from './persists/transformToImmutable'
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
    createReducer() {
        const initialState = transformToImmutable(this.data)
        const reducer = (state = initialState, action: ReduxAction) => {
            const payload = transformToImmutable(action.payload?.payload)
            // console.log(action)
            const reg = /.*__(SET_IN|MERGE_IN|MERGE_DEEP_IN|UPDATE_IN)$/
            const path = action.payload?.path
            const match = action.type.match(reg)
            if (match && (!path || path?.length == 0)) throw new Error('Please specify path')
            const type = match?.[1]
            if (type == `SET_IN`) {
                if (!state) {
                    const state = initialState
                    return state.setIn(action.payload.path, payload)
                } else {
                    return state.setIn(action.payload.path, payload)
                }
            } else if (type == `MERGE_IN`) {
                return state.mergeIn(action.payload.path, payload)
            } else if (type == `MERGE_DEEP_IN`) {
                return state.mergeDeepIn(action.payload.path, payload)
            } else if (type == `UPDATE_IN`) {
                return state.updateIn(action.payload.path, action.payload.updater)
            } else if (type == `$RESET`) {
                return initialState
            }
            return state
        }
        return reducer
    }

    /**
     * @deprecated use createReducer
     */
    createReducers() {
        throw new Error('Please use createReducer')
    }
}
