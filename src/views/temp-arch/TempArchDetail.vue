<template>
  <div id="temp-arch-detail">
    <button @click="getData">载入</button>
    <div class="container">
      <div class="preview-box">
        <span class="title">预览</span>
        <img src="" alt="">
      </div>
      <h3 class="title">基础信息</h3>
      <ul class="inf-list">
        <li class="item" v-for="item in inputs" :key="item.title">
          <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>
          <input type="text" class="item-input" v-model="item.value">
        </li>
      </ul>
      <div class="go-meta-box">
        <a href="#">查看元数据>></a>
      </div>
      <div class="btns-box">
        <button class="left-btn">删除</button>
        <button class="right-btn">著录</button>
      </div>
    </div>
    <!-- <div class="bg-box"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ArchItemData } from 'vue/types/vue'

@Component
export default class TempArchDetail extends Vue {
  @Prop() detailData!: ArchItemData
  getData() {
    console.log(this.detailData)
    
  }
  private readonly inputs = [
    { title: '题名', required: true, value: '' },
    { title: '人物', required: false, value: '' },
    { title: '时间', required: false, value: '' },
    { title: '地点', required: false, value: '' },
    { title: '事件', required: false, value: '' },
    { title: '全宗号', required: true, value: '' },
    { title: '类别号', required: true, value: '' },
    { title: '部门', required: true, value: '' },
    { title: '密级', required: true, value: '' },
    { title: '保密期限', required: true, value: '' },
  ]
}
</script>

<style lang="scss">
  #temp-arch-detail {
    height: 1208px;
    border-radius: 1px;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    .container {
      width: 700px;
      height: 100%;
      box-sizing: border-box;
      padding: 18px 0 31px 40px;
      background-color: #fff;
      .preview-box {
      }
      .inf-list {
        margin-right: 53px;
        .item {
          $item-height: 73px;
          display: flex;
          justify-content: space-between;
          .item-title {
            line-height: $item-height;
          }
          .required::after { // 用于显示必填红星
            content: '*';
            color: #FF0000;
          }
          .item-input {
            height: $item-height;
            border: none;
            border-bottom: 3px solid #E1E1E1;
          }
        }
        
      }
      .go-meta-box {
        width: 100%;
        margin-bottom: 40px;
      }
      .btns-box {
        display: flex;
        justify-content: space-between;
        margin-left: 40px;
        margin-right: 90px;
        font-size: 42px;
        .left-btn,
        .right-btn {
          width: 162px;
          height: 75px;
          border: none;
          border-radius: 8px;
        }
        .left-btn {
          background-color: #fff;
          color: rgba(255, 0, 0, 0.7);
          box-shadow: 0px 3px 7px 0px rgba(143, 143, 143, 0.35);
        }
        .right-btn {
          background-color: #85B8FD;
          color: #fff;
          box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        }
      }
    }
    .bg-box {
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      
      background: linear-gradient(180deg, #ECF2FE, #E9F1FE);
    }
  }
</style>