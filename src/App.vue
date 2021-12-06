<template>
  <div id="app">
    <transition-view>
      <div>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <keep-alive :include="$store.state.includeList">
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </keep-alive>
      </div>
    </transition-view>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TransitionView from '@/components/public-com/TransitionView.vue'

@Component({
  components: {
    TransitionView
  }
})
export default class App extends Vue {
}
</script>
<style lang="scss">
  #app {
    min-height: 100vh;
    background-image: linear-gradient(180deg, #ECF2FE, #E9F1FE);
    .slots {
      height: 124px;
    }
    @import "~@/assets/css/animation/slide-left-and-right.scss";
  }
</style>
