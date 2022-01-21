<template>
  <div id="recycle-bin">
    <des-head @handleClick="headClick">
      回收站
      <template #right="{pics}">
        <div v-if="isChecking">全选</div>
        <img v-else :src="isShowList ? pics[4] : pics[2]">
      </template>
    </des-head>
    <div class="slots"></div>
    <!-- 头部的下拉菜单 -->
    <Selects
      ref="headerSelects"
      :listData="listData"
      class="header-selects"
      @handleClickS="selectsClick"
    />
    <!-- 文件列表 -->
    <ul class="item-list">
      <li
        v-for="(item, index) in records"
        :key="item.id"
        class="item"
      >
        <DesItem :desItem="item" :typeName="'回收站'"/>
        <transition name="van-fade">
          <i
            v-show="isChecking"
            :class="{checked: checkList[index]}"
            class="check-box"
            @click="$set(checkList, index, !checkList[index])"
          >✓</i>
        </transition>
      </li>
    </ul>
    <!-- 选择时弹出的功能选择按钮 -->
    <transition name="btns-move">
      <CoupleBtns
        v-show="isChecking"
        class="btns-box"
        :colorReversal="true"
        :leftName="'还原'"
        :rightName="'删除'"
        @leftClick="checkOperation('还原', 'RestoreArchive')"
        @rightClick="checkOperation('删除', 'DestroyArchive')"
      />
    </transition>
    <!-- 翻页按钮 -->
    <PageBtn
      :pageTotal="pageTotal"
      :pageCur="pageCur"
      @changePage="changePage"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue'
import DesItem from '@/components/des-com/index/des-item.vue'
import PageBtn from "@/components/public-com/PageBtn.vue";
import Selects from '@/components/tools/selects.vue';
import Msg from '@/components/public-com/MsgBox/Msg';
import { getSrcCertainly } from '@/utils/picture';
import PermissionRequest from '@/utils/utils-request'
import CoupleBtns from '@/components/public-com/Btn/CoupleBtns.vue';
import { Dialog } from 'vant';
import { getPartDossierList } from '@/services/dossier';

@Component({
  components: {
    DesHead,
    DesItem,
    PageBtn,
    Selects,
    CoupleBtns
  }
})
export default class RecycleBin extends Vue {
// 翻页相关
  private pageTotal: number = 0;
  private pageCur: number = 1;
  changePage(page: number) {
    this.getPageData(page)
  }


// 选择、获取数据相关
  // 数据列表
  private records: Array<any> = [];
  // 表示*某个index是否选择*的数组
  private checkList: Array<boolean> = [];
  // 是否正在选择
  private isChecking: boolean = false;
  // 已经选择的id
  get checkIds() {
    const temp = [];
    for(const key in this.records)
      if (this.checkList[key]) temp.push(this.records[key].id)
    return temp;
  }
  // 点击全选时执行的函数
  checkAll() {
    if (this.checkList.includes(false))
      this.checkList.forEach((value, index) =>
        this.$set(this.checkList, index, true))
    else
      this.checkList.forEach((value, index) =>
        this.$set(this.checkList, index, false))
  }
  // 获取数据函数
  async getPageData(current: number) {
    try {
      
      const { data } = await getPartDossierList({
        current,
        size: 10,
        status: 4,
        type: 2,
      })
      if (data.code !== 200) throw Error();
      this.records = data.data.records
      this.pageTotal = data.data.pages;
      this.checkList = new Array(this.records.length).fill(false);

      for (const value of this.records) {
        value.fileToken = await getSrcCertainly(value.fileType, value.fileToken)
      }
      this.pageCur = current
      // 用forEach的话大的catch捕获不了
      /* this.pageData.records.forEach(async (value: any) => {
        value.fileToken = await downloadPic(value.fileToken, value.fileType)
      }) */
    } catch (error) {
      Msg.error('加载失败')
    }
  }
  // 创建时获取数据
  created() {
    this.getPageData(this.pageCur)
  }


  /**
   * 本页面的三种操作
   * @param {string} chineseName 中文名
   * @param {string} englishName 英文名
   * @param {boolean} emptyRecycleBin 该操作是否为清空回收站
   * @param {string} message 提示信息，可以为空
   */
  async checkOperation(chineseName: string, englishName: string, emptyRecycleBin: boolean = false, message?: string) {
    try {
      if (!emptyRecycleBin && this.checkIds.length === 0) {
        Msg.error('请至少选择一个项目')
        return;
      }
      // 确认窗口
      await Dialog.confirm({
        title: message || `确认${chineseName}吗？`
      })
      // 请求
      let data;
      if (!emptyRecycleBin)
        ({data} = await PermissionRequest.post(englishName, '/api/api/archive/', {
          ids: this.checkIds
        }));
      else
        ({data} = await PermissionRequest.get(englishName, '/api/api/archive/'));
      
      if (data.code !== 200) throw Error(data.message)
      this.getPageData(1);
      Msg.success(`${chineseName}成功`)
      this.isChecking = false;

    } catch (error: any) {
      console.log(error)
      if (error !== 'cancel')
        Msg.error(`${chineseName}失败`)
    }
  }


  // 下拉菜单相关
  // 下拉菜单的options
  private readonly listData: any = {
    title: '',
    list: [ '清空回收站', '选择' ]
  }
  // 是否显示下拉菜单
  private v_isShowList: boolean = false
  get isShowList() { return this.v_isShowList }
  set isShowList(newValue: any) {
    (this.$refs['headerSelects'] as Selects).isShowList = newValue
    this.v_isShowList = newValue
  }
  // 下拉菜单点击
  private selectsClick({num: index}: {num: number}) {
    if (index === 1)
      this.isChecking = !this.isChecking;
    else 
      this.checkOperation('清空回收站', 'emptyRecycleBin', true, '确认清空回收站？该操作不可逆')
  }


  // 头部点击
  private headClick({clickType}: any) {
    if (clickType === 'left') {
      if (this.isChecking)
        this.isChecking = this.isShowList = false
      else
        this.$router.go(-1)
    }
    else {
      if (this.isChecking)
        this.checkAll()
      else
        this.isShowList = !this.isShowList
    }
  }
}
</script>

<style lang="scss">
  #recycle-bin {
    padding-bottom: 1rem;
    .item-list {
      min-height: calc(100vh - 300px);
      .item {
        position: relative;
        .check-box {
          position: absolute;
          top: 20px;
          right: 50px;
          width: 47px;
          height: 47px;
          box-sizing: border-box;
          border: 4px solid #D1E5FE;
          color: #FFF;
          font-weight: 700;
          line-height: 43px;
          text-align: center;
          border-radius: 50%;
          transition: all 0.15s ease-out;
        }
        .checked {
          border-color: #89BCFE;
          color: #89BCFE;
        }
      }
    }
    .btns-box {
      position: fixed;
      left: 0;
      bottom: 29px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 115px;
    }
    @import '~@/assets/css/animation/btns-move.scss';
    .header-selects {
      z-index: 1;
      position: fixed;
      top: 124px;
      right: 0;
      transform: translateY(-100%);
      .title {
        opacity: 0;
      }
    }
  }
</style>