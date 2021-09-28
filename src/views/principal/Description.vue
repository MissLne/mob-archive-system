<template>
  <div id="description">
    <DesHead :headData="headData" :popArr="popArr" @handleClick="handleClick($event)" />
    <DesSearch />
    <myTool :count="count" @selectHandle="selectHandle($event)"/>
    <div class="slots"></div>
    <div v-for="(item, index) in desItem" :key="index" class="box">
      <DesItem v-if="desItem" :desItem="item" />
    </div>
    <DesBtn @changePage="changePage($event)" :totalPage="pageData" v-if="pageData.total"/>
    <div class="slots2"></div>
    <img src="@/assets/index/upload.png" class="upload"/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";
import myTool from "@/components/des-com/index/myTool.vue";
import DesItem from "@/components/des-com/index/des-item.vue";
import DesBtn from "@/components/des-com/index/des-btn.vue";

interface dataType {
  size: number | undefined;
  current: number | undefined;
  type: number;
  retentionPeriod: number;
  status: number;
}
@Component({
  components: {
    DesHead,
    DesSearch,
    myTool,
    DesItem,
    DesBtn,
  },
})
export default class Description extends Vue {
  private desItem: [] = [];
  public popArr: string[] = ["案卷详情","选择"]
  public count: number = 0
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
  };
  selectHandle(event: any) {
    this.getListData.type = event.index
    this.getList()
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "right") {
      if (this.headData.rightText === "选择") {
        obj = {
          leftPic: false,
          leftText: "取消",
          rightText: "全选",
        };
        this.headData = Object.assign(this.headData, obj);
        return;
      }
    } else {
      if (this.headData.leftText === "取消") {
        obj = {
          leftPic: true,
          rightPic: false,
          rightText: "选择",
          leftText: "",
        };
        this.headData = Object.assign(this.headData, obj);
        return;
      }

      if (this.headData.leftUrl == "4") {
        this.headData.leftUrl = "3";
      } else {
        this.headData.leftUrl = "4";
      }
    }
  }
  getList(): void {
    (this as any).$request
      .post("/api/api/dossier/getPartDossierList", {...this.getListData,keyWord: "qq"})
      .then((res: any) => {
        let result = res.data.data.records;
        this.pageData.total = this.count = res.data.data.total
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
        this.getListData.current--;
        this.pageData.current--
        this.getList();
      } else if (event.type === "nextPage" && this.pageData.current < Math.ceil(this.pageData.total/10)) {
        this.getListData.current++;
        this.pageData.current++
        this.getList();
      } else {
        return;
      }
    }
  }
  created() {
    (this as any).$request
      .post("/api/api/user/login", {
        account: "12345678",
        password: "123",
      })
      .then((res: any) => {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("username", res.data.data.user.name);
        localStorage.setItem("departmentId", res.data.data.user.departmentId);
      });
    this.getList();
  }
}
</script>
<style lang="scss">
#description {
  .slots {
    height: 271px;
  }
  .slots2 {
    height: 90px;
  }
  .box {
    width: 750px;
  }
  width: 100vw;
  min-height: calc(100vh);
  background: #E9F1FE;
  .upload {
    width: 82px;
    height: 82px;
    position: fixed;
    right: 30px;
    bottom: 100px;
    z-index: 99;
  }
}
</style>
