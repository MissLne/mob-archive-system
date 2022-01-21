<template>
  <div id="arch-detail">
    <des-head @handleClick="headClick">详情</des-head>
    <div class="slots"></div><!-- 占header的位置 -->

    <div v-if="detailData" class="container">
      <PreviewBox
        :picSrc="detailData.picSrc"
        :fileToken="detailData.fileToken"
        :fileType="detailData.fileType"
      />
      <ArchForm
        :inputsProps="inputsProps"
        :disabled="!isEditing"
        :fileId="detailData.fileId"
        :canRecognize="canRecognize"
      />
      <div 
        v-if="haveMetaData"
        class="go-meta-box"
      >
        <router-link
          :to="{ name: 'metaData', params: { status } }"
          class="go-meta"
        >查看元数据>></router-link>
      </div>

      <!-- 状态（0-著录，1-预归档，2-已归档，3-过期，4-回收站，5-销毁） -->
      <div v-if="status === 2" class="btns-box">
        <div style="height: 20px;"></div>
      </div>
      <div v-else-if="status === 4" class="btns-box">
        <CoupleBtns
          :leftName="'删除'"
          :rightName="'还原'"
          class="couple-margin"
          @leftClick="recycleBinOperation('删除', 'DestroyArchive')"
          @rightClick="recycleBinOperation('还原', 'RestoreArchive')"
        />
      </div>
      <div v-else class="btns-box">
        <transition name="btns-move" mode="out-in">
          <CoupleBtns
            v-if="!isEditing"
            :leftName="'删除'"
            :rightName="'编辑'"
            class="couple-margin"
            @leftClick="deleteFile"
            @rightClick="editFile"
          />
          
          <SingleBtn
            v-else
            :name="'保存'"
            :isLoading="isBtnLoading"
            class="single-margin"
            @click="saveFile"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { initMetaData } from '@/utils/utils-file';
import { downloadPicture, estimateFileType, isImage, isVideo } from '@/utils/picture';
import PermissionRequest from '@/utils/utils-request'
import { Dialog } from 'vant';
import Msg from '@/components/public-com/MsgBox/Msg';
import DesHead from '@/components/des-com/index/des-head.vue';
import PreviewBox from '@/components/public-com/Archive/PreviewBox.vue'
import ArchForm from '@/components/public-com/Archive/ArchForm.vue'
import CoupleBtns from '@/components/public-com/Btn/CoupleBtns.vue'
import SingleBtn from '@/components/public-com/Btn/SingleBtn.vue'
import { getArchiveDetail, updateArchive } from '@/services/archive'

@Component({
  name: 'ArchDetail',
  components: {
    DesHead,
    PreviewBox,
    ArchForm,
    CoupleBtns,
    SingleBtn
  }
})
export default class ArchDetail extends Vue {
  @Prop() archId!: number;
  // 页面详细数据
  private detailData: ArchItemData | null = null;
  // 该案卷的状态
  private status: number = 0;
  // select的内容
  get fondsIdentifier() { return this.$store.getters['selectData/fondsIdentifier'] }
  get dossierType() { return this.$store.getters['selectData/dossierType'] }
  get departmentNameTree() { return this.$store.getters['selectData/departmentNameTree'] }
  get isAllow() {
    return this.$store.getters.permissionList
  }
  // 密级列表
  get confidentialLevelArray() { return this.$store.state.selectData.confidentialLevelArray };
  // 保密期限列表
  get retentionPeriodArray() { return this.$store.state.selectData.retentionPeriodArray };
  
