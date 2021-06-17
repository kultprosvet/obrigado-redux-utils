import { PersistConfig } from 'redux-persist/es/types'
import { Record as ImRecord } from 'immutable'

export function persistsReconciler(
    inboundState: any,
    originalState: any,
    reducedState: any,
    { debug }: PersistConfig<any>,
) {
    for (const fld in originalState) {
        if (fld == '_persists') {
            originalState[fld] = inboundState[fld]
            continue
        }
        if (ImRecord.isRecord(originalState[fld])) {
            if (inboundState[fld]) {
                if (debug) {
                    console.log('persistsReconciler merge ' + fld)
                    console.log('persistsReconciler original', originalState[fld])
                    console.log('persistsReconciler inbound', inboundState[fld])
                }
                originalState[fld] = originalState[fld].mergeWith(merger, inboundState[fld])
            }
        }
    }
    return originalState
}
function merger(a: any, b: any) {
    console.log('ab', a, b)
    if (ImRecord.isRecord(a)) {
        return a.mergeWith(merger, b)
    }
    return b
}
