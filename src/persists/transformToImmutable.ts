import { List } from 'immutable'
import { Record } from 'immutable'
import * as _ from 'lodash'
export function transformToImmutable(v: any | never): any {
    if (Record.isRecord(v) || List.isList(v)) return v
    if (Array.isArray(v)) {
        const out: any[] = []
        for (const item of v) {
            const outItem = transformToImmutable(item)
            out.push(outItem)
        }
        return List(out)
    } else if (v instanceof Date) {
        return v
    } else if (_.isObjectLike(v)) {
        const out: any = {}
        for (const fld in v) {
            out[fld] = transformToImmutable(v[fld])
        }

        return Record(out)()
    }

    return v
}
