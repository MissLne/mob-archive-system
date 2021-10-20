import { Module } from "vuex"
import { dfsTree } from "@/utils/fileUtils"

const metaData: Module<any, any> = {
  namespaced: true,
  state: {
    // 扁平的数据
    flatArr: [] as Array<MetaDataItem>,
    // 树状的数据
    tree: {} as MetaDataStruct,
  },
  mutations: {
    /**
     * 输入扁平状数据，设置树状数据
     * @param payload metaData和fileType
     */
    setMetaDataTree(state, payload: {metaData: any, fileType?: string}) {
      // 将扁平数据设置好
      state.flatArr = payload.metaData;
      // 将树状数据设置好
      const fullMetaDataTree: MetaDataStruct = JSON.parse(localStorage.getItem('struct') as string);
      if (payload.fileType)
        state.tree = {
          specialMetadataStruct: fullMetaDataTree.specialMetadataStruct,
          publicMetadataStruct: fullMetaDataTree.publicMetadataStruct,
          [`${payload.fileType}MetadataStruct`]: fullMetaDataTree[`${payload.fileType}MetadataStruct`],
        }
      else
          state.tree = { specialMetadataStruct: fullMetaDataTree.specialMetadataStruct }
      // 将获取的数据放入map
      const map: Map<number, string> = new Map()
      payload.metaData.forEach(({child, id, metadataValue}: MetaDataItem) => {
        if (child === null)
          map.set(id, metadataValue)
      })
      // 遍历一遍树，如果id相同就赋值
      let mapValue;
      for (let key in state.tree) {
        dfsTree(state.tree[key], (obj) => {
          mapValue = map.get(obj.id);
          if (mapValue) {
            if (obj.metadataName.slice(-2) === '时间')
              obj.metadataValue = mapValue.split('T')[0];
            else
              obj.metadataValue = mapValue;
          }
        })
      }
    },
    /**
     * 将树状数据转为扁平状数据（因为v-model直接修改了tree的值，所以不需要payload，好像不太符合vuex的规范）
     * 还进行了符合提交表单要求的处理
     */
    flatMetaTree(state) {
      const flatArr: Array<MetaDataItem> = [];
      for (let key in state.tree) {
        if (key !== 'specialMetadataStruct')
          dfsTree(state.tree[key], obj => {
            if (obj.metadataValue) {
              flatArr.push(obj)
            }
          })
      }
      state.flatArr = flatArr;
      console.log(flatArr)
    }
  },
  actions: {
  },
}

export default metaData