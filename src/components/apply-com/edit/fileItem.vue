<template>
  <div id="fileItem">
    <div>
      <img :src="fileItem.fileToken ? fileItem.fileToken : url" />
      <div class="title">
        <div>{{ fileItem.topic }}</div>
        <div>{{ fileItem.introduce ? fileItem.introduce : "暂无简介" }}</div>
      </div>
    </div>
    <div class="btn">
      
      <div @click="showDetail" ref="detail-wrapper">详细</div>
      <div @click="download"
        :style="{ background: fileItem.downloaded ? '#85b8fd' : '#C4DEFF' }"
      >
      <a download="未命名" :href="downloadUrl" v-if="fileItem.downloaded"></a>
        下载
      </div>
    </div>
    <div
      class="details"
      :class="{ showDetail: isShow, overflowTop: isOverflow }"
    >
      <div v-for="(item, index) in detailData" :key="index" class="detailItem">
        <div>{{ item.title }}：</div>
        <div>{{ item.content ? item.content : "无" }}</div>
      </div>
    </div>
    <div class="item-covers" @click="coverClose" v-if="isShow"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MsgBox from "@/components/public-com/MsgBox/Msg";

@Component
export default class FileItem extends Vue {
  @Prop({}) private fileItem!: any;

  private downloadUrl: string = "";
  private isOverflow: boolean = false;
  private isShow: boolean = false;
  private isClose: boolean = false;
  private noname: number = 0;
  private url = require("@/assets/index/anjuan.png");
  private detailData: any[] = [
    {
      title: "分类",
      content: "",
      type: "categoryCode",
    },
    {
      title: "部门",
      content: "",
      type: "departmentName",
    },
    {
      title: "著录人",
      content: "",
      type: "recordUser",
    },
    {
      title: "截止日期",
      content: "",
      type: "deadLine",
    },
  ];
  created() {
    for (let i = 0; i < this.detailData.length; i++) {
      this.detailData[i].content = this.fileItem[this.detailData[i].type];
    }
    this.$service
      .get(
        `api/api/use/downloadMyUse/?useContentId=${this.fileItem.useContentId}`,
        {
          responseType: "arraybuffer",
        }
      )
      .then((data: any) => {
        this.downloadUrl =
          "data:image/png;base64," +
          btoa(
            new Uint8Array(data.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
      });
  }
  coverClose() {
    this.isShow = false;
  }
  showDetail() {
    const ele = this.$refs["detail-wrapper"];

    const scale = window.innerWidth / 750;
    const bottom =
      (ele as HTMLElement).getBoundingClientRect().top + 350 * scale;
    if (window.innerHeight < bottom) {
      console.log(111);

      this.isOverflow = true;
    } else {
      this.isOverflow = false;
    }
    this.isShow = !this.isShow;
  }
  download() {
    if (this.fileItem.downloaded) {
    } else {
      MsgBox.error("该文件不可下载");
    }
  }
}
</script>
<style lang="scss">
#fileItem {
  .item-covers {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: none;
  }
  position: relative;
  width: 690px;
  height: 267px;
  border-radius: 12px;
  background: #fff;
  box-sizing: border-box;
  padding: 39px 42px 32px 45px;
  margin: 0 auto 22px auto;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  box-shadow: 0px 4px 7px 0px rgba(76, 108, 174, 0.3);
  .btn {
    display: flex;
    align-items: center;
    > div:nth-of-type(1) {
      font-size: 22px;
      color: #8ebefe;
      text-decoration: underline;
    }
    > div:nth-of-type(2) { 
      a {
        top: 0;
        left: 0;
        display: inline-block;
        position: absolute;
        width: 78px;
      height: 40px;
      }
      position: relative;
      font-size: 22px;
      width: 78px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      // background: #85b8fd;
      border-radius: 8px;
      margin-left: 54px;
    }
  }
  img {
    width: 119px;
    height: 150px;
  }
  > div:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    color: #444;
    div:nth-of-type(1) {
      width: 390px;
      height: 28px;
      font-size: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    div:nth-of-type(2) {
      margin-top: 27px;
      width: 448;
      height: 85px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 20px;
      line-height: 42px;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
  .details {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 270px;
    width: 280px;
    height: 210px;
    border-radius: 8px;
    color: #fff;
    font-size: 22px;
    background: #8ebefe;
    box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
    z-index: 1;
    z-index: 101;
    transform-origin: top;
    transform: scaleY(0);
    transition: 0.3s;
    padding: 0 15px;
    .detailItem {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      > div {
        // margin-right: 10px;
        margin-top: 20px;
      }
    }
  }
  .showDetail {
    transform: scaleY(1);
  }
  .overflowTop {
    transform-origin: bottom;
    top: -44px;
  }
}
</style>
