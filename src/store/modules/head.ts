import { Module } from "vuex";

interface HeadState {
  zIndex: number
}

const originZIndex = 99

const head: Module<any, any> = {
  namespaced: true,
  state: {
    zIndex: originZIndex
  },
  mutations: {
    setZIndex: (state, num: number) => {
      state.zIndex = num
    }
  },
  actions: {
    setZIndexAsync: (state, num?: number) => {
      // vant遮罩层动画默认300ms，所以这里是300
      if (num === undefined)
        setTimeout(() => state.commit('setZIndex', originZIndex), 300)
      else
        state.commit('setZIndex', num)
    }
  }
}

export default head