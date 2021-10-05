<template>
  <div id="myDes">
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MyDes extends Vue {

  created() {}
}
</script>
<style lang="scss">

</style>
