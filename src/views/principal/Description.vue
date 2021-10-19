<template>
  <div id="description">
    <SideBar :sideBarShow="sideBarShow"/>
    <Alerts
      :title="'确认删除'"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <DesHead
      :headData="headData"
      :popArr="popArr"
      @handleClick="handleClick($event)"
    />
    <DesSearch :searchText="searchText" @searchThings="searchThings($event)" :isDate="false"/>
    <myTool :count="count" :listData="listData" @selectHandle="selectHandle($event)" />
    <div class="slots"></div>
    <div v-for="(item, index) in desItem" :key="index" class="box">
      <DesItem v-if="desItem" :desItem="item" typeName="著录中"/>
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
      v-if="pageData.total"
    />
    <div class="slots2"></div>
    <img src="@/assets/index/upload.png" class="upload" v-if="!isShow && !sideBarShow" />
    <div class="select-btn" v-if="isShow">
      <div @click="cancelSelect">返回</div>
      <div @click="alertShow = true">删除</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";
import myTool from "@/components/des-com/index/myTool.vue";
import DesItem from "@/components/des-com/index/des-item.vue";
import DesBtn from "@/components/des-com/index/des-btn.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import SideBar from "@/components/public-com/SideBar.vue"

interface dataType {
  size: number | undefined;
  current: number | undefined;
  type: number;
  retentionPeriod: number;
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
    SideBar
  },
})
export default class Description extends Vue {
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  public listData: Item = {
    title: "显示全部",
    list: ["显示案卷","显示文件"]
  }
  public sideBarShow: boolean = false
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
    title: "著录中",
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
  public getListData: dataType = {
    size: 10,
    current: 1,
    type: 2,
    retentionPeriod: 1,
    status: 0,
    topic: [],
  };
  selectHandle(event: any) {
    this.getListData.type = event.index;
    this.getListData.current = 1
    // this.listData.title = this.listData.list[event.index];
    // (this as any).$localStore.setData("desListData",this.getListData);
    // (this as any).$localStore.setData("desData",this.listData.title);
    this.getList();
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
          leftText: "取消",
          rightText: "全选",
        };
        this.headData = Object.assign(this.headData, obj);
        return;
      }
      this.initSelect(true);
    } else {
      if (this.headData.leftText === "取消") {
        this.initSelect(false);
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
      } else if(this.headData.leftUrl == "3"){
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
  }
  getList(): void {
    (this as any).$request
      .post("/api/api/dossier/getPartDossierList", { ...this.getListData })
      .then((res: any) => {
        let result = res.data.data.records;
        if(res.data.data.records.length == 0) {
          MsgBox.error("内容为空")
        }
        console.log(result);
        this.idList = [];
        this.checkList = new Array(result.length).fill(false);
        for (let i = 0; i < result.length; i++) {
          this.idList.push({ id: result[i].id, type: result[i].type });
        }
        this.count = res.data.data.total;
        this.pageData.total = Math.ceil(this.count / 10);
        result.map((item: any, index: number) => {
          if (item.hasOwnProperty("fileToken") && item.fileToken !== null) {
            (this as any).$service
              .get(`/api/api/file/download/${item.fileToken}`, {
                responseType: "arraybuffer",
              })
              .then((data: any) => {
                item.fileToken =
                  "data:image/png;base64," +
                  btoa(
                    new Uint8Array(data.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  );
              });
          }
        });
        this.desItem = result;
      });
  }
  changePage(event: any): void {
    if (event && this.getListData.current) {
      if (event.type === "prePage" && this.getListData.current > 1) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current--;
        this.pageData.current--;
        this.getList();
        // (this as any).$localStore.setData("desListData",this.getListData)
      } else if (
        event.type === "nextPage" &&
        this.pageData.current < this.pageData.total
      ) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current++;
        this.pageData.current++;
        // (this as any).$localStore.setData("desListData",this.getListData)
        this.getList();
      } else {
        return;
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
}
</script>
<style lang="scss">
#description {
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
  .select-btn {
    width: 519px;
    z-index: 999;
    position: fixed;
    transform: translateX(-50%);
    bottom: 100px;
    left: 50%;
    display: flex;
    justify-content: space-between;
    > div:nth-of-type(1),
    > div:nth-of-type(2) {
      width: 162px;
      height: 75px;
      box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
      border-radius: 8px;
      font-size: 42px;
      text-align: center;
      line-height: 75px;
    }
    > div:nth-of-type(1) {
      color: #ffffff;
      background: #85b8fd;
    }
    > div:nth-of-type(2) {
      color: #ff0000;
      background: #fff;
    }
  }
}
</style>
