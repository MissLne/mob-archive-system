<template>
  <div class="home">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <Tabbar />
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
}
</script>
<style lang="scss">
.home {
  overflow-x: hidden;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

</style>