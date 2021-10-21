<template>
  <div id="arch-detail">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <div v-if="detailData" class="container">
      <PreviewBox
        :picSrc="detailData.picSrc"
        :fileToken="detailData.fileToken"
        :fileType="detailData.fileType"
      />
      <ArchForm
        :inputsProps="inputsProps"
        :fondsIdentifier="fondsIdentifier"
        :dossierType="dossierType"
        :departmentNameTree="departmentNameTree"
        :confidentialLevelArray="confidentialLevelArray"
        :retentionPeriodArray="retentionPeriodArray"
        :disabled="!isEditing"
        :fileId="detailData.fileId"
      />
      <div 
        v-if="haveMetaData"
        class="go-meta-box"
      >
        <router-link
          :to="{ name: 'archMetaData' }"
          class="go-meta"
        >查看元数据>></router-link>
      </div>

      <transition name="btns-move" mode="out-in">
        <CoupleBtns
          v-if="!isEditing"
          :leftName="'删除'"
          :rightName="'编辑'"
          class="couple-margin"
          @leftClick="deleteFile"
          @rightClick="editFile"
        />
        
        <div v-else class="single-margin">
          <SingleBtn
            :name="'保存'"
            @click="saveFile"
          />
        </div>
      </transition>

    </div>
    <!-- <div class="bg-box"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { recursionGetId, downloadPic, fillArchDetail, setPicByContentType, initMetaData } from '@/utils/utils-file';
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
  @Prop() archId!: number;
  private detailData: ArchItemData | null = null;
  // select的内容
  private fondsIdentifier: Array<any> = [];
  private dossierType: Array<any> = [];
  private departmentNameTree: Array<any> = [];
  get isAllow() {
    return this.$store.getters.permissionList
  }
  // 密级列表
  private readonly confidentialLevelArray = [
    {name: '公开', id: 0},
    {name: '内部', id: 1},
    {name: '绝密', id: 2},
    {name: '机密', id: 3},
    {name: '秘密', id: 4}
  ];
  // 保密期限列表
  private readonly retentionPeriodArray = [ '永久', '30年', '10年' ];

  // 是否正在编辑
  private isEditing: boolean = false;

  // 表单必填项是否完成
  get isComplete() {
    // 用循环失效，直接暴力写法了
    return this.inputsProps.topic.value
      && this.inputsProps.fondsIdentifierId.value
      && this.inputsProps.categoryCodeId.value
      && this.inputsProps.departmentId.value
      && this.inputsProps.confidentialLevel.value
      && this.inputsProps.retentionPeriod.value
  }
  // 表单属性
  private readonly inputsProps: {[key: string]: any} = {
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
  // 提交表单信息
  get inputsValue() {
    const obj: {[key: string]: any} = {};
    const props = this.inputsProps;

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
    obj['fondsIdentifierId'] = recursionGetId(this.fondsIdentifier, obj['fondsIdentifierId'], 'fondsName', 'id');
    obj['categoryCodeId'] = recursionGetId(this.dossierType, obj['categoryCodeId'], 'typeName', 'id');
    obj['departmentId'] = recursionGetId(this.departmentNameTree, obj['departmentId'], 'departmentName', 'id');
    obj['confidentialLevel'] = recursionGetId(this.confidentialLevelArray, obj['confidentialLevel'], 'name', 'id');

    obj['metadata'] = (
      [...(this.$store.state.metaData.flatArr), ...(specialMeta)] as Array<MetaDataItem>
    )
      .filter(value => value.metadataValue)
      .map((value) => {
        let { id, metadataValue, metadataName } = value
        if (metadataName.slice(-2) === '时间')
          metadataValue += 'T00:00:00'
        return { metadataId: id, metadataValue }
      }
    )
    obj['id'] = this.archId;

    return obj;
  }

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
  private created() {
    // 获取详细数据
    this.$service.get(`/api/api/archive/getArchiveDetail?id=${this.$route.params.id}`)
      .then(({data: res}: {data: any}) => {
        console.log('archDetailData', res);
        this.detailData = res.data;

        if (!this.detailData) return;

        if ((this.detailData.fileType as string).split('/')[0] === 'image' || 
        (this.detailData.fileType as string).split('/')[0] === 'video') {
          if (this.detailData.thumbnailFileToken)
            return downloadPic(this.detailData.thumbnailFileToken, this.detailData.fileType)
          else if (this.detailData.fileToken)
            return downloadPic(this.detailData.fileToken, this.detailData.fileType)
        }
        else
          return setPicByContentType(this.detailData.fileType as string)
      })
      .then((res: any) => {
        if (this.detailData)
          this.$set(this.detailData, 'picSrc', res);
        this.createSetting()
      })

    // 设置select菜单的内容
    this.fondsIdentifier = JSON.parse(localStorage.getItem('fondsIdentifier') as string)
    this.dossierType = JSON.parse(localStorage.getItem('dossierType') as string)
    this.departmentNameTree = JSON.parse(localStorage.getItem('departmentNameTree') as string)

  }
  createSetting() {
    const dData = this.detailData;
    const props = this.inputsProps;
    // 将获取的数据填入表单
    fillArchDetail(dData, this.inputsProps);
    // 获取的全宗号是数字，转为对应的字符
    props.fondsIdentifierId.value = 
      recursionGetId(this.fondsIdentifier, props.fondsIdentifierId.value, 'fondsIdentifier', 'fondsName');
    // 获取的密级是数字，转为对应的字符
    props.confidentialLevel.value =
      this.confidentialLevelArray[props.confidentialLevel.value].name;
    // 初始化元数据
    console.log(dData)
    initMetaData(this, 'metadataStructTreeBoList');
  }

  // 编辑
  editFile() {
    this.isEditing = true;
  }
  // 删除
  deleteFile() {
    Dialog.confirm({
      title: '确认删除',
      confirmButtonText: '是',
      cancelButtonText: '否'
    }).then(() => {
      let queryStr;
      if (this.isAllow('managerDeleteArchive') !== -1)
        queryStr = 'managerDeleteArchive';
      else if (this.isAllow('userDeleteArchive') !== -1)
        queryStr = 'userDeleteArchive';
      else
        return;
      
      this.$service.post(`/api/api/archive/${queryStr}`, {
        ids: [this.archId]
      }).then(({data}: any) => {
        if (data.code === 200) {
          Msg.success('删除成功')
          this.$router.back();
        }
        else throw Error();
      }).catch(err => {
        Msg.error('删除失败')
      })
    }).catch(() => {})
  }
  // 保存
  saveFile() {
    console.log(this.inputsValue)
    this.$service.post('/api/api/archive/updateArchive', this.inputsValue)
      .then(({data: res}: any) => {
        console.log(res)
        if(res.code === 200)
          Msg.success('保存成功')
        else
          throw Error()
      })
      .catch((err: any) => {
        console.log(err)
        Msg.error('保存失败')
      })
    this.isEditing = false;
  }

  // 是否存在元数据
  get haveMetaData() {
    const type = this.detailData?.fileType.split('/')[0];
    return type === 'image' || type === 'audio' || type === 'video';
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
  #arch-detail {
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