<template>
  <div id="temp-arch-meta">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <div
      v-for="partStruct in metaData"
      :key="partStruct.id"
      class="part-struct-box"
    >
      <div v-if="partStruct[0].metadataName === '特殊节点'"></div>
      <div
        v-else
        v-for="childArr in partStruct"
        :key="childArr.id"
        class="child-arr-box"
      >
        <div
          v-if="!childArr.child.length"
          class="item-box"
        >
          <h4 class="item-title">{{childArr.metadataName}}</h4>
          <Input/>
        </div>
        <ul v-else>
          <li
            v-for="item in childArr.child"
            :key="item.id"
            class="item-box"
          >
            <h4 class="item-title">{{item.metadataName}}</h4>
            {{item.metadataValue}}
            <InputDate v-if="item.metadataName.includes('时间')" v-model="item.metadataValue"/>
            <Input v-else v-model="item.metadataValue"/>
          </li>
        </ul>
      </div>
    </div>

    <div class="save-box child-arr-box">
      <button class="save-btn" @click="saveMetaData">提交</button>
    </div>
  </div>
</template>

<script lang="ts">
import DesHead from '@/components/des-com/index/des-head.vue'
import Input from '@/components/public-com/Input/Input.vue';
import InputDate from '@/components/public-com/Input/InputDate.vue';
import { Vue, Component, Prop } from 'vue-property-decorator'
import TempArchDetail from './TempArchDetail.vue';

type MetaDataStruct = {
  [key: string]: Array<MetaDataItem>
} | null

interface MetaDataItem {
  id: number,
  parentId: number,
  metadataName: string,
  metadataValue: any,
  child: Array<MetaDataItem>
}

@Component({
  components: {
    DesHead,
    Input,
    InputDate
  }
})
export default class TempArchMeta extends Vue {
  fileType: string = ''
  metaData: MetaDataStruct = null;
  created() {
    this.fileType = (this.$route.params.fileType) as string;

    let metaStruct: any = localStorage.getItem('struct');
    metaStruct = JSON.parse(metaStruct)
    this.metaData = {
      publicMetadataStruct: metaStruct.publicMetadataStruct,
      specialMetadataStruct: metaStruct.specialMetadataStruct,
      [`${this.fileType}MetadataStruct`]: metaStruct[`${this.fileType}MetadataStruct`],
    }
    console.log(this.metaData)
  }
  private saveMetaData() {
    this.$router.replace({name: 'tempArchDetail', params: {
      metaData: JSON.stringify(this.metaData)
    }})
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
  #temp-arch-meta {
    padding: 4px 25px 0; // 本来用的是margin，因为动画会导致fixed变形的缘故换成padding
    background-color: rgba(255, 255, 255, 0.1);
    .child-arr-box {
      background: #fff;
      margin-top: 8px; // 这里存在外边距塌陷，所以上面的padding写了4px，原来为12px
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
        margin: 51px 0 30px;
        background-color: #85B8FD;
        color: #FFF;
        box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        border-radius: 8px;
        transition: background-color 0.15s ease-out;
        &:active {
          background-color: hsl(224, 97%, 76%);
        }
      }
    }
  }
</style>