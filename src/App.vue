<template>
  <div id="app">
    <div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <keep-alive :include="$store.state.includeList">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class App extends Vue {
}
</script>
<style lang="scss">
  #app {
    min-height: 100vh;
    background-image: linear-gradient(180deg, #ECF2FE, #E9F1FE);
    overflow-wrap: break-word;
    .slots {
      height: 124px;
    }
    @import "~@/assets/css/animation/slide-left-and-right.scss";
  }
</style>
