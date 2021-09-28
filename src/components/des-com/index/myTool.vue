<template>
  <div id="tool">
    <Selects :listData="listData" @handleClickS="handleClickS($event)"/>
    <div class="right">共个{{count}}档案</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Selects from '@/components/tools/selects.vue'
interface Item {
  title: string;
  list: string[];
}
@Component({
  components: {
    Selects
  }
})
export default class Tool extends Vue {
  @Prop({}) private count!: number
  public listData: Item = {
    title: "显示全部",
    list: ["显示案卷","显示文件"]
  }
  handleClickS(event: any) {
    this.$emit('selectHandle',{index: event.num})
  }
}
</script>
<style lang="scss">
#tool {
  position: fixed;
  top: 201px;
  left: 0;
  background: #8fc1ff;
  height: 70px;
  width: 750px;
  box-sizing: border-box;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  .right {
    font-size: 32px;
    color: #fff;
  }
}
</style>