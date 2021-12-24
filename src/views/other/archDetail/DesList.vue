<template>
  <div id="des-list">
    <div>
      <Alerts
        :title="'确认删除'"
        v-if="alertShow"
        @sureDelete="sureDelete($event)"
      />
      <div class="trybox" ref="trybox">
        <div
          class="listContainer"
          ref="listContainer"
          @scroll.passive="scrollHandle"
          :style="{
            'padding-bottom': bottomPadding,
            'padding-top': topPadding,
          }"
        >
          <div v-for="(item, index) in renderItem" :key="index" class="box">
            <!-- <DesItem :desItem="item" :menuKey="menuKey" /> -->
            <div class="lueluel">{{ item.topic }}</div>
            <img
              class="manySelect"
              :src="checkList[index] ? seletList[1] : seletList[0]"
              v-show="isChecking"
              @click="checkItem(index)"
            />
          </div>
        </div>
      </div>
      <DesBtn
        @changePage="changePage($event)"
        :totalPage="pageData"
        v-if="pageTo"
        :pageCur="pageCur"
        :pageTo="pageTo"
        ref="desBtnvue"
      />
      <div class="roadUp" ref="roadUp"></div>
      <div class="select-btn" v-if="isChecking">
        <div @click="cancelSelect">取消</div>
        <div @click="alertShow = true">删除</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DesItem from "@/components/des-com/index/des-item.vue";
import DesBtn from "@/components/des-com/index/des-btn.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import { getArchiveList } from "@/services/archive";

interface dataType {
  size: number | undefined;
  current: number | undefined;
}
interface NumObj {
  itemSize: number
  itemHeight: number
  startIndex: number
  enabled: boolean
}

type CheckItem = {
  id: number;
  show: boolean;
};
@Component({
  name: "DesList",
  components: {
    DesItem,
    DesBtn,
    Alerts,
  },
})
export default class DesList extends Vue {
  public pageCur: number = 1;
  public pageTo: number = 0;
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  private alertShow: boolean = false;
  private checkList: Array<boolean> = [];
  private idList: Array<number> = [];
  private isChecking: boolean = false;
  private desItem: any[] = [];
  private renderItem: any = [];
  public count: number = 0;
  public pageData: any = {
    current: 1,
    total: 0,
  };
  public getListData: dataType = {
    size: 10,
    current: 1,
  };
  // selectHandle(event: any) {
  //   this.getListData.type = event.index;
  //   this.getList();
  // }
  initSelect(type: boolean) {
    this.checkList.forEach((value, index) => {
      this.$set(this.checkList, index, type);
    });
  }
  public handleClick(event: any) {
    if (event.clickType === "right") {
      if (this.$route.params.type === "我的档案" && event.isChoice) {
        MsgBox.error("无法操作已入库档案");
        return;
      }
      this.isChecking = true;
      this.initSelect(false);
    } else {
      this.$store.commit("setDetailPage");
      this.$router.go(-1);
    }
  }
  cancelSelect() {
    this.isChecking = false;
  }
  checkItem(index: number) {
    this.$set(this.checkList, index, !this.checkList[index]);
  }
  async getList() {
    const { data } = await getArchiveList({
      ...this.getListData,
      id: this.$route.params.id,
    });
    let result = data.data.records;
    // 初始化 选择状态数组
    this.checkList = new Array(result.length).fill(false);
    for (let i = 0; i < result.length; i++) {
      this.idList.push(result[i].id);
    }
    this.count = data.data.total;
    this.pageTo = Math.ceil(this.count / 10);
    console.log(result, "+_+++");

    this.desItem = result;
    for (let i = 0; i < result.length; i++) {
      this.$set(this.desItem, i, result[i]);
    }
    console.log(this.desItem, "ouooo");
    let arr = this.desItem.slice(0, this.endIndex());
    console.log(arr, "0--00");
    for (let i = 0; i < arr.length; i++) {
      this.$set(this.renderItem, i, arr[i]);
    }
  }
  changePage(event: any): void {
    (this.$refs.listContainer as any).scrollTop = 0;
    if (event && this.getListData.current) {
      if (event.type === "prePage" && this.getListData.current > 1) {
        this.getListData.current--;
        this.pageCur--;
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getList();
      } else if (event.type === "nextPage" && this.pageCur < this.pageTo) {
        this.getListData.current++;
        this.pageCur++;
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getList();
      } else {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current = event.page;
        this.pageCur = event.page;
        this.getList();
      }
    }
  }
  deleteItem() {
    let deleteId: Array<number> = [];
    this.checkList.map((item, index) => {
      if (item) deleteId.push(this.idList[index]);
    });
    return deleteId;
  }
  sureDelete(event: any) {
    if (event.type === "not") {
      this.alertShow = false;
    } else {
      this.alertShow = false;
      let list: Array<number> = this.deleteItem();
      console.log(list);
      this.$request
        .post("/api/api/archive/userDeleteArchive", { ids: list })
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
    }
  }

