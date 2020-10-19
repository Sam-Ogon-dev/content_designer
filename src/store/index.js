import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        history: {
            last: [],
            future: [],
            preset: {},
            containerArray: []
        }
    },
    getters: {},
    mutations: {
        CHANGE_HISTORY: (state, {type, payload}) => {
            //Устанавливать в preset настоящее изменение
            if(type === "create") {
                state.history.containerArray.push(payload);
                const id = state.history.containerArray.length-1;
                state.history.preset = {
                    id,
                    state: state.history.containerArray[id]
                }
            }
            if(type === "change") {
                state.history.last.push({
                    id: payload.id,
                    state: state.history.containerArray[payload.id]
                });
                state.history.preset = {
                    id: payload.id,
                    state: payload.newState
                }
                const changedArray = [...state.history.containerArray];
                changedArray[payload.id] = payload.newState;
                state.history.containerArray = changedArray;
            }
        },
        BACK_HISTORY: state => {
            state.history.future.push(state.history.preset);
            if(state.history.last.length) {
                state.history.preset = state.history.last[state.history.last.length-1];
                const newLast = [...state.history.last];
                newLast.splice(newLast.length-1, 1);
                state.history.last = newLast;
                const newContainerArray = [...state.history.containerArray];
                newContainerArray[state.history.preset.id] = state.history.preset.state;
                state.history.containerArray = newContainerArray;
            } else {
                const newContainerArray = [...state.history.containerArray];
                newContainerArray.splice(newContainerArray.length-1, 1);
                state.history.preset = {}
                state.history.last = [];
                state.history.containerArray = newContainerArray;
            }
        },
        NEXT_HISTORY: state => {
            console.log(state.history.last)
            console.log(state.history.future)
            console.log(state.history.preset)
        }
    },
    actions: {},
});