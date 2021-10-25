<template>
  <div class="input-date-wrap">
    <Input
      v-model="inputData"
      :disabled="disabled"
      @click.native="disabled || (show = true)"
    />
     <van-calendar
      :color="'#85B8FD'"
      :min-date="minDate"
      :max-date="maxDate"
      v-model="show"
      @confirm="onConfirm"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Emit, Prop } from 'vue-property-decorator'
import Input from './Input.vue'
import { Calendar } from 'vant';
@Component({
  components: {
    Input,
  }
})
export default class InputDate extends Vue {
  @Prop({default: false}) disabled!: boolean;
  @Model('onConfirm', {type: String}) inputData!: string;
  private show: boolean = false;
  private minDate: Date = new Date('1958/01/01');
  private maxDate: Date = new Date();
  @Emit('onConfirm')
  private onConfirm(selected: Date) {
    this.show = false;
    let Y: any = selected.getFullYear();
    let M: any = selected.getMonth() + 1;
    M = M < 10 ? '0' + M : M;
    let D: any = selected.getDate();
    D = D < 10 ? '0' + D : D;
    return `${Y}-${M}-${D}`;
  }
}
</script>

<style lang="scss">
</style>