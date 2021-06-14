import { List, RecordOf } from 'immutable'

export type ReduxStoreStateTemplate<T> = T extends Record<string, any>
    ? RecordOf<
          {
              [P in keyof T]: T[P] extends Array<infer W>
                  ? List<ReduxStoreStateTemplate<W>>
                  : T[P] extends Record<string, any>
                  ? ReduxStoreStateTemplate<T[P]>
                  : T[P]
          }
      >
    : T
