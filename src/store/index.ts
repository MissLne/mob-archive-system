import Vue from 'vue'
import Vuex from 'vuex'
// module
import metaData from './modules/meta-data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _permissionList: [] as Array<string>,
    isDetailAlive: false,
    faceData: [] as Array<FaceData>
  },
  getters: {
    permissionList: state => (query: string) => {
      if (state._permissionList.length === 0)
        (state._permissionList = JSON.parse(localStorage.getItem('permissionList') as string))
      return state._permissionList.indexOf(query)
    },

  },
  mutations: {
    setDetailAlive: (state, isAlive) => {
      state.isDetailAlive = isAlive
    },
    setFaceData: (state, array) => {
      state.faceData = array
    }
  },
  actions: {
  },
  modules: {
    metaData
  }
})
