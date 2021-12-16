<template>
  <div id="arch">
    <keep-alive include="MyDes">
      <router-view
        :archId="archId"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Arch',
  components: {}
})
export default class Arch extends Vue {
  private archId!: number;
  created() {
    console.log('arch creaed')
    this.archId = Number.parseInt(this.$route.params.id);
  }
}
</script>

<style lang="scss">
  /* #arch {
    width: 100vw;
    min-height: 100vh;
  } */
</style>