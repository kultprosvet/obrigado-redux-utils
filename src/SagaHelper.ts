import { takeEvery, call } from 'redux-saga/effects'
import { Action } from 'redux'

type SagaAction = {
    type: string
    resolve: (result: any) => void
    reject: (error: any) => void
    payload: any
}
function* sagaRunner(saga: (...args: any[]) => any, action: SagaAction) {
    try {
        const result = yield call(saga, action.payload)
        action.resolve(result)
    } catch (e) {
        action.reject(e)
    }
}
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type Keys<T extends Array<any>> = keyof UnionToIntersection<T[number]>

export function createRootSaga(modules: Array<any>) {
    return function*(action: Action) {
        for (const module of modules) {
            for (const saga in module) {
                // @ts-ignore
                yield takeEvery(`RUN_${saga.toUpperCase()}`, sagaRunner.bind({}, module[saga]))
            }
        }
    }
}
export function createSagaHelper<T extends any[]>(modules: T, store: any) {
    return {
        run: (sagaName: Keys<T>, payload: any = {}): Promise<any> => {
            return new Promise((resolve, reject) => {
                const sagaAction = { type: 'RUN_' + (sagaName as string).toUpperCase(), resolve, reject, payload }
                // @ts-ignore
                store.dispatch(sagaAction)
            })
        },
    }
}
