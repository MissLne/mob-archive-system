<template>
  <div id="recycle-bin">
    <des-head :headData="headData" @handleClick="headClick">回收站</des-head>
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
    <DesBtn
      :totalPage="{total: pages, current: currentPage}"
      @changePage="goPage"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue'
import DesItem from '@/components/des-com/index/des-item.vue'
import DesBtn from '@/components/des-com/index/des-btn.vue'
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
    DesBtn,
    Selects,
    CoupleBtns
  }
})
export default class RecycleBin extends Vue {
  private headData: any = {
    rightPic: true,
    rightUrl: 2,
    rightText: '全选',
    isShow: false,
  }
  private readonly listData: any = {
    title: '',
    list: [ '清空回收站', '选择' ]
  }
  private records: Array<any> = [];
  private pages: number = 0;
  private currentPage: number = 1;
  private checkList: Array<boolean> = [];
  private isChecking_: boolean = false;
  get isChecking(): boolean  {
    return this.isChecking_;
  }
  set isChecking(newValue: boolean) {
    console.log('set!')
    // 如果要变为选择
    if (newValue) {
      this.isChecking_ = true;
      this.headData.rightPic = false;
    }
    else {
      this.isChecking_ = false;
      this.headData.rightPic = true;
    }
  }
  get checkIds() {
    // 这样写好像高级一点，不过性能好像比较差，需要遍历两遍
    /* return this.records.map(value => value.id)
      .filter((value, index) => this.checkList[index]); */
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
  
  created() {
    this.getPageData(this.currentPage)     
  }
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
      this.pages = data.data.pages;
      this.checkList = new Array(this.records.length).fill(false);

      for (const value of this.records) {
        value.fileToken = await getSrcCertainly(value.fileType, value.fileToken)
      }
      this.currentPage = current
      // 用forEach的话大的catch捕获不了
      /* this.pageData.records.forEach(async (value: any) => {
        value.fileToken = await downloadPic(value.fileToken, value.fileType)
      }) */
    } catch (error) {
      Msg.error('加载失败')
    }
  }
  // 点击翻页按钮时执行的函数
  goPage({type}: {type: string}) {
    let newPages;
    if (type === 'prePage')
      newPages = this.currentPage - 1;
    else
      newPages = this.currentPage + 1;
    if (newPages < 1 || newPages > this.pages) return;
    this.getPageData(newPages)
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
  
  private headClick({clickType}: any) {
    if (clickType === 'left') {
      if (this.isChecking)
        this.isChecking = false;
      else
        this.$router.go(-1)
    }
    else {
      if (this.isChecking) {
        this.checkAll();
      }
      else if (this.headData.rightUrl === 2) {
        this.headData.rightUrl = 4;
        (this.$refs['headerSelects'] as Selects).isShowList = true;
      }
      else {
        this.headData.rightUrl = 2;
        (this.$refs['headerSelects'] as Selects).isShowList = false;
      }
    }
  }
  private selectsClick({num: index}: {num: number}) {
    this.headData.rightUrl = 2;
    if (index === 1)
      this.isChecking = !this.isChecking;
    else 
      this.checkOperation('清空回收站', 'emptyRecycleBin', true, '确认清空回收站？该操作不可逆')
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