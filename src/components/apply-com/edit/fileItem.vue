<template>
  <div id="fileItem">
    <div>
      <img :src="fileItem.fileToken ? fileItem.fileToken : url" />
      <div class="title">
        <div>{{ fileItem.topic }}</div>
        <div>{{ fileItem.keyWord ? fileItem.keyWord : "暂无简介" }}</div>
      </div>
    </div>
    <div class="btn">
      <div @click="showDetail">详细</div>
      <div
        @click="download"
        :style="{ background: fileItem.downloaded ? '#85b8fd' : '#C4DEFF' }"
      >
        下载
      </div>
    </div>
    <div class="details" v-if="isShow" :class="{ close: isClose }"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MsgBox from "@/components/public-com/MsgBox/Msg";

@Component
export default class FileItem extends Vue {
  @Prop({}) private fileItem!: any;
  created() {
    console.log(this.fileItem, "-=-");
  }
  private isShow: boolean = false;
  private isClose: boolean = false;
  private noname: number = 0;
  private url = require("@/assets/index/anjuan.png");

  showDetail() {
    if (this.isShow) {
      this.isClose = true;
      setTimeout(() => {
        this.isShow = !this.isShow;
        this.isClose = false;
      }, 500);
      return;
    }
    this.isShow = !this.isShow;
  }
  download() {
    if (this.fileItem.downloaded) {
      this.$request
        .get("api/api/use/downloadMyUse", {
          useContentId: this.fileItem.useContentId,
        })
        .then((res: any) => {
          if (res.data.success === true) {
            this.$router.go(-1);
            MsgBox.success("下载成功");
            return;
          }
          throw new Error();
        })
        .catch((err: any) => {
          MsgBox.error("下载失败");
        });
    } else {
          MsgBox.error("该文件不可下载");
    }
  }
}
</script>
<style lang="scss">
#fileItem {
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
      height: 95px;
      font-size: 20px;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
  .details {
    position: absolute;
    right: 0;
    top: 270px;
    width: 240px;
    height: 230px;
    border-radius: 8px;
    color: #fff;
    font-size: 22px;
    background: #8ebefe;
    box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
    z-index: 1;
    animation: isShow 0.5s;
  }
  @keyframes isShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .close {
    animation: isClose 0.5s;
  }
  @keyframes isClose {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
}
</style>
