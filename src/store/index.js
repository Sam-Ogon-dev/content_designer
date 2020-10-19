import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        history: {
            last: [],
            future: [],
            containerArray: []
        }
    },
    getters: {},
    mutations: {
        ADD_TO_LAST_HISTORY: (state, {type, payload}) => {
            if(type === "create") {
                state.history.containerArray.push(payload);
            }
            if(type === "change") {
                state.history.last.push(payload);
            }
            console.log(state)
        },
        ADD_TO_FUTURE_HISTORY: ({history}) => {
            // history.future.push(...history.container.splice(history.container.length-1, 1));
            // history.container.push(...history.last.splice(history.last.splice, 1));
            console.log(history.last)
            console.log(history.future)
            console.log(history.container)
        }
    },
    actions: {},
});