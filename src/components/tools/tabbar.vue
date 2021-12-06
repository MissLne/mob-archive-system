<template>
  <div id="tabbar">
    <div v-for="(item, index) in barData" :key="index">
      <router-link
        :to="item.itemLink"
        replace
        tag="div"
        :style="{ color: type === index ? '#8EBEFE' : '' }"
        @click.native="changePage(index)"
      >
        <img :src="iUrl[index][type === index ? 1 : 0]" />
        <p>{{ item.itemName }}</p>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
class Item {
  itemName: string = "";
  itemLink: string | object = "";
}
@Component
export default class Tabbar extends Vue {
  @Prop({ default: 0 }) private type!: number;
  private barData: Array<Item> = [
    {
      itemName: "著录",
      itemLink: "description",
    },
    {
      itemName: "借阅",
      itemLink: "apply",
    },
    {
      itemName: "档案",
      itemLink: "me",
    },
  ];
  private iUrl: any = [
    [
      require("@/assets/index/descriptiongray@2x.png"),
      require("@/assets/index/description.png"),
    ],
    [
      require("@/assets/index/borrowing.png"),
      require("@/assets/index/borrowingblue@2x.png"),
    ],
    [
      require("@/assets/index/mime.png"),
      require("@/assets/index/mineblue@2x.png"),
    ],
  ];
  @Emit('changePage')
  changePage(event: any) {
    return { go: event };
  }
}
</script>
<style lang="scss">
#tabbar {
  > div div{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  img {
    width: 36.5px;
    height: 44px;
    margin-bottom: 5px;
  }
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 750px;
  height: 90px;
  font-size: 14px;
  color: #d1e5fe;
  box-sizing: border-box;
  padding: 0 114px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.4);
}
</style>