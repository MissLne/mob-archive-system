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
import { watchRouteChange } from '@/utils/utils-component'

@Component
export default class App extends Vue {
  private transitionName: string = '';
  created() {
    watchRouteChange(this);
  }
}
</script>
<style lang="scss">
  #app {
    background-image: linear-gradient(180deg, #ECF2FE, #E9F1FE);
    .slots {
      height: 124px;
    }
    @import "~@/assets/css/animation/slide-left-and-right.scss";
  }
</style>
