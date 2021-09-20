<template>
  <div id="des-item">
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DesItem extends Vue {
}
</script>
<style lang="less">

</style>