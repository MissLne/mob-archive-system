<template>
  <div id="description">
    <SideBar :sideBarShow="sideBarShow" />
    <Alerts
      :title="'确认删除'"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <des-head
      :headData="headData"
      :popArr="popArr"
      @handleClick="handleClick($event)"
    >著录中</des-head>
    <DesSearch
      :searchText="searchText"
      @searchThings="searchThings($event)"
      :isDate="false"
    />
    <myTool
      :count="count"
      :listData="listData"
      @selectHandle="selectHandle($event)"
    />
    <div class="slots"></div>
    <div v-for="(item, index) in desItem" :key="index" class="box">
      <DesItem v-if="desItem" :desItem="item" typeName="著录中" />
      <img
        class="manySelect"
        :src="checkList[index] ? seletList[1] : seletList[0]"
        v-show="isShow"
        @click="checkItem(index)"
      />
    </div>
    <DesBtn
      @changePage="changePage($event)"
      :totalPage="pageData"
      :pageCur="pageCur"
      :pageTo="pageTo"
      v-if="pageData.total"
      ref="desBtnvue"
    />
    <div class="slots2"></div>
    <img
      v-show="!sideBarShow"
      :src="isShow? btnUrl[1] : btnUrl[0]"
      class="upload"
      @click="toAddPage(isShow)"
    />
    <!-- <transition name="delete-cancel">
      <div class="select-btn" v-if="isShow">
        <div @click="cancelSelect">返回</div>
        <div @click="alertShow = true">删除</div>
      </div>
    </transition> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";
import myTool from "@/components/des-com/index/myTool.vue";
import DesItem from "@/components/des-com/index/des-item.vue";
import DesBtn from "@/components/des-com/index/des-btn.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import SideBar from "@/components/public-com/SideBar.vue";
import { getSrcCertainly } from "@/utils/picture";
import store from "@/store";
import { getPartDossierList } from "@/services/dossier";

interface dataType {
  size: number | undefined;
  current: number | undefined;
  type: number;
  retentionPeriod?: number;
  status: number;
  topic?: Array<string>;
}

type CheckItem = {
  id: number;
  show: boolean;
};

type Id = {
  id: number;
  type: number;
};

