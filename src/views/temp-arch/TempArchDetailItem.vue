<template>
  <div class="temp-arch-detail-item">
    <div class="container">
      <PreviewBox
        :picSrc="detailData.picSrc"
        :fileToken="detailData.fileToken"
        :fileType="detailData.fileType"
      />
      <ArchForm
        :inputsProps="inputsProps"
        :fileId="detailData.fileId"
        :canRecognize="canRecognize"
      />
        
      <div
        v-if="haveMetaData"
        class="go-meta-box"
      >
        <router-link
          :to="{ name: 'metaData' }"
          class="go-meta"
        >查看元数据>></router-link>
      </div>
      <CoupleBtns
        :leftName="'删除'"
        :rightName="'著录'"
        class="couple-margin"
        @leftClick="deleteFile"
        @rightClick="addFile"
      />
    </div>
    <!-- <div class="bg-box"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { initMetaData } from '@/utils/utils-file';
import { Dialog } from 'vant';
import Msg from '@/components/public-com/MsgBox/Msg';
import PreviewBox from '@/components/public-com/Archive/PreviewBox.vue'
import ArchForm from '@/components/public-com/Archive/ArchForm.vue'
import CoupleBtns from '@/components/public-com/Btn/CoupleBtns.vue'
import { addTemporaryArchive, changeTemporaryArchiveToNormalArchive, deleteTemporaryArchive, getImageMetadata } from '@/services/temp-arch'

@Component({
  name: 'TempArchDetailItem',
  components: {
    PreviewBox,
    ArchForm,
    CoupleBtns,
  }
})
export default class TempArchDetailItem extends Vue {
  @Prop() detailData!: ArchItemData;
  // select的内容
  get fondsIdentifier() { return this.$store.getters['selectData/fondsIdentifier'] }
  get dossierType() { return this.$store.getters['selectData/dossierType'] }
  get departmentNameTree() { return this.$store.getters['selectData/departmentNameTree'] }
  // 密级列表
  get confidentialLevelArray() { return this.$store.state.selectData.confidentialLevelArray };
  // 保密期限列表
  get retentionPeriodArray() { return this.$store.state.selectData.retentionPeriodArray };

  // 是否存在元数据
  get haveMetaData() {
    const type = this.detailData?.fileType.split('/')[0];
    return type === 'image' || type === 'audio' || type === 'video';
  }
  // 是否可以人脸识别
  get canRecognize() {
    return this.detailData?.fileType.split('/')[0] === 'image';
  }

  get isComplete() {
    // 用循环失效，直接暴力写法了
    return this.inputsProps.topic.value
      && this.inputsProps.fondsIdentifierId.value
      && this.inputsProps.categoryCode.value
      && this.inputsProps.departmentId.value
      && this.inputsProps.confidentialLevel.value
      && this.inputsProps.retentionPeriod.value
  }

