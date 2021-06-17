import { createTransform } from 'redux-persist'
import { RecordOf } from 'immutable'
import { transformToImmutable } from './transformToImmutable'
type FilterItem = string | Record<string, FilterItem[]>
type Filter = Array<FilterItem>
export const PersistTransform = (p: { reducer?: string; filter?: Filter }) => {
    return createTransform(
        // transform state on its way to being serialized and persisted.
        (inboundState: RecordOf<any>, key, rawState) => {
            if (key == '_persist' || (p.reducer && p.reducer != key)) {
                return inboundState
            }
            //console.log('in', inboundState, key, rawState)
            if (inboundState?.toJS) {
                const obj = inboundState.toJS()
                if (p.filter) {
                    return filterObjField(obj, p.filter)
                } else return obj
            } else return inboundState
        },
        // transform state being rehydrated
        (outboundState, key, rawState) => {
            if (key == '_persist' || (p.reducer && p.reducer != key)) {
                return outboundState
            }
            console.log('out', outboundState, key, rawState)
            return transformToImmutable(outboundState)
        },
        // define which reducers this transform gets called for.
        {},
    )
}
function filterObjField(obj: Record<string, any>, filter: Filter) {
    const out: Record<string, any> = {}
    for (const f of filter) {
        if (typeof f == 'string') {
            out[f] = obj ? obj[f] : null
        } else {
            for (const fld in f) {
                out[fld] = filterObjField(obj[fld], f[fld])
            }
        }
    }
    return out
}
