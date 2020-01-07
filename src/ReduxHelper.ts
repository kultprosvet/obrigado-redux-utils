export const ReduxHelper = {
    getActionTypes(data) {
        const types = Object.keys(data)
        const actionTypes = <string[]> []
        types.forEach((type:string) => {
            actionTypes.push(type.toUpperCase() + '_UPDATE')
            actionTypes.push(type.toUpperCase() + '_RESET')
        })
        return actionTypes
    },

    generateActions(data) {
        const types = Object.keys(data)
        const actions = {}
        types.forEach(type => {

            actions['update'] = (type:string, payload:any) => {
                if (!types.includes(type)) {
                    throw Error ('Type does not exist')
                    return
                }

                if (!payload) {
                    throw Error ('Please provide payload')
                    return
                }
            }

            actions['reset'] = (type) => {}

        })
        return actions
    },

    createReducers(data) {
        let reducers:any={}
        for (let key in data){
            reducers[key] = function (state = data[key], action) {
                if(action.type==`${key.toUpperCase()}_UPDATE`) {
                    return {...state, ...action.payload}
                } else if(action.type==`${key.toUpperCase()}_RESET`){
                    return data[key]
                }
                return state
            }
        }
        return reducers
    },
}


