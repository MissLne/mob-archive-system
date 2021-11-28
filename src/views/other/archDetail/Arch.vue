<template>
  <div id="arch">
    <transition-view>
      <keep-alive include="MyDes">
        <router-view
          :archId="archId"
        ></router-view>
      </keep-alive>
    </transition-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TransitionView from '@/components/public-com/TransitionView.vue'

@Component({
  name: 'Arch',
  components: {
    TransitionView
  }
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