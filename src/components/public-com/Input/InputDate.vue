<template>
  <div class="input-date-wrap">
    <Input
      v-model="inputData"
      :disabled="true"
      @click.native="show = true"
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
import { Component, Vue, Model, Emit } from 'vue-property-decorator'
import Input from './Input.vue'
import { Calendar } from 'vant';
@Component({
  components: {
    Input,
  }
})
export default class InputDate extends Vue {
  @Model('onConfirm', {type: String}) inputData!: string;
  private show: boolean = false;
  private minDate: Date = new Date('1958/01/01');
  private maxDate: Date = new Date();
  @Emit('onConfirm')
  private onConfirm(selected: Date) {
    this.show = false;
    return `${selected.getFullYear()}-${selected.getMonth() + 1}-${selected.getDate()}`;
  }
}
</script>

<style lang="scss">
</style>