import { takeEvery, call } from 'redux-saga/effects'

import { Path, PathValue } from './types/TSTypes'
type Action = {
    type: string
    payload: any
}
type SagaAction = {
    type: string
    resolve: (result: any) => void
    reject: (error: any) => void
    payload: any
}
function* sagaRunner(saga: (...args: any[]) => any, action: SagaAction) {
    try {
        const result = yield call(saga, ...action.payload)
        action.resolve(result)
    } catch (e) {
        action.reject(e)
    }
}

export function createRootSaga(modules: any) {
    return function* (action: Action) {
        for (const m in modules) {
            for (const saga in modules[m]) {
                const module = modules[m]
                // @ts-ignore
                yield takeEvery(`RUN_${m.toUpperCase()}_${saga.toUpperCase()}`, sagaRunner.bind({}, module[saga]))
            }
        }
    }
}
type FunctionWrapper<F> = F extends (...args: any) => any ? F : (a: any) => void
export function createSagaHelper<SagaModules>(modules: SagaModules, store: any): SagaHelper<SagaModules> {
    return new SagaHelper<SagaModules>(store)
}
export class SagaHelper<SagaModules> {
    private store
    constructor(store) {
        this.store = store
    }
    setStore(store: any) {
        this.store = store
    }
    run<T extends SagaModules, L extends Path<T, L>, U extends Parameters<FunctionWrapper<PathValue<T, L>>>>(
        path: L,
        ...payload: U
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const sagaAction = {
                // @ts-ignore
                type: `RUN_${path[0].toUpperCase()}_${path[1].toUpperCase()}`,
                resolve,
                reject,
                payload,
            }
            // @ts-ignore
            this.store.dispatch(sagaAction)
        })
    }
    //Can be used in envs when store is inaccessible ( react admin)
    runWithDispatch<
        T extends SagaModules,
        L extends Path<T, L>,
        U extends Parameters<FunctionWrapper<PathValue<T, L>>>
    >(path: L, dispatch: (payload: any) => void, ...payload: U): Promise<any> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const sagaAction = {
                // @ts-ignore
                type: `RUN_${path[0].toUpperCase()}_${path[1].toUpperCase()}`,
                resolve,
                reject,
                payload,
            }
            // @ts-ignore
            dispatch(sagaAction)
        })
    }
}
