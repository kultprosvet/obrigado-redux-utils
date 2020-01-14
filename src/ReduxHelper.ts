import {Record} from 'immutable'

type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
            T[P];
};

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
        return  {
            merge: <K extends keyof StoreState>(type: K & string, payload:RecursivePartial<StoreState[K]>) => {

                this.checkInput(type, payload)

                store.dispatch({
                    type: `${type.toString().toUpperCase()}_MERGE`,
                    payload
                })
            },
            updateIn: <K extends keyof StoreState,ValueType>(type: K & string,path:(string|number)[],updater:(value:ValueType)=>ValueType, vType?:ValueType) => {

                this.checkInput(type)

                if(typeof path == 'undefined' || !Array.isArray(path)) {
                    throw Error ('Please provide valid path (array of strings and/or numbers) as a second argument')
                    return
                }

                if(typeof updater != 'function') {
                    throw Error ('Please provide an updater function as a third argument')
                    return
                }

                store.dispatch({
                    type: `${type.toString().toUpperCase()}_UPDATE_IN`,
                    payload: {
                        path,
                        updater
                    }
                })

            },
            reset: <K extends keyof StoreState>(type: K & string) => {

                this.checkInput(type)

                store.dispatch({
                    type: `${type.toUpperCase()}_RESET`
                })
            }
        }

    }

    createReducers() {
        let reducers:any={}
        for (let key in this.data){
            const initialState = Record(this.data[key],key)
            reducers[key] = (state =  initialState(), action) => {
                if(action.type==`${key.toUpperCase()}_MERGE`) {
                    return state.mergeDeep(action.payload)
                } else if(action.type==`${key.toUpperCase()}_UPDATE_IN`){
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

