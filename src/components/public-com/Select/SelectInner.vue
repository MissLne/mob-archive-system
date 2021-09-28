<template>
  <div class="select-box">
    <div class="option" @click="onOptionClick(typeName)">
      {{typeName}}
    </div>
    <ul class="select" v-show="isSpread" v-if="itemList">
      <li class="option-box" v-for="item in itemList" :key="item.id">
        <!-- <div class="option" @click="onOptionClick(item.typeName)">{{item.typeName}}</div> -->
        <SelectInner
          :myData="item.children"
          :typeName="item.typeName"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SelectInner extends Vue {
  @Prop() myData!: Array<any> | null;
  @Prop() typeName!: string;
  get itemList() {
    console.log('myData is', this.myData)
    return this.myData || null
  }
  isSpread: boolean = true;
  onOptionClick(e: any) {
    console.log('option is', e)
    this.isSpread = !this.isSpread;
  }
  mounted() {
    console.log('mounted!')
  }
  
}
</script>

<style lang="scss">
  .select-box {
    width: 100%;
    .select {
      font-size: 24px;
      width: 100%;
      background: #8EBEFE;
      color: #FFF;
      .option-box {
        box-sizing: border-box;
        width: 100%;
        padding-left: 15px;
        .option {
          width: 100%;
          height: 70px;
          line-height: 70px;
        }
      }
    }
  }
</style>