<template>
  <div id="description">
    <DesHead />
    <DesSearch />
    <myTool />
    <img :src="url" alt="">
    <div></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DesHead from "@/components/des-com/des-head.vue";
import DesSearch from "@/components/des-com/des-search.vue";
import myTool from "@/components/des-com/myTool.vue";
import axios from "axios";

@Component({
  components: {
    DesHead,
    DesSearch,
    myTool,
  },
})
export default class Description extends Vue {
  private url: any = ""
  created() {
    // (this as any).$request.post("/api/api/user/login",{
    //   account: "12345678",
    //   password: "123"
    // })
    // .then((res: any) => {
    //   localStorage.setItem('token',res.data.data.token)

    // })
    (this as any).$request
      .post("/api/api/dossier/getPartDossierList", {
        type: 1,
        retentionPeriod: 1,
        status: 0,
      })
      .then((res: any) => {
        console.log(res.data.data.records[0].fileToken);
        // (this as any).urll = `https://test-archive.server.topviewclub.cn/api/${res.data.data.records[0].fileToken}`;

        (this as any).$service
          .get(`/api/api/file/download/${res.data.data.records[0].fileToken}`,{
            responseType: 'arraybuffer',
          })
          .then((data: any) => {
             (this as any).url = 'data:image/png;base64,' + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
             console.log((this as any).url);
             
            // (this as any).urll = imgUrl
          });
      });
  }
}
</script>
<style lang="scss">
 img {
   width: 500px;
   height: 500px;
 }
</style>