  // 提交按钮状态
  private isBtnLoading: boolean = false;

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
    topic: { title: '题名', required: true, msg: '请输入题名', type: 'textarea', value: '' },
    people: { title: '人物', required: false, type: 'textarea', value: '' },
    time: { title: '时间', required: false, type: 'date', value: '' },
    place: { title: '地点', required: false, type: 'textarea', value: '' },
    event: { title: '事件', required: false, type: 'textarea', value: '' },
    fondsIdentifierId: { title: '全宗号', required: true, msg: '请输入全宗号', type: 'select', value: '' },
    categoryCodeId: { title: '类别号', required: true, msg: '请输入类别号', type: 'select', value: '' },
    departmentId: { title: '部门', required: true, msg: '请输入部门', type: 'select', value: '' },
    confidentialLevel: { title: '密级', required: true, type: 'select', value: '' },
    retentionPeriod: { title: '保密期限', required: true, type: 'radio', value: 1 },
  }
  // 提交的表单信息
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
    obj['fondsIdentifierId'] = obj['fondsIdentifierId'].id
    obj['categoryCodeId'] = obj['categoryCodeId'].id
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
    obj['id'] = this.archId;

    return obj;
  }
  // header的数据和点击事件
  private headClick({clickType}: any) {
    if (clickType === 'left') {
      // this.$store.commit("setDetailPage")
      if (this.isEditing)
        this.isEditing = false;
      else
        this.$router.go(-1)
    }
  }

  // create初始化
  private created() {
    const get = async () => {
      const { data } = await getArchiveDetail({id: this.$route.params.id})
      const detailData = data.data
      const { status, fileType, fileToken, thumbnailFileToken } = detailData

      if (isImage(fileType)) {
        detailData['picSrc'] = await downloadPicture(thumbnailFileToken ?? fileToken);
      }
      else if (isVideo(fileType) && thumbnailFileToken) {
        detailData['picSrc'] = await downloadPicture(thumbnailFileToken);
      }
      else {
        detailData['picSrc'] = estimateFileType(fileType)
      }

      this.status = status
      this.detailData = detailData
      this.createSetting()
    }
    get()
  }
  createSetting() {
    const dData: any = this.detailData;
    const props = this.inputsProps;
    // 将获取的数据填入表单
    props.topic.value = dData.topic;
    props.people.value = dData.people;
    props.time.value = dData.time?.split('T')[0];
    props.place.value = dData.address;
    props.event.value = dData.event;
    props.retentionPeriod.value = dData.retentionPeriod;
    // 全宗号
    props.fondsIdentifierId.value = {
      id: dData.fondsIdentifierId,
      name: dData.fondsName,
    }
    // 类别号
    props.categoryCodeId.value = {
      id: dData.categoryCodeId,
      name: dData.categoryName,
    }
    // 部门
    props.departmentId.value = {
      id: dData.departmentId,
      name: dData.departmentName,
    }
    // 密级
    props.confidentialLevel.value = {
      id: dData.confidentialLevel,
      name: this.confidentialLevelArray[dData.confidentialLevel].name,
    }
    // 初始化元数据
    console.log(dData)
    initMetaData(this, 'metadataStructTreeBoList');
  }

  // 著录中状态--编辑
  editFile() {
    this.isEditing = true;
  }
  // 著录中状态--删除
  deleteFile() {
    Dialog.confirm({
      title: '确认删除',
      confirmButtonText: '是',
      cancelButtonText: '否'
    }).then(() => {
      PermissionRequest.post('DeleteArchive', '/api/api/archive/', {
        ids: [this.archId]
      }).then(({data}: any) => {
        if (data.code === 200) {
          Msg.success('删除成功')
          this.$router.back();
        }
        else throw Error();
      }).catch(err => {
        console.log(err)
        Msg.error('删除失败')
      })
    }).catch(() => {})
  }
  // 著录中状态--保存
  async saveFile() {
    // console.log(this.inputsValue)
    try {
      this.isBtnLoading = true;
      const { data } = await updateArchive(this.inputsValue)
      if(data.code === 200)
        Msg.success('保存成功')
      else
        throw Error()
    } catch (error) {
      console.log(error)
      Msg.error('保存失败')
    } finally {
      this.isBtnLoading = false;
      this.isEditing = false;
    }
  }
  // 回收站状态--操作
 async recycleBinOperation(chineseName: string, englishName: string) {
    try {
      // 确认窗口
      await Dialog.confirm({
        title: `确认${chineseName}吗？`
      })
      // 请求
      const {data} = await PermissionRequest.post(englishName, '/api/api/archive/', {
        ids: [this.archId]
      })
      
      if (data.code !== 200) throw Error(data.message)
      Msg.success(`${chineseName}成功`)
      this.$router.go(-1);

    } catch (error: any) {
      console.log(error)
      if (error !== 'cancel')
        Msg.error(`${chineseName}失败`)
    }
  }
  // 是否存在元数据
  get haveMetaData() {
    const type = this.detailData?.fileType.split('/')[0];
    return type === 'image' || type === 'audio' || type === 'video';
  }
  // 是否可以人脸识别
  get canRecognize() {
    return this.detailData?.fileType.split('/')[0] === 'image';
  }
}
</script>

<style lang="scss" scoped>
  #arch-detail {
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
      background-color: #fff;
      .go-meta-box {
        width: 100%;
        margin: 24px 0 42px;
        a {
          color: #8EBEFE;
        }
      }
      .btns-box {
        .couple-margin {
          margin-left: 40px;
          margin-right: 90px;
        }
        .single-margin {
          width: calc(100% - 40px);
        }
      }
      @import '~@/assets/css/animation/btns-move.scss';
    }
  }
</style>