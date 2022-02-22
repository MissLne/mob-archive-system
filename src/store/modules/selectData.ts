import { getAllTheme, getThemeDetail } from "@/services/theme";
import { Toast } from "vant";
import { Module } from "vuex";

const selectData: Module<any, any> = {
  namespaced: true,
  state: {
    // 校史征集的
    _allDepartmentNameTree: [],
    _collectFilesType: [],
    // 登录后的
    _fondsIdentifier: [],
    _dossierType: [],
    _departmentNameTree: [],
    confidentialLevelArray: [
      { name: '公开', id: 0 },
      { name: '内部', id: 1 },
      { name: '绝密', id: 2 },
      { name: '机密', id: 3 },
      { name: '秘密', id: 4 }
    ],
    retentionPeriodArray: ['永久', '30年', '10年'],
    themeList: [],
    //改版后用的，用于确定点击跑马灯进来后确定的主题
    selectedThemeId: '',
    selectedThemeDetail: {}
  },
  getters: {
    fondsIdentifier: state => {
      if (state._fondsIdentifier.length === 0)
        state._fondsIdentifier = JSON.parse(localStorage.getItem('fondsIdentifier') as string)
      return state._fondsIdentifier;
    },
    dossierType: state => {
      if (state._dossierType.length === 0)
        state._dossierType = JSON.parse(localStorage.getItem('dossierType') as string)
      return state._dossierType;
    },
    departmentNameTree: state => {
      if (state._departmentNameTree.length === 0)
        state._departmentNameTree = JSON.parse(localStorage.getItem('departmentNameTree') as string)
      return state._departmentNameTree;
    },
    allDepartmentNameTree: state => {
      if (state._allDepartmentNameTree.length === 0)
        state._allDepartmentNameTree = JSON.parse(localStorage.getItem('allDepartmentNameTree') as string)
      return state._allDepartmentNameTree;
    },
    collectFilesType: state => {
      if (state._collectFilesType.length === 0)
        state._collectFilesType = JSON.parse(localStorage.getItem('collectFilesType') as string)
      return state._collectFilesType;
    }
  },
  mutations: {
    setThemeList: (state, payload) => {
      state.themeList = payload
    },
    setSelectedThemeId: (state, payload) => {
      state.selectedThemeId = payload
    }
  },
  actions: {
    setThemeListAsync: async ({ commit }, payload?: { needNull: boolean }) => {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载主题中'
      })
      const { data }: { data: { data: Array<Partial<Theme>> } } = await getAllTheme()
      if (payload?.needNull)
        data.data.unshift({
          themeId: 0,
          topic: '暂不选择主题'
        })
      commit('setThemeList', data.data)
      console.log(data)
      Toast.clear()
      return data.data
    },
    setSelectedThemeDetail: async (context, payload: string) => {
      const res = await getThemeDetail(payload)
      console.log(res);
      if (!res.data.data) {
        // console.log('没有该主题的详情');
        throw new Error("没有该主题的详情");
      }
      context.state.selectedThemeDetail = res.data?.data
      return res.data?.data
    }
  }
}
export default selectData;