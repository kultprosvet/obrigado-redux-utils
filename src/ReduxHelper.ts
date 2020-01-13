import {Record} from 'immutable'

type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
            T[P];
};

export const ReduxHelper = {
    // keys<T>(data:T):[keyof T]{
    //     return Object.keys(data)
    // },
    generateActions<T>(data:T, store) {
        const types = Object.keys(data)
        return  {
            update<K extends keyof T>(type: K, payload:RecursivePartial<T[K]>){
                if (!types.includes(type.toString())) {
                    throw Error ('Type does not exist')
                    return
                }

                if (typeof payload !== "object" || payload == null) {
                    throw Error ('Payload must be an object')
                    return
                }

                store.dispatch({
                    type: `${type.toString().toUpperCase()}_UPDATE`,
                    payload
                })
            },

            reset(type) {
                store.dispatch({
                    type: `${type.toUpperCase()}_UPDATE`
                })
            }
        }

    },

    createReducers(data) {
        let reducers:any={}
        for (let key in data){
            const initialState = Record(data[key])
            reducers[key] = function (state = new initialState(data[key]), action) {
                if(action.type==`${key.toUpperCase()}_UPDATE`) {
                    return state.mergeDeep(action.payload)
                } else if(action.type==`${key.toUpperCase()}_RESET`){
                    return data[key]
                }
                return state
            }
        }
        return reducers
    },
}
// export const data = {
//     user: {
//         name: 'John',
//         age: 20
//     },
//     posts: {
//         first: {
//             title: {
//                 en: 'Title',
//                 ru: 'Заголовок'
//             },
//             text: 'Lorem ipsum'
//         },
//         count: 15
//     }
// }
// let actions=ReduxHelper.generateActions(data,{})
// actions.update("posts", {first: {
//     title: {
//         en: 'FASDGDFG'
//     }
// }})

