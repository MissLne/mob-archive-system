<template>
  <van-overlay
    class="layer"
    :show="isShow"
    @click="onLayerClick"
  >
    <video
      ref="video"
      controls
      class="video"
    >
      <source
        :src="`/api/api/file/download/${this.fileToken}`"
        :type="fileType"
      >
    </video>
  </van-overlay>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator'
import { Overlay } from 'vant';

@Component({
  name: 'VideoPreview',
  components: {
    'van-overlay': Overlay
  }
})
export default class VideoPreview extends Vue{
  @Prop() fileToken!: string;
  @Prop() fileType!: string;
  @Model('showChange') isShow!: boolean;
  @Emit('showChange')
  onLayerClick() {
    (this.$refs['video'] as HTMLVideoElement).pause()
    return false;
  }
}
</script>

<style lang="scss">
  .layer {
    z-index: 100;
    display: grid;
    place-items: center;
    .video {
      width: 100vw;
    }
  }
</style>