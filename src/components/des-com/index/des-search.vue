<template>
  <div id="des-search">
    <div>
      <img src="@/assets/head/search@2x.png" />
      <input :placeholder="searchText" @input="searchThings" v-model="searchVal"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DesSearch extends Vue {
  @Prop({}) private searchText!: string;
  private timeout: any = null;
  private searchVal: string = ""
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
  div {
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