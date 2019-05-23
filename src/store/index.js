import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import im from './modules/im'
import global from './modules/global'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    im,
    global
  },
  getters
})

export default store
