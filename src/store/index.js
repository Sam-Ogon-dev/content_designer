import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
//хранить во всех типах истории изменения в виде {id, event, state}

export const store = new Vuex.Store({
    state: {
        history: {
            last: [],
            future: [],
            preset: {},
            containerArray: []
        },
        activeContainer: 0
    },
    getters: {},
    mutations: {
        CHANGE_HISTORY: (state, {type, payload}) => {
            if(state.history.future.length) {
                state.history.future = [];
            }
            if (type === "created") {
                state.history.containerArray.push(payload);


                if (state.history.preset.id !== undefined) {
                    state.history.last.push({
                        id: state.history.preset.id,
                        type: state.history.preset.type,
                        state: state.history.preset.state
                    })
                }

                const id = state.history.containerArray.length - 1;
                state.history.preset = {
                    id,
                    type: "created",
                    state: state.history.containerArray[id]
                }
            }
            if (type === "change") {
                state.history.last.push({
                    id: state.history.preset.id,
                    type: state.history.preset.type,
                    state: state.history.preset.state
                });
                state.history.preset = {
                    id: payload.id,
                    type: "change",
                    state: payload.newState
                }
                const changedArray = [...state.history.containerArray];
                changedArray[payload.id] = payload.newState;
                state.history.containerArray = changedArray;
            }
        },
        BACK_HISTORY: state => {
            if(state.history.preset) {
                state.history.future.unshift(state.history.preset);
            }

            if (state.history.last.length) {

                if (state.history.preset.type === "created") {
                    const newContainerArray = [...state.history.containerArray];
                    newContainerArray.splice(state.history.preset.id, 1);
                    state.history.containerArray = newContainerArray;
                    state.history.preset = state.history.last[state.history.last.length - 1];
                }


                if (state.history.preset.type === "change") {
                    state.history.preset = state.history.last[state.history.last.length - 1];
                    const newContainerArray = [...state.history.containerArray];
                    newContainerArray[state.history.preset.id] = state.history.preset.state;
                    state.history.containerArray = newContainerArray;
                }

                const newLast = [...state.history.last];
                newLast.splice(newLast.length - 1, 1);
                state.history.last = newLast;

            } else {
                const newContainerArray = [...state.history.containerArray];
                newContainerArray.splice(newContainerArray.length - 1, 1);
                state.history.preset = false
                state.history.last = [];
                state.history.containerArray = newContainerArray;
            }

        },
        NEXT_HISTORY: state => {
            if (!state.history.future.length) {
                return;
            }
            state.history.last.push(state.history.preset);
            state.history.preset = state.history.future[0];

            if(state.history.preset.type === "change") {
                const newContainerArray = [...state.history.containerArray];
                newContainerArray[state.history.future[0].id] = state.history.future[0].state;
                state.history.containerArray = newContainerArray;
            }
            if(state.history.preset.type === "created") {
                const newContainerArray = [...state.history.containerArray];
                newContainerArray.push(state.history.future[0].state);
                state.history.containerArray = newContainerArray;
            }


            const newFuture = [...state.history.future];
            newFuture.splice(0, 1);
            state.history.future = newFuture;
        },
        SET_ACTIVE_CONTAINER: (state, date) => {
            state.activeContainer = date;
        }
    },
    actions: {},
});