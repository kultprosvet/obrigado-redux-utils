import {buildStore, ReduxStoreState} from "./store";

describe("redux helper", () => {
    it("should throw exception on direct state change", () => {
        const {store} = buildStore();
        const state = store.getState() as any;
        expect(() => {
            state.user.age = 30
        }).toThrow();
    });
    it("should deep update state", () => {
        const {store, ReduxHelper} = buildStore();

        // add time to first date
        ReduxHelper.updateIn(['week', 'days', 0, 'times'], arr =>
          arr.push({time: '12:00:00'}),
        );
        let state = store.getState() as any;
        expect(state.week.toJS().days[0].times).toEqual([{time: '12:00:00'}, {time: '12:00:00'}])

        // add new day
        ReduxHelper.updateIn(['week', 'days'], arr =>
          arr.push({times: [{time: '12:00:00'}]}),
        );
        state = store.getState() as any;
        expect(state.week.toJS().days).toEqual([{times: [{time: '12:00:00'}, {time: '12:00:00'}]}, {times: [{time: '12:00:00'}]}])

        // add time to new day
        ReduxHelper.updateIn(['week', 'days', 1, 'times'], arr =>
          arr.push({time: '12:00:00'}),
        );
        state = store.getState() as any;
        expect(state.week.toJS().days).toEqual([{times: [{time: '12:00:00'}, {time: '12:00:00'}]}, {times: [{time: '12:00:00'}, {time: '12:00:00'}]}])
    });
    it("should allow to transform state to JS",()=>{
        const {store} = buildStore();
        const state = store.getState() as any;
        expect(state.user.toJS).toBeDefined();
        expect(state.user.toJS()).toBeDefined();
        expect(state.user.job.toJS).toBeDefined();
        expect(state.user.job.schedule.toJS).toBeDefined();
    });
    it("should update state", () => {
        const {store, ReduxHelper} = buildStore();
        let state = store.getState() as ReduxStoreState;
        expect(state.user.age).toEqual(25);
        ReduxHelper.setIn(["user", "name","firstName"], "Stas");
        state = store.getState() as ReduxStoreState
        expect(state.user.name.firstName).toEqual("Stas");
    })
    it("should merge state", () => {
        const {store, ReduxHelper} = buildStore();
        ReduxHelper.mergeIn(["user", "name"], {firstName: "Stas"});
        let state = store.getState() as ReduxStoreState
        expect(state.user.name.firstName).toEqual("Stas");
        // deepm merge check
        ReduxHelper.mergeDeepIn(["user","job"], {
                schedule: {
                    mon: "10: 00 AM"
                }
            }
        );
        state = store.getState() as ReduxStoreState
        expect(state.user.job.schedule.mon).toEqual("10: 00 AM");
        // merge on top level
        ReduxHelper.mergeIn(["user"],{name:{firstName:"Vasiliy"}});
        state = store.getState() as ReduxStoreState
        expect(state.user.name.firstName).toEqual("Vasiliy");
        expect(state.user.name.lastName).not.toBeDefined();
        ReduxHelper.reset("user");
        ReduxHelper.mergeDeepIn(["user"],{name:{firstName:"Vasiliy"}});
        state = store.getState() as ReduxStoreState
        expect(state.user.name.firstName).toEqual("Vasiliy");
        expect(state.user.name.lastName).toEqual("Bdjolko");

        ReduxHelper.mergeIn(["posts"],{data:["one","two","three"]});
        state = store.getState() as ReduxStoreState
        expect(state.posts.data.toJS).toBeDefined();
        expect(state.posts.data.toArray()).toEqual(["one","two","three"]);

    })
    it("should run updater", () => {
        const {store, ReduxHelper} = buildStore();
        ReduxHelper.updateIn(["posts","data"],(list)=>{
            return list.push("XXX");
        });
        let state = store.getState() as ReduxStoreState
        expect(state.posts.data.toArray()).toEqual(['one', 'two',"XXX"]);
    });
    it("should reset state to initial value", () => {
        const {store, ReduxHelper} = buildStore();
        let state = store.getState() as ReduxStoreState;
        expect(state.user.age).toEqual(25);
        let act: any = ReduxHelper.setInAction(["user", "age"], 30);
        // @ts-ignore
        store.dispatch(act);
        act = ReduxHelper.setInAction(["isBool"], false);
        // @ts-ignore
        store.dispatch(act)
        //await wait(10);
        state = store.getState() as ReduxStoreState;
        expect(state.user.age).toEqual(30);
        act = ReduxHelper.resetAction("user");
        // @ts-ignore
        store.dispatch(act)
        state = store.getState() as ReduxStoreState;
        expect(state.user.age).toEqual(25);
        expect(state.isBool).toEqual(false);
    })

});

