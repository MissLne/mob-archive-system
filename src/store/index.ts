import Vue from 'vue'
import Vuex from 'vuex'
// module
import metaData from './modules/meta-data'
import selectData from './modules/select-data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _permissionList: [] as Array<string>,
    includeList: [] as Array<string>,
    faceData: [] as Array<FaceData>,
    isDetailPage: 0
  },
  getters: {
    permissionList: state => (query: string) => {
      if (state._permissionList.length === 0)
        (state._permissionList = JSON.parse(localStorage.getItem('permissionList') as string))
      return state._permissionList.indexOf(query)
    },

  },
  mutations: {
    setIncludeList: (state, list) => {
      state.includeList = list
    },
    setFaceData: (state, array) => {
      state.faceData = array
    },
    setDetailPage(state) {
      state.isDetailPage = 1
      setTimeout(() => {
        state.isDetailPage = 0
      },1000)
    }
  },
  actions: {
  },
  modules: {
    metaData,
    selectData,
  }
})
