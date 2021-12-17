<template>
  <div class="icon-wrapper">
    <slot></slot>
    <van-icon
      name="play-circle-o"
      class="icon"
    />
  </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { Icon } from 'vant';

@Component({
  components: {
    'van-icon': Icon,
  }
})
export default class IconWrapper extends Vue {

}
</script>

<style lang="scss" scoped>
  .icon-wrapper {
    position: relative;
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: #fff;
      color: #87B8FD;
      font-size: 80px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>