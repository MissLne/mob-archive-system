<template>
  <div id="face-list">
    <ul class="list">
      <li v-for="(item, index) in faceData" :key="item.uid" class="item" @click="passDetailData(index)">
        <van-image :src="item.url" class="img"/>
        <h3 class="title">{{item.name ? item.name : '无'}}</h3>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Image } from 'vant'

@Component
export default class FaceList extends Vue {
  @Prop() faceData!: FaceData
  @Emit('passDetailData')
  passDetailData(index: number) {
    return index;
  }
}
</script>

<style lang="scss" scoped>
  #face-list {
    padding: 20px 30px 2rem;
    .list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 32px;
      .item {
        text-align: center;
        .img {
          width: 200px;
          height: 200px;
          vertical-align: top; // 不加的话，每个grid块高度会多一些
        }
        .title {
          overflow: hidden;
          width: 100%;
          height: 23px;
          margin-top: 9px;
          color: rgba(51, 51, 51, 1);
          font-size: 23px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    
  }
</style>
