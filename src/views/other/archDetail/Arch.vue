<template>
  <div id="arch">
    <keep-alive>
      <router-view
        :archId="archId"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Arch extends Vue {
  private archId!: number;
  created() {
    this.archId = Number.parseInt(this.$route.params.id);
  }
}
</script>

<style lang="scss">

</style>