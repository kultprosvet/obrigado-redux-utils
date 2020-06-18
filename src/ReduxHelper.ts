import { Path, PathValue, RecursivePartial } from './TSTypes'

export class ReduxHelper<StoreState> {
    store
    data

    constructor(store, data) {
        this.store = store
        this.data = data
    }

    private checkInput(type, payload?) {
        const types = Object.keys(this.data)
        if (!types.includes(type.toString())) {
            throw Error(`Key ${type.toString()} does not exist`)
            return
        }
    }
    setIn<T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(
        path: L,
        payload: U,
    ) {
        this.checkInput(path[0], payload)
        //@ts-ignore
        this.store.dispatch(this.setInAction(path, payload))
    }

    setInAction<T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(
        path: L,
        payload: U,
    ) {
        this.checkInput(path[0], payload)

        return {
            type: `${path[0].toString().toUpperCase()}_SET_IN`,
            payload: {
                path,
                payload,
            },
        }
    }
    mergeIn<T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(
        path: L,
        payload: U,
    ) {
        this.checkInput(path[0], payload)
        //@ts-ignore
        this.store.dispatch(this.mergeInAction(path, payload))
    }

    mergeInAction<T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(
        path: L,
        payload: U,
    ) {
        this.checkInput(path[0], payload)

        return {
            type: `${path[0].toString().toUpperCase()}_MERGE_IN`,
            payload: {
                path,
                payload,
            },
        }
    }

    mergeDeepIn<T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(
        path: L,
        payload: U,
    ) {
        this.checkInput(path[0], payload)
        //@ts-ignore
        this.store.dispatch(this.mergeDeepInAction(path, payload))
    }

    mergeDeepInAction<T extends StoreState, L extends Path<T, L>, U extends RecursivePartial<PathValue<T, L>>>(
        path: L,
        payload: U,
    ) {
        this.checkInput(path[0], payload)

        return {
            type: `${path[0].toString().toUpperCase()}_MERGE_DEEP_IN`,
            payload: {
                path,
                payload,
            },
        }
    }

    updateIn<T extends StoreState, L extends Path<T, L>>(path: L, updater: (value: PathValue<T, L>) => any) {
        this.checkInput(path[0])

        if (typeof path == 'undefined' || !Array.isArray(path)) {
            throw Error('Please provide valid path (array of strings and/or numbers) as a first argument')
            return
        }

        if (typeof updater != 'function') {
            throw Error('Please provide an updater function as a second argument')
            return
        }
        //@ts-ignore
        this.store.dispatch(this.updateInAction(path, updater))
    }

    updateInAction<T extends StoreState, L extends Path<T, L>>(path: L, updater: (value: PathValue<T, L>) => any) {
        this.checkInput(path[0])

        if (typeof path == 'undefined' || !Array.isArray(path)) {
            throw Error('Please provide valid path (array of strings and/or numbers) as a first argument')
        }

        if (typeof updater != 'function') {
            throw Error('Please provide an updater function as a second argument')
        }

        return {
            type: `${path[0].toString().toUpperCase()}_UPDATE_IN`,
            payload: {
                path,
                updater,
            },
        }
    }

    reset<K extends keyof StoreState>(type: K) {
        this.checkInput(type)

        this.store.dispatch(this.resetAction(type))
    }

    resetAction<K extends keyof StoreState>(type: K) {
        this.checkInput(type)

        return {
            type: `${type.toString().toUpperCase()}_RESET`,
        }
    }
}
