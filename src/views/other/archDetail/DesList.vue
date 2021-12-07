<template>
  <div id="my-des">
    <div>
      <Alerts
        :title="'确认删除'"
        v-if="alertShow"
        @sureDelete="sureDelete($event)"
      />
      <div v-for="(item, index) in desItem" :key="index" class="box">
        <DesItem v-if="desItem" :desItem="item" />
        <img
          class="manySelect"
          :src="checkList[index] ? seletList[1] : seletList[0]"
          v-show="isChecking"
          @click="checkItem(index)"
        />
      </div>
      <DesBtn
        @changePage="changePage($event)"
        :totalPage="pageData"
        v-if="pageData.total"
      />
      <div class="slots2"></div>
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
import { downloadPic } from "@/utils/utils-file";

interface dataType {
  size: number | undefined;
  current: number | undefined;
}

type CheckItem = {
  id: number;
  show: boolean;
};
@Component({
  name: 'DesList',
  components: {
    DesItem,
    DesBtn,
    Alerts,
  },
})
export default class DesList extends Vue {
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  private alertShow: boolean = false;
  private checkList: Array<boolean> = [];
  private idList: Array<number> = [];
  private isChecking: boolean = false;
  private desItem: [] = [];
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
      this.$store.commit("setDetailPage")
      this.$router.go(-1);
    }
  }
  cancelSelect() {
    this.isChecking = false;
  }
  checkItem(index: number) {
    this.$set(this.checkList, index, !this.checkList[index]);
  }
  getList(): void {
    (this as any).$request
      .get("/api/api/archive/getArchiveList", {
        ...this.getListData,
        id: this.$route.params.id,
      })
      .then((res: any) => {
        let result = res.data.data.records;
        this.checkList = new Array(result.length).fill(false);
        for (let i = 0; i < result.length; i++) {
          this.idList.push(result[i].id);
        }
        this.count = res.data.data.total;
        this.pageData.total = Math.ceil(this.count / 10);

        result.map((item: any, index: number) => {
          if (item.hasOwnProperty("fileToken") && item.fileToken !== null) {
            downloadPic(item.fileToken, item.fileType)
              .then((res: any) => item.fileToken = res)
          }
        });
        this.desItem = result;
      });
  }
  changePage(event: any): void {
    if (event && this.getListData.current) {
      if (event.type === "prePage" && this.getListData.current > 1) {
        this.getListData.current--;
        this.pageData.current--;
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getList();
      } else if (
        event.type === "nextPage" &&
        this.pageData.current < this.pageData.total
      ) {
        this.getListData.current++;
        this.pageData.current++;
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getList();
      } else {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.getListData.current = event.page;
        this.pageData.current = event.page;
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
  created() {
    this.getList();
  }
}
</script>
<style lang="scss">
#my-des {
  .slots {
    height: 124px;
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

