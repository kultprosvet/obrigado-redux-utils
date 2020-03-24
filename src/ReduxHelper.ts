import { Record } from 'immutable'
import {PathValue, Path, RecursivePartial} from "./TSTypes";
//@ts-ignore
import { persistReducer } from 'redux-persist'
//@ts-ignore
import { combineReducers } from 'redux'
import * as immutableTransform from 'redux-persist-transform-immutable';

export class ReduxHelper<StoreState> {
     readonly data:StoreState;
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
            mergeIn: <T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(path: L, payload: U) => {

                this.checkInput(path[0], payload)

                store.dispatch({
                    type: `${path[0].toString().toUpperCase()}_MERGE_IN`,
                    payload: {
                        path,
                        payload
                    }
                })
            },
            mergeInAction: <T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(path: L, payload: U) => {

                this.checkInput(path[0], payload)

                return {
                    type: `${path[0].toString().toUpperCase()}_MERGE_IN`,
                    payload: {
                        path,
                        payload
                    }
                }
            },
            mergeDeepIn: <T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(path: L, payload: U) => {

                this.checkInput(path[0], payload)

                store.dispatch({
                    type: `${path[0].toString().toUpperCase()}_MERGE_DEEP_IN`,
                    payload: {
                        path,
                        payload
                    }
                })
            },
            mergeDeepInAction: <T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(path: L, payload: U) => {

                this.checkInput(path[0], payload)

                return {
                    type: `${path[0].toString().toUpperCase()}_MERGE_DEEP_IN`,
                    payload: {
                        path,
                        payload
                    }
                }
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
            updateInAction: <T extends StoreState, L extends Path<T, L>>(path:L, updater:(value:PathValue<T, L>)=>any) => {

                this.checkInput(path[0])

                if(typeof path == 'undefined' || !Array.isArray(path)) {
                    throw Error ('Please provide valid path (array of strings and/or numbers) as a first argument')
                }

                if(typeof updater != 'function') {
                    throw Error ('Please provide an updater function as a second argument')
                }

                return {
                    type: `${path[0].toString().toUpperCase()}_UPDATE_IN`,
                    payload: {
                        path,
                        updater
                    }
                }

            },
            reset: <K extends keyof StoreState>(type: K) => {

                this.checkInput(type)

                store.dispatch({
                    type: `${type.toString().toUpperCase()}_RESET`
                })
            },
            resetAction: <K extends keyof StoreState>(type: K) => {

                this.checkInput(type)

                return {
                    type: `${type.toString().toUpperCase()}_RESET`
                }
            }
        }

    }

    generateReducers() {
        let reducers:any={}
        for (let key in this.data){
            const initialState = Record(this.data[key], key)
            reducers[key] = (state =  initialState(), action) => {
                if(action.type==`${key.toUpperCase()}_MERGE_IN`) {
                    action.payload.path.splice(0,1)
                    return state.mergeIn(action.payload.path, action.payload.payload)
                } else if(action.type==`${key.toUpperCase()}_MERGE_DEEP_IN`) {
                    action.payload.path.splice(0,1)
                    return state.mergeDeepIn(action.payload.path, action.payload.payload)
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
    generatePersistsReducers(storageEngine:any, whiteList:string[], customReducers?:object){

        const reducers=this.generateReducers()

        const records = []
        for (let key in this.data) {
            //@ts-ignore
            records.push(Record(this.data[key], key))
        }

        const persistConfig = {
            key: 'root',
            storage: storageEngine,
            whitelist: whiteList,
            transforms: [immutableTransform({records: records})]
        }

        console.log('persistConfig', persistConfig)

        const rootPersistReducer = customReducers
            ? combineReducers({...reducers, ...customReducers})
            : combineReducers({...reducers});

        console.log('rootPersistReducer', rootPersistReducer)

        return persistReducer(persistConfig, rootPersistReducer)
    }
}

export type StoreState = typeof ReduxHelper
