<template>
  <div id="des-search">
    <div class="input-father">
      <img src="@/assets/head/search@2x.png" />
      <input :placeholder="searchText" @input="searchThings" v-model="searchVal" v-if="!isDate"/>
      <div v-if="isDate">
        <div @click="show = true" class="calendar-title">{{date? date : '选择搜索日期'}}</div>
      <van-calendar v-model="show" @confirm="onConfirm($event)" color="#8cbffe" :max-date="maxDate" :min-date="minDate"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DesSearch extends Vue {
  @Prop({}) private searchText!: string;
  @Prop({default: false}) private isDate!: boolean;
  private show: boolean = false
  private timeout: any = null;
  private searchVal: string = ""
  private date: string = ""
  private minDate: any = new Date("1958/01/01")
  private maxDate: any = new Date()
  GMTToStr(time: string){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate()
    return Str
}
  onConfirm(e: any) {
    // console.log(e);
    let arr = this.GMTToStr(e).split("-")
    console.log(arr);
    arr[1].length < 2? arr[1] = '0' + arr[1] : arr[1]
    arr[2].length < 2? arr[2] = '0' + arr[2] : arr[2]
    this.date = arr.join("-")
    this.show = false
    this.$emit('onConfirm',{date: this.date})
  }
  searchThings() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.$emit("searchThings", {searchVal: this.searchVal});
    }, 1000);
  }
  debounce(fn: any, wait: number) {
    let timer: any = null;
    return function () {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    };
  }
}
</script>
<style lang="scss">
#des-search {
  width: 750px;
  height: 77px;
  padding-bottom: 21px;
  z-index: 99;
  position: fixed;
  top: 124px;
  left: 0;
  background: linear-gradient(to bottom, #8cbffe 0%, #8fc1ff 100%);
  .calendar-title {
     color: rgba(255, 255, 255, 0.5);
      font-size: 32px;
    width: 300px;
    font-weight: normal;
  }
  .input-father {
    background: #c6dfff;
    width: 690px;
    height: 77px;
    border-radius: 5px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 33px;
      width: 33px;
      margin-right: 20px;
    }
    input {
      color: #fff;
      font-size: 32px;
      background: none;
      outline: none;
      border: none;
      width: 300px;
    }
    input::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    input:-moz-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    input::-moz-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>