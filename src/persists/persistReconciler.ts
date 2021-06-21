import { PersistConfig } from 'redux-persist/es/types'
import { Record as ImRecord } from 'immutable'

export function persistsReconciler(
    inboundState: any,
    originalState: any,
    reducedState: any,
    config: PersistConfig<any>,
) {
    for (const fld in originalState) {
        if (fld == '_persist') continue
        if (ImRecord.isRecord(originalState[fld])) {
            if (inboundState[fld]) {
                if (config.debug) {
                    console.log('persistsReconciler merge ' + fld)
                    console.log('persistsReconciler original', originalState[fld])
                    console.log('persistsReconciler inbound', inboundState[fld])
                }
                originalState[fld] = originalState[fld].mergeWith(merger, inboundState[fld])
            }
        } else {
            if (inboundState[fld] !== undefined) {
                originalState[fld] = inboundState[fld]
            }
        }
    }
    return originalState
}
function merger(a: any, b: any) {
    //console.log('ab', a, b)
    if (ImRecord.isRecord(a)) {
        return a.mergeWith(merger, b)
    }
    return b
}
