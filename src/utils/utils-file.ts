/**
 * 递归地从树上寻找：具有名为keyName的键，且值等于keyValue的对象。并获取其名为idName的键对应的值。
 * @param tree 要搜索的树（孩子名为children）
 * @param keyValue 索引键值
 * @param keyName 索引键名
 * @param idName 搜索键值的键名
 * @param treeChildrenName 树的孩子名，默认为children
 * @returns 数字，找不到为undefined
 */
export function recursionGetId(tree: Array<any>, keyValue: string, keyName: string, idName: string, treeChildrenName: string = 'children') {
    // console.log(tree, keyValue, keyName, idName)
    let ans: any = undefined;
    if (tree)
      for (let i = 0; i < tree.length; ++i) {
        const child = tree[i];
        if (child[keyName] === keyValue) {
          ans = child[idName];
          // console.log(ans)
          break;
        }
        else {
          ans = recursionGetId(child[treeChildrenName], keyValue, keyName, idName);
          if (ans) break;
        }
      }
    return ans;
}

export function debonce(fn: Function, delay: number) {
    let timer: any;
    return function(this: any, ...args: Array<any>) {
      const _this = this;
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(fn.bind(this, args), delay);
    }
}

/**
 * 针对ArchDetail页的填内容函数
 * @param detailData 后台返回数据
 * @param inputsProps 要填数据的对象
 */
export function fillArchDetail(detailData: any, inputsProps: any) {
  // getArchiveDetail
  inputsProps.topic.value = detailData.topic;
  inputsProps.people.value = detailData.people;
  inputsProps.time.value = detailData.time?.split('T')[0];
  inputsProps.place.value = detailData.address;
  inputsProps.event.value = detailData.event;
  inputsProps.fondsIdentifierId.value = detailData.fondsName;
  inputsProps.categoryCodeId.value = detailData.categoryName;
  inputsProps.departmentId.value = detailData.departmentName;
  inputsProps.confidentialLevel.value = detailData.confidentialLevel;
  inputsProps.retentionPeriod.value = detailData.retentionPeriod;
}

/**
 * 递归遍历元数据树
 * @param tree 元数据树
 * @param handle 经过节点时遍历的函数
 */
export function dfsTree(tree: any, handle: (obj: MetaDataItem) => void) {
  if (!tree) return;
  for (let obj of tree) {
    handle(obj);
    if (obj.child)
      dfsTree(obj.child, handle);
  }
}

/**
 * 初始化元数据
 * @param _this 组件中的this 
 */
export function initMetaData(_this: any, propMetaDataName: string ) {
  const dData = _this.detailData;
  _this.$store.commit('metaData/setMetaDataTree', {
    metaData: ((dData as any)[propMetaDataName] as Array<MetaDataItem>)
      .filter(value => {
        const name = value.metadataName;
        return name !== '人物'
          && name !== '时间'
          && name !== '地点'
          && name !== '事件'
      }),
    fileType: (dData as any).fileType.split('/')[0],
  });
}