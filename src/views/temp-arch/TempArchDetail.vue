<template>
  <div id="temp-arch-detail">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <div class="container">
      <PreviewBox :picSrc="detailData.picSrc"/>
      <ArchForm
        :inputsProps="inputsProps"
        :fondsIdentifier="fondsIdentifier"
        :dossierType="dossierType"
        :departmentNameTree="departmentNameTree"
        :confidentialLevelArray="confidentialLevelArray"
        :retentionPeriodArray="retentionPeriodArray"
      />
        
      <div class="go-meta-box">
        <router-link
          :to="{ name: 'tempArchMetaData', params: { fileType: detailData.fileType.split('/')[0] }}"
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
import { recursionGetId, downloadPic, fillArchDetail, setPicByContentType } from '@/utils/utils-file';
import { Dialog } from 'vant';
import Msg from '@/components/public-com/MsgBox/Msg';
import DesHead from '@/components/des-com/index/des-head.vue';
import PreviewBox from '@/components/public-com/PreviewBox.vue'
import ArchForm from '@/components/public-com/ArchForm.vue'
import CoupleBtns from '@/components/public-com/Btn/CoupleBtns.vue'
import SingleBtn from '@/components/public-com/Btn/SingleBtn.vue'

@Component({
  components: {
    DesHead,
    PreviewBox,
    ArchForm,
    CoupleBtns,
    SingleBtn
  }
})
export default class TempArchDetail extends Vue {
  @Prop() detailData!: ArchItemData;
  // select的内容
  @Prop() fondsIdentifier!: Array<any>;
  @Prop() dossierType!: Array<any>;
  @Prop() departmentNameTree!: Array<any>;
  private readonly confidentialLevelArray = [
    {name: '公开', id: 0},
    {name: '内部', id: 1},
    {name: '绝密', id: 2},
    {name: '机密', id: 3},
    {name: '秘密', id: 4}
  ];
  private readonly retentionPeriodArray = [ '永久', '30年', '10年' ];

  private headData: any = {
    title: '详情',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }

  get isComplete() {
    /* for (let key in this.inputsProps) {
      
    } */
    return true
  }

  private readonly inputsProps = {
    topic: { title: '题名', required: true, msg: '请输入题名', type: 'text', value: '' },
    people: { title: '人物', required: false, type: 'text', value: '' },
    time: { title: '时间', required: false, type: 'date', value: '' },
    place: { title: '地点', required: false, type: 'text', value: '' },
    event: { title: '事件', required: false, type: 'text', value: '' },
    fondsIdentifierId: { title: '全宗号', required: true, msg: '请输入全宗号', type: 'select', value: '' },
    categoryCodeId: { title: '类别号', required: true, msg: '请输入类别号', type: 'select', value: '' },
    departmentId: { title: '部门', required: true, msg: '请输入部门', type: 'select', value: '' },
    confidentialLevel: { title: '密级', required: true, type: 'select', value: '' },
    retentionPeriod: { title: '保密期限', required: true, type: 'radio', value: 1 },
  }
  get inputsValue() {
    return null;
  }

  @Emit('nextDetail')
  nextDetail() {
    this.createSetting();
  }

  // ajax著录文件
  addFile() {
    /* this.$service.post('/api/api/archive/changeTemporaryArchiveToNormalArchive', this.inputsValue)
      .then(({data}: any) => {

      }) */
  }
  // ajax删除文件
  deleteFile() {
    Dialog.confirm({
      title: '确认删除',
      confirmButtonText: '是',
      cancelButtonText: '否'
    }).then(() => {
      this.$service.post('/api/api/archive/deleteTemporaryArchive', 
        [this.detailData.id]
      ).then(({data}: any) => {
        if (data.code === 200) {
          Msg.success('删除成功')
        }
        else throw Error();
      }).catch(err => {
        Msg.error('删除失败')
      })
    }).catch(() => {})
  }

  private created() {
    console.log('created', this.detailData, this.dossierType)
    this.createSetting();
  }
  createSetting() {
    if (this.detailData.fileName)
      this.inputsProps.topic.value = this.detailData.fileName;
  }

  private headClick({clickType}: any) {
    if (clickType === 'left') {
      this.$router.go(-1)
    }
  }

  private radioIsChecked(radioIndex: number) {
    console.log(radioIndex + 1 === this.inputsProps.retentionPeriod.value)
    return radioIndex + 1 === this.inputsProps.retentionPeriod.value;
  }
}
</script>

<style lang="scss">
  #temp-arch-detail {
    overflow: hidden;
    width: 700px;
    height: 1335px;
    // margin: auto;
    padding: 0 25px 20px;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    border-radius: 1px;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 700px;
      height: 1208px;
      box-sizing: border-box;
      padding: 18px 0 29px 40px;
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
      .single-margin {
        margin-right: 40px;
      }
      @import '~@/assets/css/animation/btns-move.scss';
    }
  }
</style>