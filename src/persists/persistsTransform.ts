import { createTransform } from 'redux-persist'
import { RecordOf } from 'immutable'
import { transformToImmutable } from './transformToImmutable'
type FilterItem = string | Record<string, FilterItem[]>
type Filter = Array<FilterItem>
export const PersistTransform = (p?: { whitelist: Filter }) => {
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
    }

    return createTransform(
        // transform state on its way to being serialized and persisted.
        (inboundState: RecordOf<any>, key, rawState) => {
            if (key == '_persist') {
                return inboundState
            }
            if (!whileListMap[key as string]) {
                return undefined
            }
            //console.log('in', inboundState, key, rawState)
            if (inboundState?.toJS) {
                const obj = inboundState.toJS()
                // @ts-ignore
                return filterObjField(obj, whileListMap[key as string])
            } else return inboundState
        },
        // transform state being rehydrated
        (outboundState, key, rawState) => {
            if (key == '_persist') {
                return outboundState
            }
            return transformToImmutable(outboundState)
        },
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
