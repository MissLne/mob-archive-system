<template>
  <div class="input-date-wrap">
    <Input @focus="test"/>
    <input ref="getDate" type="date" style="display: none">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Input from './Input.vue'
@Component({
  components: {
    Input,
  }
})
export default class InputDate extends Vue {
  test() {
    (this.$refs.getDate as HTMLInputElement).select();
  }
}
</script>

<style lang="scss">
  .input-wrap-date {

  }
</style>