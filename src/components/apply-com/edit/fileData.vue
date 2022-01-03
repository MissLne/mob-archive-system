<template>
  <div id="fileData" v-if="flag && fileData.length"> 
    <!-- <div class="titles" v-if="fileData.length">可下载文件</div> -->
    <div class="bodyer">
      <div v-for="(item, index) in fileList" :key="index">
        <FileItem :fileItem="item" />
      </div>
    </div>
    <div class="footer">
      <DesBtn
        @changePage="changePage($event)"
        :totalPage="pageData"
        :pageCur="pageCur"
        :pageTo="pageTo"
        v-if="pageTo"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FileItem from "@/components/apply-com/edit/fileItem.vue";
import DesBtn from "@/components/des-com/index/des-btn.vue";
import { getSrcCertainly } from "@/utils/picture";

interface ObjItem {
  current: number;
  total: number;
}
@Component({
  components: {
    FileItem,
    DesBtn,
  },
})
export default class FileData extends Vue {
  @Prop({}) private fileDataId !: number
  private fileData!: any;
  public pageData: ObjItem = {
    current: 1,
    total: 0,
  };
  public pageCur: number = 1
  public pageTo: number = 0
  public fileLists: Array<any[]> = [];
  public fileList: any[] = [];
  private flag: boolean = false
  async created() {
   await this.$request
      .get("/api/api/use/getMyUseResultByUseApplyId", { id: this.fileDataId })
      .then((res: any) => {
        let result = res.data.data;
        console.log(result)
        result.forEach(async (item: any) => {
          console.log(item)
          if (item.fileType)
            item.fileToken = await getSrcCertainly(
              item.fileType,
              item.fileToken,
              true
            );
        });
        this.fileData = result
        this.flag = true
        this.page();
      })
  }
  mounted() {
    console.log(this.fileData)
  }
  changePage(event: any): void {
    if (event && this.pageCur) {
      if (event.type === "prePage" && this.pageCur > 1) {
        this.pageCur--;
        this.fileList = this.fileLists[this.pageCur - 1];
      } else if (
        event.type === "nextPage" &&
        this.pageCur < this.pageTo
      ) {
        this.pageCur++;
        this.fileList = this.fileLists[this.pageCur - 1];
      } else {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.pageCur = event.page;
      }
    }
  }
  page() {
    this.pageTo = Math.ceil(this.fileData.length / 5);
    this.fileLists = this.arrTrans(5, this.fileData);
    this.fileList = this.fileLists[0];
  }
  arrTrans(num: number, arr: any[]) {
    const iconsArr: any[] = [];
    arr.forEach((item, index) => {
      const page = Math.floor(index / num);
      if (!iconsArr[page]) {
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
  }
}
</script>
<style lang="scss">
#fileData {
  .titles {
    height: 75px;
    padding-left: 45px;
    line-height: 75px;
    font-size: 30px;
    color: #444444;
  }
  margin: 8px auto 0 auto;
  width: 700.3px;
  padding-bottom: 1px;
  background: #fff;
  box-sizing: border-box;
}
</style>
