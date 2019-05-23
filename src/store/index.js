import Vue from 'vue'
import Vuex from 'vuex'
import im from './modules/im'
import global from './modules/global'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    im,
    global
  }
})

export default store
