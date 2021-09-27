<template>
  <div id="des-search">
    <div>
      <img src="@/assets/head/search@2x.png" />
      <input placeholder="请输入题名搜索" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DesSearch extends Vue {}
</script>
<style lang="scss">
#des-search {
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
      color: rgba(255, 255, 255,.5);
    }

    input:-moz-placeholder {
      color: rgba(255, 255, 255,.5);
    }

    input::-moz-placeholder {
      color: rgba(255, 255, 255,.5);
    }
  }
}
</style>