<template>
  <div id="fileData">
    <div class="title">可下载文件</div>
    <div class="bodyer" >
      <div v-for="(item, index) in fileList" 
        :key="index">
        <FileItem 
        :fileItem="item"
      />
      </div>
    </div>
    <div class="footer">
      <DesBtn
        @changePage="changePage($event)"
        :totalPage="pageData"
        v-if="pageData.total"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FileItem from "@/components/apply-com/edit/fileItem.vue";
import DesBtn from "@/components/des-com/index/des-btn.vue";

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
  @Prop({}) private fileData!: any;
  public pageData: ObjItem = {
    current: 1,
    total: 0,
  };
  public fileLists: Array<any[]> = [];
  public fileList: any[] = [];
  created() {
    this.page();
    console.log(this.fileData,"+++++  ");
    
    // console.log(this.fileList);
    
  }
  changePage(event: any): void {
    if (event && this.pageData.current) {
      if (event.type === "prePage" && this.pageData.current > 1) {
        this.pageData.current--;
        this.fileList = this.fileLists[this.pageData.current - 1];
      } else if (
        event.type === "nextPage" &&
        this.pageData.current < this.pageData.total
      ) {
        this.pageData.current++;
        this.fileList = this.fileLists[this.pageData.current - 1];
      } else {
        return;
      }
    }
  }
  page() {
    this.pageData.total = Math.ceil(this.fileData.length / 5);
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
  margin: 8px auto 0 auto;
  width: 700.3px;
  background: #fff;
  box-sizing: border-box;
}
</style>
