const state={  
    global:{}
};
const getters = {   
    global: (state)=> {
        return state.global;
    }
};
const mutations = {
    m_global: (state,obj) => {
        state.global = obj;
    }
};
const actions = {
    a_global: (state,obj) => {
        state.commit('m_global',obj);
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
