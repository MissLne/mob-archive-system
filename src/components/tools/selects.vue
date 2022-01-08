<template>
  <div id="selects">
    <div class="title" @click.prevent="showList" :style="{'background':isShowR? '#8ebefe' : '#8ebefe'}">
      <div>{{ listData.title }}</div>
      <img src="@/assets/head/linedown.png" />
      <img src="@/assets/head/pulldown@2x.png" :style="{'transform':isShowR? 'rotate(180deg)' : ''}"/>
    </div>
    <transition name="slide-down">
      <!-- <div class="list" v-show="isShowList" :class="{ close: isClose }">
        <div v-for="(item, index) in listData.list" :key="index" @click="handleClick(index)">{{ item }}</div>
      </div> -->
      <div v-show="isShowList" class="list">
        <div v-for="(item, index) in listData.list" :key="index" @click="handleClick(index)">{{ item }}</div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
interface Item {
  title: string;
  list: string[];
}
@Component
export default class Selects extends Vue {
  @Prop({}) listData!: Item;
  public isShowList: boolean = false
  private isClose: boolean = false
  private isShowR:boolean = false
  created() {
    console.log('selects component', this.listData);
  }
  showList() {
    /* if (this.isShowList) {
      this.isClose = true;
      this.isShowR = !this.isShowR
      setTimeout(() => {
        this.isShowList = !this.isShowList;
        this.isClose = false;
      }, 500);
      return
    } */
    this.isShowR = !this.isShowR
    this.isShowList = !this.isShowList;
  }
  handleClick(event: number) {
    this.$emit('handleClickS',{num: event})
    this.listData.title = this.listData.list[event]
    this.showList()
  }
}
</script>
<style lang="scss">
#selects {
  font-size: 32px;
  color: #fff;
  text-align: center;
  .title {
    z-index: 1;
    position: relative;
    width: 240px;
    height: 70px;
    box-sizing: border-box;
    padding: 0 17px 0 24px;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    > img:nth-of-type(1) {
      width: 1px;
      height: 36px;
    }
    > img:nth-of-type(2) {
      width: 27px;
      height: 15px;
      transition: .5s;
    }
  }
  .list {
    position: absolute;
    width: 240px;
    background: #8ebefe;
    z-index: -1;
    /* transform-origin: top;
    transform: scaleY();
    animation: showList 0.5s; */
    div {
      box-sizing: border-box;
      width: 202px;
      height: 76.6px;
      text-align: center;
      line-height: 76.6px;
      margin: 0 auto;
      border-top: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
  /* @keyframes showList {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  } */
  /* .close {
    animation: cutUp 0.5s;
  }
  @keyframes cutUp {
    from {
      transform: scaleY(1);
    }
    to {
      transform: scaleY(0);
    }
  } */
  .slide-down-enter,
  .slide-down-leave-to {
    transform: translateY(-100%);
  }
  .slide-down-enter-active {
    transition: 0.3s ease-out;
  }
  .slide-down-leave-active {
    transition: 0.3s ease-in;
  }
}
</style>