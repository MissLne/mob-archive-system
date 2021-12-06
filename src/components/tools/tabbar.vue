<template>
  <div id="tabbar">
    <div v-for="(item, index) in barData" :key="index">
      <router-link
        :to="item.itemLink"
        replace
        tag="div"
        :style="{ color: type == index ? '#8EBEFE' : '' }"
        @click.native="changePage(index)"
      >
        <img :src="item.imageUrl" />
        <p>{{ item.itemName }}</p>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
class Item {
  itemName: string = "";
  itemLink: string | object = "";
  imageUrl: any;
}
@Component
export default class Tabbar extends Vue {
  @Prop({ default: 0 }) private type!: number;
  private barData: Array<Item> = [
    {
      itemName: "著录",
      itemLink: "description",
      imageUrl: "",
    },
    {
      itemName: "借阅",
      itemLink: "apply",
      imageUrl: "",
    },
    {
      itemName: "档案",
      itemLink: "me",
      imageUrl: "",
    },
  ];
  private iUrl: any = [
    [
      require("@/assets/index/description.png"),
      require("@/assets/index/borrowing.png"),
      require("@/assets/index/mime.png"),
    ],
    [
      require("@/assets/index/descriptiongray@2x.png"),
      require("@/assets/index/borrowingblue@2x.png"),
      require("@/assets/index/mime.png"),
    ],
    [
      require("@/assets/index/descriptiongray@2x.png"),
      require("@/assets/index/borrowing.png"),
      require("@/assets/index/mineblue@2x.png"),
    ],
  ];
  created() {
    console.log(this.type)
    for (let i = 0; i < this.barData.length; i++) {
      this.barData[i].imageUrl = this.iUrl[this.type][i];
    }
  }
  changePage(event: any) {
    this.$emit("changePage", { go: event });
    for (let i = 0; i < this.barData.length; i++) {
      this.barData[i].imageUrl = this.iUrl[event][i];
    }
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