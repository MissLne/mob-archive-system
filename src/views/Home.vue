<template>
  <div class="home">
    <div>
      <router-view/>
    </div>
    <div>
      <router-link v-for="(item, index) in barData" :key="index" :to="item.itemLink" tag="div" class="tabbar">
        <p>{{item.itemName}}</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

class Item {
  itemName: string = ""
  itemLink: string | object = ""
}

@Component({
  components: {
  },
})
export default class Home extends Vue {
  private barData: Array<Item> = [
    {
      itemName: "著录中",
      itemLink: "description"
    },
    {
      itemName: "借阅申请",
      itemLink: "apply"
    },
    {
      itemName: "我的档案",
      itemLink: "me"
    }
  ]
  
}
</script>
<style lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  .tabbar {
    background: #f00;
  }
}
</style>