import {buildStore} from "./store";

describe("redux helper", () => {
    it("should reset state to initial value", async () => {
        const {store, ReduxHelper} = buildStore();
        let state: any = store.getState()
        expect(state.user.age).toEqual(25);
        let act: any = ReduxHelper.setInAction(["user", "age"], 30);
        // @ts-ignore
        store.dispatch(act);
        act = ReduxHelper.setInAction(["isBool"], false);
        // @ts-ignore
        store.dispatch(act)
        //await wait(10);
        state = store.getState()
        expect(state.user.age).toEqual(30);
        act = ReduxHelper.resetAction("user");
        // @ts-ignore
        store.dispatch(act)
        state = store.getState()
        expect(state.user.age).toEqual(25);
        expect(state.isBool).toEqual(false);
    })

});

