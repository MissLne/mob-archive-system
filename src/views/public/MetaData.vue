<template>
  <div id="meta-data">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <header class="slots"></header><!-- 占header的位置 -->

    <section
      v-for="partStruct in shownTree"
      :key="partStruct.id"
      class="part-struct-box"
    >
      <div
        v-for="childArr in partStruct"
        :key="childArr.id"
        class="child-arr-box"
      >
        <div
          v-if="!childArr.child.length"
          class="item-box"
        >
          <h4 class="item-title">{{childArr.metadataName}}</h4>
          <Input v-model="childArr.metadataValue"/>
        </div>
        <ul v-else>
          <li
            v-for="item in childArr.child"
            :key="item.id"
            class="item-box"
          >
            <h4 class="item-title">{{item.metadataName}}</h4>
            <InputDate v-if="item.metadataName.slice(-2) === '时间'" v-model="item.metadataValue"/>
            <Input v-else v-model="item.metadataValue"/>
          </li>
        </ul>
      </div>
    </section>

    <section class="save-box child-arr-box">
      <button class="save-btn" @click="saveMetaData">提交</button>
    </section>
  </div>
</template>

<script lang="ts">
import DesHead from '@/components/des-com/index/des-head.vue'
import Input from '@/components/public-com/Input/Input.vue';
import InputDate from '@/components/public-com/Input/InputDate.vue';
import Msg from '@/components/public-com/MsgBox/Msg';
import { Vue, Component } from 'vue-property-decorator'

interface MetaDataStruct {
  publicMetadataStruct: Array<MetaDataItem>
  specialMetadataStruct: Array<MetaDataItem>
  audioMetadataStruct?: Array<MetaDataItem>
  imageMetadataStruct?: Array<MetaDataItem>
  videoMetadataStruct?: Array<MetaDataItem>
}

@Component({
  components: {
    DesHead,
    Input,
    InputDate
  }
})
export default class MetaData extends Vue {
  fileType: string = '';
  metaDataTree: {[key: string]: any} = {} as MetaDataStruct;
  get shownTree() {
    const obj: {[key: string]: any} = {};
    for (const key in this.metaDataTree) {
      if (key !== 'specialMetadataStruct')
        obj[key] = this.metaDataTree[key]
    }
    return obj;
  }

  created() {
    this.metaDataTree = this.$store.state.metaData.tree
  }
  private saveMetaData() {
    this.$store.commit('metaData/flatMetaTree')
    Msg.success('保存成功')
    this.$router.go(-1)
  }

  private headData: any = {
    title: '元数据',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }

  private headClick({clickType}: any) {
    if (clickType === 'left') {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
  #meta-data {
    padding: 12px 25px 0; // 本来用的是margin，因为动画会导致fixed变形的缘故换成padding
    background: linear-gradient(180deg, #ECF2FE, #E9F1FE);

    .part-struct-box:first-of-type .child-arr-box:first-of-type,
    >section.child-arr-box {
      border-top-color: transparent;
    }

    .child-arr-box {
      background-color: #fff;
      border-top: 8px solid rgba(0, 0, 0, 0.1);
      padding: 10px 40px 20px;
    }
    .item-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title {
        width: 140px;
      }
    }
    .save-box {
      margin-top: -8px;
      .save-btn {
        width: 100%;
        height: 75px;
        border: none;
        margin: 40px 0 30px;
        background-color: hsl(215, 97%, 76%);
        color: #FFF;
        box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        border-radius: 8px;
        transition: background-color 0.15s ease-out;
        &:active {
          background-color: hsl(215, 97%, 71%);
        }
      }
    }
  }
</style>