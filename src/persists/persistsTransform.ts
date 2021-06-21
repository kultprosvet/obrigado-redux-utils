import { createTransform } from 'redux-persist'
import { RecordOf } from 'immutable'
import { transformToImmutable } from './transformToImmutable'
type FilterItem = string | Record<string, FilterItem[]>
type Filter = Array<FilterItem>
export const PersistTransform = (p?: { whitelist: Filter }) => {
    let config = {}
    const whileListMap: Record<any, any> = {}
    if (p) {
        const whitelist: string[] = []
        for (const item of p.whitelist || []) {
            if (typeof item == 'string') {
                whitelist.push(item)
                whileListMap[item] = true
            }
            if (typeof item == 'object') {
                for (const fld in item) {
                    whileListMap[fld] = item[fld]
                    whitelist.push(fld)
                }
            }
        }
        config = { whitelist }
    }

    return createTransform(
        // transform state on its way to being serialized and persisted.
        (inboundState: RecordOf<any>, key, rawState) => {
            if (key == '_persist') {
                return inboundState
            }
            //console.log('in', inboundState, key, rawState)
            if (inboundState?.toJS) {
                const obj = inboundState.toJS()
                if (whileListMap[key as string]) {
                    return filterObjField(obj, whileListMap[key as string])
                } else return {}
            } else return inboundState
        },
        // transform state being rehydrated
        (outboundState, key, rawState) => {
            if (key == '_persist') {
                return outboundState
            }
            return transformToImmutable(outboundState)
        },
        // define which reducers this transform gets called for.
        config,
    )
}
function filterObjField(obj: Record<string, any>, filter: Filter | boolean) {
    const out: Record<string, any> = {}
    if (typeof filter == 'boolean') {
        return obj
    }
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
