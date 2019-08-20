import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    option: {},
    histroyReoute: []
  },
  mutations: {
    histroyReoute(state, obj) {
      console.log('vuex')
      let n = state.histroyReoute.indexOf(obj.params)
      if (obj.type === 'add' && n === -1) {
        state.histroyReoute.push(obj.params)
      } else if (obj.type === 'del' && n !== -1) {
        state.histroyReoute.splice(n, 1)
      }
      console.log(state.histroyReoute)
    }
  },
  actions: {
    histroyReoute({commit}, obj) {
      commit('histroyReoute', obj)
    }
  },
  getters: {
    histroyReoute: state => {
      return state.histroyReoute
    }
  }
})
