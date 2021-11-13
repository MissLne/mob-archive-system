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
import { Component, Prop, Vue } from "vue-property-decorator";
import Tabbar from "@/components/tools/tabbar.vue";

@Component({
  components: {
    Tabbar,
  },
})
export default class Home extends Vue {
  private type: number | string = 0;
  created() {
    
    this.type = localStorage.getItem("tabbarT") || 0;
  }
  changePage(event: any) {
    localStorage.setItem("tabbarT", event.go);

    this.$nextTick(() => {
      this.type = event.go;
    });
    // this.$router.go(0)
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