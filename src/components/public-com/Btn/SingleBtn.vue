<template>
  <button
    class="single-btn" 
    @click="click"
  >
    <transition name="van-fade" mode="out-in">
      <span v-if="!isLoading">
        {{name}}
      </span>
      <van-loading
        v-else
        color="#fff"
        class="loading"
      />

    </transition>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { Loading } from 'vant'

@Component
export default class SingleBtn extends Vue {
  @Prop() name!: string;
  @Prop({default: false}) isLoading!: boolean;

  @Emit('click')
  click() {};
}
</script>

<style lang="scss" scoped>
  .single-btn {
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
  .loading {
    display: inline-block;
    width: 35px;
    height: 35px;
  }
</style>