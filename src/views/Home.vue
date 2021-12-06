<template>
  <div class="home">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <router-view></router-view> -->
    <Tabbar :type="type" @changePage="changePage($event)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tabbar from "@/components/tools/tabbar.vue";

@Component({
  components: {
    Tabbar,
  },
})
export default class Home extends Vue {
  private type: number = 0;
  created() {
    // this.type = localStorage.getItem("tabbarT") || 0;
    this.type = 0;
  }
  changePage(event: any) {
    // localStorage.setItem("tabbarT", event.go);
    this.$nextTick(() => {
      this.type = event.go;
    });
  }
  activated() {
    // 从登录、各种详情页跳回来都会触发，所以只能用名字判断了T T
    const name = this.$route.name;
    if (name === 'description') this.type = 0;
    else if (name === 'apply') this.type = 1;
    else this.type = 2;
  }
}
</script>
<style lang="scss">
.home {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}
</style>