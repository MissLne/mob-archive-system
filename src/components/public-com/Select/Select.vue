<template>
  <div class="select-wrapper" @click="isSpread = true">
    <div class="select-inner" v-show="isSpread">
      <SelectInner :myData="myData"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SelectInner from './SelectInner.vue';

@Component({
  components: {
    SelectInner
  }
})
export default class Select extends Vue {
  @Prop() myData!: Array<any> | null;
  private isSpread: boolean = false;
}
</script>

<style lang="scss">
  .select-wrapper {
    width: 100%;
    height: 100%;
    .select-inner {
      overflow: auto;
      max-height: 300px;
      box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
    }
  }
</style>