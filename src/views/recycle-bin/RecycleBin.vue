<template>
  <div id="recycle-bin">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div>
    <!-- 头部的下拉菜单 -->
    <Selects :listData="listData" class="header-selects" @handleClickS="selectsClick"/>
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
        @leftClick="restoreFile"
        @rightClick="deleteFile"
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
import { downloadPic } from '@/utils/utils-file';
import CoupleBtns from '@/components/public-com/Btn/CoupleBtns.vue';

@Component({
  components: {
    DesHead,
    DesItem,
    DesBtn,
    Selects,
    CoupleBtns
  }
})
export default class extends Vue {
  private headData: any = {
    title: '回收站',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: true,
    rightUrl: 2,
    rightText: "",
    isShow: false,
  }
  private readonly listData: any = {
    title: '',
    list: [ '清空回收站', '选择' ]
  }
  private records: Array<any> = [];
  private pages: number = 0;
  private currentPage: number = 1;
  private isChecking: boolean = false;
  private checkList: Array<boolean> = [];
  created() {
    this.getPageData(this.currentPage)     
  }
  async getPageData(current: number) {
    try {
      const {data} = await this.$service.post('/api/api/dossier/getPartDossierList', {
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
        value.fileToken = await downloadPic(value.fileToken, value.fileType)
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
  goPage({type}: {type: string}) {
    let newPages;
    if (type === 'prePage')
      newPages = this.currentPage - 1;
    else
      newPages = this.currentPage + 1;
    if (newPages < 1 || newPages > this.pages) return;
    this.getPageData(newPages)
  }
  restoreFile() {

  }
  deleteFile() {
    
  }
  
  private headClick({clickType}: any) {
    if (clickType === 'left') {
      if (this.isChecking)
        this.isChecking = false;
      else
        this.$router.go(-1)
    }
    else {
      this.headData.rightUrl === 2 ? this.headData.rightUrl = 4 : this.headData.rightUrl = 2;
    }
  }
  private selectsClick({num: index}: {num: number}) {
    if (index === 1) this.isChecking = !this.isChecking;
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
      z-index: 100;
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