<template>
  <div id="fileData" v-if="flag && fileData.length"> 
    <!-- <div class="titles" v-if="fileData.length">可下载文件</div> -->
    <div class="bodyer">
      <div v-for="(item, index) in fileList" :key="index">
        <FileItem :fileItem="item" />
      </div>
    </div>
    <div class="footer">
      <PageBtn
        :pageTotal="pageTotal"
        :pageCur="pageCur"
        @changePage="changePage"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FileItem from "@/components/apply-com/edit/fileItem.vue";
import PageBtn from "@/components/public-com/PageBtn.vue";
import { getSrcCertainly } from "@/utils/picture";

@Component({
  components: {
    FileItem,
    PageBtn,
  },
})
export default class FileData extends Vue {
  @Prop({}) private fileDataId !: number
  private fileData!: any;
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

  // 页数控制相关
  public pageCur: number = 1
  public pageTotal: number = 0
  changePage(page: number) {
    // if (event && this.getListData.current)
    this.$nextTick(() => {
      window.scrollTo(0, 0);
    });
    this.pageCur = page;
    this.fileList = this.fileLists[this.pageCur - 1];
  }

  page() {
    this.pageTotal = Math.ceil(this.fileData.length / 5);
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
