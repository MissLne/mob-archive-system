<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive include="ArchDetail">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { watchRouteChange } from '@/utils/componentUtils'

@Component
export default class App extends Vue {
  private transitionName: string = '';
  created() {
    watchRouteChange(this);
  }
}
</script>
<style lang="scss">
  @import "~@/assets/css/animation/slide-left-and-right.scss";
  .slots {
    height: 124px;
  }
</style>
