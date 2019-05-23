const state={  
    global:{}
};
const getters = {   
    GLOBAL: (state)=> {
        return state.global;
    }
};
const mutations = {
    SET_GLOBAL: (state,obj) => {
        state.global = obj;
    }
};
const actions = {
    GLOBAL: (state,obj) => {
        state.commit('SET_GLOBAL',obj);
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
