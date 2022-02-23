<template>
  <div id="collect-files-detail">
    <div class="container">
      <PreviewBox @FileData="GetFileData" :falg="falg" />
      <ArchForm :inputsProps="inputsProps" :disabled="isdisabled" />
      <div class="submit-box">
        <button
          v-if="!isSubmitted"
          class="submit-btn"
          :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE' }"
          @click="trySubmit"
        >
          提交
        </button>
        <button
          v-else
          class="submit-btn"
          :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE' }"
          @click="trySubmit"
        >
          再次提交
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import Select from '@/components/public-com/Select/Select.vue'
import Input from '@/components/public-com/Input/Input.vue'
import MsgBox from '@/components/public-com/MsgBox/Msg'
import InputDate from '@/components/public-com/Input/InputDate.vue'
import PreviewBox from '@/components/public-com/Archive/PreviewBox.vue'
import ArchForm from '@/components/public-com/Archive/ArchForm.vue'
import { Dialog } from 'vant'
import { submitCollectedFile } from '@/services/collect-files'

@Component({
  name: 'CollectFilesDetailItem',
  components: {
    Select,
    Input,
    InputDate,
    PreviewBox,
    ArchForm,
  },
})
export default class CollectFilesDetailItem extends Vue {
  //   @Prop() detailData!: UploadFileData
  @Prop() theme!: Theme
  //表单元素是否更改
  private isdisabled: boolean = false
  private detailData = {
    isSubmitted: false,
    saveData: '1',
    fileName: 1,
    fileId: '',
    thumbnailFileId: '',
    newFileId: '',
    zippedImageFileId: '',
    picSrc: '',
    contentType: '',
  }
  //上传图标与资料的切换
  private falg = 0

  //资料信息
  private async GetFileData(data: any) {
    this.detailData.fileId = data.fileId
    this.detailData.thumbnailFileId = data.thumbnailFileId
    this.detailData.zippedImageFileId = data.zippedImageFileId
  }
  // select的内容
  get collectFilesType() {
    return this.$store.getters['selectData/collectFilesType']
  }
  get allDepartmentNameTree() {
    return this.$store.getters['selectData/allDepartmentNameTree']
  }
  get isComplete() {
    return (
      this.inputsProps.topic.value !== '' &&
      this.inputsProps.categoryId.value !== '' &&
      this.inputsProps.providerName.value !== '' &&
      this.inputsProps.providerPhone.value !== '' &&
      this.inputsProps.author.value !== ''
    )
  }
  private readonly inputsProps: { [key: string]: any } = {
    topic: {
      title: '名称',
      required: true,
      msg: '请输入题名',
      type: 'textarea',
      value: '',
    },
    people: { title: '人物', required: false, type: 'textarea', value: '' },
    event: { title: '事件', required: false, type: 'textarea', value: '' },
    time: { title: '时间', required: false, type: 'textarea', value: '' },
    place: { title: '地点', required: false, type: 'textarea', value: '' },
    categoryId: { title: '类别', required: true, type: 'select', value: '' },
    departmentId: { title: '部门', required: false, type: 'select', value: '' },
    comment: { title: '备注', required: false, type: 'textarea', value: '' },
    sourse: { title: '来源', required: false, type: 'textarea', value: '' },
    providerName: {
      title: '捐赠者',
      required: true,
      type: 'textarea',
      value: '',
    },
    providerPhone: {
      title: '捐赠者电话',
      required: true,
      type: 'textarea',
      value: '',
    },
    author: { title: '作者', required: true, type: 'textarea', value: '' },
  }
  get inputsValue() {
    const obj: { [key: string]: any } = {}
    for (const key in this.inputsProps) {
      obj[key] = this.inputsProps[key]
    }
    return obj
  }
  set inputsValue(newValue) {
    for (const key in this.inputsProps) {
      this.inputsProps[key] = newValue[key]
    }
  }

  private isSubmitted: boolean = false
  created() {
    console.log('detail-com is created!')
    this.createSetting()
  }
  createSetting() {
    // if (this.detailData.isSubmitted) this.isSubmitted = true
    // if (this.detailData.saveData) this.inputsValue = this.detailData.saveData
    // else if (this.detailData.fileName)
    //   this.inputsProps.topic.value = this.detailData.fileName
  }

  // 提交部分
  trySubmit() {
    if (!this.isComplete) return
    Dialog.confirm({
      title: '是否确认提交',
      cancelButtonText: '否',
      confirmButtonText: '是',
    })
      .then(() => {
        this.submit()
      })
      .catch(() => {})
  }
  private async submit() {
    const fullFileData: any = {
      // "id": "资料文件的id（新增情况下不需要填写）",
      topic: this.inputsProps.topic.value,
      people: this.inputsProps.people.value,
      themeId: this.theme,
      event: this.inputsProps.event.value,
      time:
        this.inputsProps.time.value &&
        this.inputsProps.time.value + 'T00:00:00',
      place: this.inputsProps.place.value,
      categoryId: (this.inputsProps.categoryId.value as any).id,
      departmentId: (this.inputsProps.departmentId.value as any).id,
      comment: this.inputsProps.comment.value,
      sourse: this.inputsProps.sourse.value,
      fileId: this.detailData.fileId,
      thumbnailFileId: this.detailData.thumbnailFileId,
      zippedFileId: this.detailData.zippedImageFileId,
      // "attachmentIds": "附件（有传的话，要求传进来的要求是最新版本）"
      providerName: this.inputsProps.providerName.value,
      providerPhone: this.inputsProps.providerPhone.value,
      author: this.inputsProps.author.value,
    }
    // 如果themeId是0，说明未选择
    if (fullFileData.themeId === 0) fullFileData.themeId = undefined

    let urlSuffix = 'addCollectedFile'
    if (this.detailData.newFileId) {
      urlSuffix = 'updateCollectedFile'
      fullFileData.id = this.detailData.newFileId
    }

    const test: any = {}
    for (const key in fullFileData) {
      if (fullFileData[key] && fullFileData[key] !== '')
        test[key] = fullFileData[key]
    }
    this.isSubmitted = true
    this.falg++
    try {
      const { data } = await submitCollectedFile(urlSuffix, test)
      console.log('success!success!success!', data)
      if (data.code === 200) {
        this.submitFile()
        this.$set(this.detailData, 'isSubmitted', true)
        this.$set(this.detailData, 'saveData', this.inputsValue)
        /**
         * 此处如果返回id，将其赋给this.detailData.newFileId
         */
        MsgBox.success('提交成功')
      } else if (data.code === 400) throw Error(data.message)
      else throw Error('提交失败')
    } catch (error) {
      MsgBox.error(error.message.split('，')[0])
    }
  }
  // 文件被成功著录或删除
  @Emit('submitFile')
  submitFile() {}
}
</script>

<style lang="scss">
#collect-files-detail {
  overflow: hidden;
  width: 700px;
  min-height: 1335px;
  border-radius: 1px;
  // margin: auto;
  padding: 0 25px 20px;
  font-size: 28px;
  font-family: PingFang-SC-Regular;
  .container {
    width: 700px;
    min-height: 1208px;
    box-sizing: border-box;
    padding: 18px 0 29px 40px;
    /* 用于头部占位的margin，因为外层margin会影响van-calendar的位置，被迫加载内层 */
    margin-top: 24px;
    background-color: #fff;
    .submit-box {
      margin-top: 50px;
      margin-right: 39px;
      .submit-btn {
        width: 100%;
        height: 75px;
        border: none;
        color: #fff;
        box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        border-radius: 8px;
        transition: background-color 0.15s ease-out;
      }
    }
  }
}
</style>