  private menuKey: number = 0;
  private topPadding: any = 0;
  private bottomPadding: any = 0;
  private vlistData: NumObj  = {
  itemSize: 0,
  itemHeight: 0,
  startIndex: 0,
  enabled: true
}
  scrollHandle() {
    let requetAnimationFrame = window.requestAnimationFrame;
    if (this.vlistData.enabled) {
      this.vlistData.enabled = false;
      requestAnimationFrame(this.dosTh);
      setTimeout(() => (this.vlistData.enabled = true), 50);
    }
  }
  dosTh() {
    this.menuKey++;
    this.vlistData.startIndex = Math.floor(
      (this.$refs.listContainer as any).scrollTop / this.vlistData.itemHeight
    );
    // console.log(this.startIndex + this.itemSize, this.desItem.length - 1);
    // if (this.startIndex + this.itemSize >= this.desItem.length - 1) {
    //   // console.log("dibu");
    // }
    let len = this.desItem.length || 1;
    // console.log(this.desItem[this.startIndex + this.itemSize],"-=--=-")
    let endIndex = this.desItem[this.vlistData.startIndex + this.vlistData.itemSize]
      ? this.vlistData.startIndex + this.vlistData.itemSize
      : len - 1;

    let arr = this.desItem.slice(this.vlistData.startIndex, endIndex);
    console.log(this.desItem.length, endIndex, arr, "=-==");
    // this.$nextTick(() => {
    this.topPadding = this.vlistData.startIndex * this.vlistData.itemHeight + "px";
    this.bottomPadding =
      (this.desItem.length - endIndex) * this.vlistData.itemHeight + "px";
    // });
    for (let item of arr) {
      console.log("arr:" + item.topic);
    }
    console.log("------------------", this.desItem);
    // for(let item of this.desItem) {
    //   console.log("arr:"+ item.topic)
    // }
    for (let i = 0; i < arr.length; i++) {
      this.$set(this.renderItem, i, arr[i]);
    }

    // console.log(this.renderItem, this.desItem);
  }
  endIndex() {
    let len = this.desItem.length || 1;
    return this.desItem[this.vlistData.startIndex + this.vlistData.itemSize]
      ? this.vlistData.startIndex + this.vlistData.itemSize
      : len - 1;
  }
  created() {}
  mounted() {
    this.getList();
    this.vlistData.itemHeight = (this.$refs.roadUp as any).offsetHeight;
    this.vlistData.itemSize =
      Math.floor(
        (this.$refs.listContainer as any).offsetHeight / this.vlistData.itemHeight
      ) + 2;
    this.bottomPadding = this.endIndex() * this.vlistData.itemHeight;
    this.renderItem = this.desItem.slice(this.vlistData.startIndex, this.endIndex());
  }
}
</script>
<style lang="scss">
#des-list {
  // background: #ff0000;
  .slots {
    height: 124px;
  }
  .slots2 {
    height: 90px;
  }
  .trybox {
    height: calc(100vh - 124px - 50px - 24px - 100px);
    overflow-y: hidden;
  }
  .listContainer {
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    padding-bottom: calc(var(--bottom) * 1px);
    // padding-bottom: 3000px;
    padding-top: calc(var(--top) * 1px);
    // overflow: hidden;
  }
  .roadUp {
    position: absolute;
    z-index: -100;
    height: 289px;
  }
  .lueluel {
    line-height: 289px;
    height: 289px;
    width: 80vw;
    border: 1px solid #85b8fd;
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