  private readonly inputsProps: {[key: string]: any} = {
    topic: { title: '题名', required: true, msg: '请输入题名', type: 'textarea', value: '' },
    people: { title: '人物', required: false, type: 'textarea', value: '' },
    time: { title: '时间', required: false, type: 'date', value: '' },
    place: { title: '地点', required: false, type: 'textarea', value: '' },
    event: { title: '事件', required: false, type: 'textarea', value: '' },
    fondsIdentifierId: { title: '全宗号', required: true, msg: '请输入全宗号', type: 'select', value: '' },
    categoryCode: { title: '类别号', required: true, msg: '请输入类别号', type: 'select', value: '' },
    departmentId: { title: '部门', required: true, msg: '请输入部门', type: 'select', value: '' },
    confidentialLevel: { title: '密级', required: true, type: 'select', value: '' },
    retentionPeriod: { title: '保密期限', required: true, type: 'radio', value: 1 },
  }
  get inputsValue() {
    const obj: {[key: string]: any} = {};
    const props = this.inputsProps;

    obj['archived'] = false;
    obj['temporaryArchiveId'] = this.detailData.id;
    obj['fileId'] = this.detailData.fileId;
    obj['thumbnailFileId'] = this.detailData.thumbnailFileId;
    obj['zippedFileId'] = (this.detailData as any).zippedFileId;

    const specialMeta = this.$store.state.metaData.tree.specialMetadataStruct[0].child as Array<MetaDataItem>;

    for (const key in props) {
      if (props[key].required)
        obj[key] = props[key].value
      else
        specialMeta.forEach(item => {
          if (item.metadataName === props[key].title)
            item.metadataValue = props[key].value
        })
    }
    obj['fondsIdentifierId'] = obj['fondsIdentifierId'].id
    obj['categoryCode'] = obj['categoryCode'].id
    obj['departmentId'] = obj['departmentId'].id
    obj['confidentialLevel'] = obj['confidentialLevel'].id

    obj['metadata'] = (
      [...(this.$store.state.metaData.flatArr), ...(specialMeta)] as Array<MetaDataItem>
    )
      .filter(value => value.metadataValue)
      .forEach((value) => {
        let { id, metadataValue, metadataName } = value
        if (metadataName.slice(-2) === '时间')
          metadataValue += 'T00:00:00'
        return { metadataId: id, metadataValue }
      }
    )

    return obj;
  }
  // 生命周期-创建
  private created() {
    console.log('created', this.detailData)
    this.createSetting();
  }
  // 进入页面时的设置
  async createSetting() {
    // 清空
    for (let key in this.inputsProps) {
      if (key !== 'retentionPeriod') this.inputsProps[key].value = '';
      else this.inputsProps[key].value = 1;
    }
    // 填上名字
    if (this.detailData.fileName)
      this.inputsProps.topic.value = this.detailData.fileName;

    if (!(this.detailData as any).metadata) {
      const { data } = await getImageMetadata({ fileId: this.detailData.fileId })
      
      if (data.code === 200) {
        data.data.forEach((value: any) => ({
          id: value.metadataId,
          metadataValue: value.metadataValue,
        }))
        this.$set(this.detailData, 'metadata', data.data)
        initMetaData(this, 'metadata')
        console.log(this.$store.state.metaData.tree)
      }
    }
    else
      console.log((this.detailData as any).metadata);
  }
  // ajax著录文件
  private async addFile() {
    if (!this.isComplete) {
      Msg.error('请填写必填项');
      return;
    }
    try {
      const { data } = await changeTemporaryArchiveToNormalArchive([this.inputsValue])
      if (data.code === 200) {
        Msg.success('著录成功');
        this.submitFile();
      }
      else throw Error();
    } catch (error) {
      console.log(error);
        Msg.error('著录失败')
    }
  }
  // ajax删除文件
  private deleteFile() {
    Dialog.confirm({
      title: '确认删除',
      confirmButtonText: '是',
      cancelButtonText: '否'
    }).then(async () => {
      try {
        const {data} = await deleteTemporaryArchive([this.detailData.id]);
        if (data.code === 200) {
          Msg.success('删除成功')
          this.submitFile();
        }
          else throw Error();
      } catch (error) {
        Msg.error('删除失败')
      }
    }).catch(() => {})
  }
  // ajax暂存文件
  public async tempAddFile() {
    const { data } = await addTemporaryArchive([this.inputsValue]);
    console.log(data);
  }
  // 文件被成功著录或删除
  @Emit('submitFile')
  submitFile() {}
}
</script>

<style lang="scss">
  .temp-arch-detail-item {
    width: 700px;
    min-height: 1335px;
    padding: 0 25px 20px;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    border-radius: 1px;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 700px;
      min-height: 1208px;
      box-sizing: border-box;
      padding: 18px 0 29px 40px;
      /* 用于头部占位的margin，因为外层margin会影响van-calendar的位置，被迫加载内层 */
      margin-top: 124px;
      background-color: #fff;
      .go-meta-box {
        width: 100%;
        margin: 24px 0 42px;
        a {
          color: #8EBEFE;
        }
      }
      .couple-margin {
        margin-left: 40px;
        margin-right: 90px;
      }
      @import '~@/assets/css/animation/btns-move.scss';
    }
  }
</style>