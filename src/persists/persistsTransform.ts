import { createTransform } from 'redux-persist'
import { RecordOf } from 'immutable'
import { transformToImmutable } from './transformToImmutable'

export const PersistTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState: RecordOf<any>, key) => {
        // convert mySet to an Array.
        return inboundState.toJS()
    },
    // transform state being rehydrated
    (outboundState, key) => {
        // convert mySet back to a Set.
        return transformToImmutable(outboundState)
    },
    // define which reducers this transform gets called for.
    {},
)
