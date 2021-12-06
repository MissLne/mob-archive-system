import { Module } from "vuex";

const selectData: Module<any, any> = {
  namespaced: true,
  state: {
    _fondsIdentifier: [],
    _dossierType: [],
    _departmentNameTree: [],
    confidentialLevelArray: [
      {name: '公开', id: 0},
      {name: '内部', id: 1},
      {name: '绝密', id: 2},
      {name: '机密', id: 3},
      {name: '秘密', id: 4}
    ],
    retentionPeriodArray: ['永久', '30年', '10年'],
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
  },
}
export default selectData;