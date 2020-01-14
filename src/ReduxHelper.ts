import {Record} from 'immutable'
import { PathValue, Path } from "./TSTypes";


export class ReduxHelper<StoreState> {
    private readonly data:StoreState;
    constructor(data:StoreState) {
        this.data = data;
    }

    private checkInput(type, payload?) {
        const types = Object.keys(this.data)
        if (!types.includes(type.toString())) {
            throw Error ('Type does not exist')
            return
        }

        if (typeof payload !== 'undefined') {
            if (typeof payload !== "object" || payload == null) {
                throw Error ('Payload must be an object')
                return
            }
        }
    }

    generateActions(store) {

        if (typeof store == "undefined") {
            throw Error ('Store is undefined')
        }

        return  {
            mergeIn: <T extends StoreState, L extends Path<T, L>>(path: L, payload:PathValue<T, L>) => {

                this.checkInput(path[0], payload)

                store.dispatch({
                    type: `${path[0].toString().toUpperCase()}_MERGE_IN`,
                    payload: {
                        path,
                        payload
                    }
                })
            },
            mergeDeep: <T extends StoreState, L extends Path<T, L>>(path: L, payload:PathValue<T, L>) => {

                this.checkInput(path[0], payload)

                store.dispatch({
                    type: `${path[0].toString().toUpperCase()}_MERGE_DEEP`,
                    payload: {
                        path,
                        payload
                    }
                })
            },
            updateIn: <T extends StoreState, L extends Path<T, L>>(path:L, updater:(value:PathValue<T, L>)=>any) => {

                this.checkInput(path[0])

                if(typeof path == 'undefined' || !Array.isArray(path)) {
                    throw Error ('Please provide valid path (array of strings and/or numbers) as a first argument')
                    return
                }

                if(typeof updater != 'function') {
                    throw Error ('Please provide an updater function as a second argument')
                    return
                }

                store.dispatch({
                    type: `${path[0].toString().toUpperCase()}_UPDATE_IN`,
                    payload: {
                        path,
                        updater
                    }
                })

            },
            reset: <K extends keyof StoreState>(type: K) => {

                this.checkInput(type)

                store.dispatch({
                    type: `${type.toString().toUpperCase()}_RESET`
                })
            }
        }

    }

    createReducers() {
        let reducers:any={}
        for (let key in this.data){
            const initialState = Record(this.data[key],key)
            reducers[key] = (state =  initialState(), action) => {
                if(action.type==`${key.toUpperCase()}_MERGE_IN`) {
                    console.log('type', typeof state)
                    action.payload.path.splice(0,1)
                    return state.mergeIn(action.payload.path, action.payload.payload)
                } else if(action.type==`${key.toUpperCase()}_MERGE_DEEP`) {
                    action.payload.path.splice(0, 1)
                    return state.mergeDeep(action.payload.path, action.payload.payload)
                } else if(action.type==`${key.toUpperCase()}_UPDATE_IN`){
                    action.payload.path.splice(0,1)
                    return state.updateIn(action.payload.path, action.payload.updater)
                } else if(action.type==`${key.toUpperCase()}_RESET`) {
                    return initialState()
                }
                return state
            }
        }
        return reducers
    }
}

export type StoreState = typeof ReduxHelper