interface Item {
  title: string;
  list: any[];
}
@Component({
  components: {
    DesHead,
    DesSearch,
    myTool,
    DesItem,
    DesBtn,
    Alerts,
    SideBar,
  },
})
export default class Description extends Vue {
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  private btnUrl = [require("@/assets/button/upload.png"),require("@/assets/button/delete.png")]
  public listData: Item = {
    title: "显示全部",
    list: ["显示全部", "显示案卷", "显示文件"],
  };
  public sideBarShow: boolean = false;
  private alertShow: boolean = false;
  private checkList: Array<boolean> = [];
  private idList: Array<Id> = [];
  private isShow: boolean = false;
  private searchText: string = "请输入题名搜索";
  private desItem: [] = [];
  public popArr: string[] = ["案卷详情", "选择"];
  public count: number = 0;
  private _this: any = "";
  public headData: any = {
    leftUrl: "3",
    rightUrl: "",
    leftPic: true,
    rightPic: false,
    leftText: "",
    rightText: "选择",
    isShow: false,
  };
  public pageData: any = {
    current: 1,
    total: 0,
  };
  public pageCur: number = 1
  public pageTo: number = 0
  public getListData: dataType = {
    size: 10,
    current: 1,
    type: 2,
    // retentionPeriod: 1,
    status: 0,
    topic: [],
  };
  toAddPage(addOrdel: boolean) {
    if(addOrdel) {
      this.alertShow = true
    } else {
      this.$router.push({ name: 'tempArchUpload' })
    }
  }
  beforeRouteEnter(to: any, from: any, next: any) {
    if (!store.state.isDetailPage) {
      next((vm: any) => {
        vm.doSth(vm);
      });
    } else {
      next();
    }
  }
  doSth(vm: any) {
    vm.searchText = "请输入题名搜索";
    vm.getListData.type = 0;
    vm.getListData.current = 1;
    vm.pageData.current = 1;

    vm.getList();
  }
  selectHandle(event: any) {
    this.getListData.type = event.index == 0 ? 2 : event.index - 1;
    this.getListData.current = 1;
    this.pageData.current = 1;
    this.pageCur = 1
    // this.listData.title = this.listData.list[event.index];
    // (this as any).$localStore.setData("desListData",this.getListData);
    // (this as any).$localStore.setData("desData",this.listData.title);
    this.getList();
    this.$nextTick(() => {
      window.scrollTo(0, 0);
    });
  }
  initSelect(type: boolean) {
    this.checkList.forEach((value, index) => {
      this.$set(this.checkList, index, type);
    });
  }
  // scrollToTop() {
  //   const that = this;
  //   let scrollTop =
  //     window.pageYOffset ||
  //     document.documentElement.scrollTop ||
  //     document.body.scrollTop;
  //   that.scrollToTop = scrollTop;
  // }
  searchThings(event: any) {
    let res = [event.searchVal];
    this.getListData.current = 1;
    this.pageCur = 1
    this.getListData.topic = res;
    this.getList();
    console.log(event);
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "right") {
      if (this.headData.rightText === "选择") {
        this.initSelect(false);
        this.isShow = true;
        obj = {
          leftPic: false,
          leftText: "返回",
          rightText: "全选",
        };
        this.headData = Object.assign(this.headData, obj);
        return;
      }
       if(this.headData.rightText === "全选") {
        this.initSelect(true);
        this.headData.rightText =  "取消"
      } else if(this.headData.rightText === "取消"){
        this.initSelect(false);
        this.headData.rightText =  "全选"
      }
    } else {
      if (this.headData.leftText === "返回") {
        this.cancelSelect()
        return;
      }

      if (this.headData.leftUrl == "4") {
        obj = {
          leftUrl: "3",
          leftPic: true,
          rightText: "选择",
        };
        this.headData = Object.assign(this.headData, obj);
        this.sideBarShow = false;
      } else if (this.headData.leftUrl == "3") {
        obj = {
          leftUrl: "4",
          leftPic: true,
          rightText: "",
        };
        this.headData = Object.assign(this.headData, obj);
        this.sideBarShow = true;
      }
    }
  }
  cancelSelect() {
    this.isShow = false;

    let obj = {
      leftPic: true,
      rightPic: false,
      rightText: "选择",
      leftText: "",
    };
    this.headData = Object.assign(this.headData, obj);
  }
  checkItem(index: number) {
    this.$set(this.checkList, index, !this.checkList[index]);
    this.checkList.forEach((item) => {
      if(!item) this.headData.rightText =  "全选"
    })
  }
  async getList() {
    const { data } = await getPartDossierList({ ...this.getListData });
    let result = data.data.records;
    if (data.data.records.length == 0) {
      MsgBox.error("内容为空");
    }
    console.log(result);
    this.idList = [];
    // 初始化 选择状态数组
    this.checkList = new Array(result.length).fill(false);
    for (let i = 0; i < result.length; i++) {
      this.idList.push({ id: result[i].id, type: result[i].type });
    }
    this.count = data.data.total;
    this.pageData.total = Math.ceil(this.count / 10);
    this.pageTo = Math.ceil(this.count / 10);

    result.forEach(async (item: any) => {
      if (item.fileType)
        item.fileToken = await getSrcCertainly(item.fileType, item.fileToken, true)
    });
    this.desItem = result;
  }
  changePage(event: any): void {
    if (event && this.getListData.current) {
      if (event.type === "prePage" && this.getListData.current > 1) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current--;
        this.pageData.current--;
        this.pageCur--
        this.getList();
        // (this as any).$localStore.setData("desListData",this.getListData)
      } else if (
        event.type === "nextPage" &&
        this.pageData.current < this.pageData.total &&
        this.pageCur < this.pageTo
      ) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current++;
        this.pageData.current++;
        this.pageCur++
        // (this as any).$localStore.setData("desListData",this.getListData)
        this.getList();
      } else {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current = event.page;
        this.pageData.current = event.page;
        this.pageCur = event.page
        this.getList();
      }
    }
  }
  deleteItem() {
    let desId: Array<number> = [];
    let fileId: Array<number> = [];
    this.checkList.map((item, index) => {
      if (item) {
        switch (this.idList[index].type) {
          case 0:
            desId.push(this.idList[index].id);
            break;
          case 1:
            fileId.push(this.idList[index].id);
          default:
            break;
        }
      }
    });
    return { desId, fileId };
  }
  sureDelete(event: any) {
    let { desId, fileId } = this.deleteItem();

    if (event.type === "not") {
      this.alertShow = false;
    } else {
      this.alertShow = false;
      if (desId.length) {
        this.$request
          .post("/api/api/dossier/userDeleteDossier", { ids: [...desId] })
          .then((res: any) => {
            if (res.data.success === true) {
              MsgBox.success("删除成功");
              this.cancelSelect();
              this.getList();
              return;
            }
            throw new Error();
          })
          .catch((err: any) => {
            this.cancelSelect();
            MsgBox.error("删除失败");
          });
      } else if (fileId.length) {
        this.$request
          .post("/api/api/archive/userDeleteArchive", { ids: fileId })
          .then((res: any) => {
            if (res.data.success === true) {
              if (!desId.length) MsgBox.success("删除成功");
              this.cancelSelect();
              this.getList();
              return;
            }
            throw new Error();
          })
          .catch((err: any) => {
            this.cancelSelect();
            MsgBox.error("删除失败");
          });
      }
    }
  }
  created() {
    // if(!(this as any).$localStore.getData("desListData") && (this as any).$localStore.getData("desListData").length != 0) {
    //   this.getListData = (this as any).$localStore.getData("desListData")
    //   this.pageData.current = this.getListData.current
    // }
    // if((this as any).$localStore.getData("desData") != "" || (this as any).$localStore.getData("desData").length != 0) {
    //   this.listData.title = (this as any).$localStore.getData("desData")
    // }
    this.getList();
  }
  deactivated() {
    this.sideBarShow = false;
  }
}
</script>
<style lang="scss">
#description {
  .delete-cancel-enter-active {
    // transition: 0.8s;
    animation: enters 1s;
  }
  .delete-cancel-leave-active {
    // transition: 0.8s;
    animation: leves 0.7s;
  }
  @keyframes leves {
    0% {
      bottom: 100px;
    }
    100% {
      bottom: -100px;
    }
  }
  @keyframes enters {
    0% {
      bottom: -100px;
    }
    100% {
      bottom: 100px;
    }
  }
  .slots {
    height: 295px;
  }
  .slots2 {
    height: 90px;
  }
  .box {
    margin: 0 auto;
    width: 690px;
    height: 267px;
    position: relative;
    .manySelect {
      width: 47px;
      height: 47px;
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  width: 100vw;
  min-height: calc(100vh);
  background: #e9f1fe;
  .upload {
    width: 82px;
    height: 82px;
    position: fixed;
    right: 30px;
    bottom: 100px;
    z-index: 99;
  }
  // .select-btn {
  //   width: 519px;
  //   z-index: 999;
  //   position: fixed;
  //   transform: translateX(-50%);
  //   bottom: 100px;
  //   left: 50%;
  //   display: flex;
  //   justify-content: space-between;
  //   > div:nth-of-type(1),
  //   > div:nth-of-type(2) {
  //     width: 162px;
  //     height: 75px;
  //     box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
  //     border-radius: 8px;
  //     font-size: 42px;
  //     text-align: center;
  //     line-height: 75px;
  //   }
  //   > div:nth-of-type(1) {
  //     color: #ffffff;
  //     background: #85b8fd;
  //   }
  //   > div:nth-of-type(2) {
  //     color: #ff0000;
  //     background: #fff;
  //   }
  // }
}
</style>
