<template>
  <button
    class="single-btn" 
    @click="click"
  >{{name}}</button>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class CoupleBtns extends Vue {
  @Prop() name!: string;

  @Emit('click')
  click() {};
}
</script>

<style lang="scss" scoped>
  .single-btn {
    width: 100%;
    height: 75px;
    border: none;
    background-color: #85B8FD;
    color: #FFF;
    font-size: 35px;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
    border-radius: 8px;
    transition: background-color 0.15s ease-out;
    &:active {
      background-color: hsl(215, 97%, 71%);
    }
  }
</style>