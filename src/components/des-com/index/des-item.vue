<template>
  <div id="des-item">
    <div>
      <img :src="desItem.fileToken ? desItem.fileToken : url" />
      <div class="title">
        <div>{{ desItem.topic }}</div>
        <div>{{ desItem.keyWord ? desItem.keyWord : "暂无简介" }}</div>
      </div>
    </div>
    <div class="btn">
      <div @click="showDetail">详细</div>
      <router-link
        v-if="desItem.type === 0"
        tag="div"
        :to="{ name: 'myDes', params: { id: desItem.id, name: desItem.topic } }"
        >查看</router-link
      >
      <!-- <router-link
       v-if="desItem.type === 1"
       tag="div"
        :to="{ name: 'myDes', params: { id: desItem.id } }"
        >查看</router-link
      > -->
      <div v-if="desItem.type === 1" ref="detail-wrapper">查看</div>
    </div>
    <!-- <div
      class="details"
      v-if="isShow"
      :class="{ close: isClose, overflowTop: isOverflow }"
      ref="detail-wrapper"
    ></div> -->
    <div
      class="details"
      :class="{ showDetail: isShow, overflowTop: isOverflow }"
    >
      <div v-for="(item, index) in detailData" :key="index" class="detailItem">
        <div>{{ item.title }}：</div>
        <div>{{ item.content? item.content : "无" }}</div>
      </div>
    </div>
    <div class="covers" v-if="isShow" @click="closeDetail"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DesItem extends Vue {
  @Prop({}) private desItem!: any;
  private isShow: boolean = false;
  private isClose: boolean = false;
  private noname: number = 0;
  private url = require("@/assets/index/anjuan.png");
  private isOverflow: boolean = false;
  private detailData: any[] = [
    {
      title: "分类",
      content: "",
      type: "categoryCode",
    },
    {
      title: "密级",
      content: "",
      type: "confidentialLevel",
    },
    {
      title: "部门名",
      content: "",
      type: "departmentName",
    },
    {
      title: "关键词",
      content: "",
      type: "keyWord",
    },
    {
      title: "著录人",
      content: "",
      type: "recordUser",
    },
    {
      title: "著录时间",
      content: "",
      type: "recordTime",
    },
    {
      title: "保密期限",
      content: "",
      type: "retentionPeriod",
    },
    
  ];
  created() {
    let result = JSON.parse(JSON.stringify(this.desItem))
    // console.log(result);
    
    let level = new Map([
      [0, "公开"],
      [1, "内部"],
      [2, "绝密"],
      [3, "机密"],
      [4, "秘密"],
    ]);
    let period = new Map([
      [1, "永久"],
      [2, "30年"],
      [3, "10年"]
    ]);
    result.confidentialLevel = level.get(result.confidentialLevel)
    result.retentionPeriod = period.get(result.retentionPeriod)
    result.recordTime = result.recordTime.slice(0,10)
    // console.log(1);
    
    for (let i = 0; i < this.detailData.length; i++) {
      
      // console.log(result[this.detailData[i].type]);
      
      this.detailData[i].content = result[this.detailData[i].type];
    }
  }
  closeDetail() {
    this.isShow = false;
  }
  showDetail() {
    // if (!this.isShow) {
    const ele = this.$refs["detail-wrapper"];

    const scale = window.innerWidth / 750;
    const bottom =
      (ele as HTMLElement).getBoundingClientRect().top + 410 * scale;
    if (window.innerHeight < bottom) {
      console.log(111);

      this.isOverflow = true;
    } else {
      this.isOverflow = false;
    }
    // }
    this.isShow = !this.isShow;
  }
}
</script>
<style lang="scss">
#des-item {
  .covers {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: none;
    z-index: 99;
  }
  position: relative;
  width: 690px;
  height: 267px;
  border-radius: 12px;
  background: #fff;
  box-sizing: border-box;
  padding: 39px 42px 32px 45px;
  margin: 22px auto 0 auto;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.3);
  .btn {
    display: flex;
    align-items: center;
    > div:nth-of-type(1) {
      font-size: 22px;
      color: #8ebefe;
      text-decoration: underline;
      // z-index: 100;
    }
    > div:nth-of-type(2) {
      font-size: 22px;
      width: 78px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background: #85b8fd;
      border-radius: 8px;
      margin-left: 54px;
      // z-index: 100;
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
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 270px;
    width: 280px;
    height: 280px;
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
        margin-top: 16px;
      }

    }

  }
  .showDetail {
    transform: scaleY(1);
  }
  .overflowTop {
    transform-origin: bottom;
    top: -94px;
  }
  // @keyframes isShow {
  //   from {
  //     opacity: 0;
  //   }
  //   to {
  //     opacity: 1;
  //   }
  // }
  // .close {
  //   animation: isClose 0.5s;
  // }
  // @keyframes isClose {
  //   from {
  //     opacity: 1;
  //   }
  //   to {
  //     opacity: 0;
  //   }
  // }
}
</style>