<template>
  <div id="app">
    <transition-view>
      <keep-alive :include="testAdd">
        <router-view/>
      </keep-alive>
    </transition-view>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import TransitionView from '@/components/public-com/TransitionView.vue'

@Component({
  components: {
    TransitionView
  }
})
export default class App extends Vue {
  get testAdd() {
    return this.$store.state.isDetailAlive ? ['Arch', 'TempArch'] : [];
  }
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
