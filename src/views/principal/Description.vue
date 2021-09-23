<template>
  <div id="description">
    <DesHead />
    <DesSearch />
    <myTool />
    <div v-for="(item, index) in desItem" :key="index">
      <DesItem v-if="desItem" :desItem="item" />
    </div>
    <DesBtn @changePage="changePage($event)" />
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
  public pageData: any = {
    current: 1,
    total: 0
  }
  public getListData: dataType = {
    size: 10,
    current: 1,
    type: 2,
    retentionPeriod: 1,
    status: 0,
  };
  getList(): void {
    (this as any).$request
      .post("/api/api/dossier/getPartDossierList", this.getListData)
      .then((res: any) => {
        let result = res.data.data.records;
        result.map((item: any, index: number) => {
          if (item.hasOwnProperty("fileToken")) {
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
      if (event.type === "prePage" && this.getListData.current >= 1) {
        this.getListData.current--
        this.getList()
      } else if(event.type === "nextPage") {
        this.getListData.current++
        this.getList()
      } else {
        return
      }
    }
  }
  created() {
    (this as any).$request.post("/api/api/user/login",{
      account: "12345678",
      password: "123"
    })
    .then((res: any) => {
      localStorage.setItem('token',res.data.data.token)
      localStorage.setItem('username',res.data.data.user.name)
      localStorage.setItem('departmentId',res.data.data.user.departmentId)
    })
    this.getList();
  }
}
</script>
<style lang="scss">
</style>
