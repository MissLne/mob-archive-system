<template>
  <div class="home">
    <div>
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <Tabbar :type="type" @changePage="changePage($event)"/>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tabbar from "@/components/tools/tabbar.vue"



@Component({
  components: {
    Tabbar
  },
})
export default class Home extends Vue {
  private type: number | string = 0
  created() {
    this.type = localStorage.getItem('tabbarT') || 0
  }
  changePage(event: any) {
    localStorage.setItem('tabbarT',event.go)
    this.type = event.go
    // this.$router.go(0)
  }
}
</script>
<style lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  
}
</style>