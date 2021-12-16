<template>
  <div id="collect-files-detail">
    <div class="container">
      <PreviewBox
        :picSrc="detailData.picSrc"
        :fileType="detailData.contentType"
      />
      <ArchForm
        :inputsProps="inputsProps"
        :disabled="isSubmitted"
      />
      <div class="submit-box">
        <button
          v-if="!isSubmitted"
          class="submit-btn"
          :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE'}"
          @click="trySubmit"
        >提交</button>
        <button
          v-else
          class="submit-btn"
          style="background-color: #D2E6FE;"
        >该资料已提交</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import Select from '@/components/public-com/Select/Select.vue'
import Input from '@/components/public-com/Input/Input.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { recursionGetId } from '@/utils/utils-file';
import InputDate from '@/components/public-com/Input/InputDate.vue';
import PreviewBox from '@/components/public-com/PreviewBox.vue';
import ArchForm from '@/components/public-com/ArchForm.vue'
import { Dialog } from 'vant'
import { submitCollectedFile } from '@/services/CollectFiles';

@Component({
  name: 'CollectFilesDetailItem',
  components: {
    Select,
    Input,
    InputDate,
    PreviewBox,
    ArchForm
  }
})
export default class CollectFilesDetailItem extends Vue {
  @Prop() detailData!: UploadFileData;
  // select的内容
  get collectFilesType() { return this.$store.getters['selectData/collectFilesType'] };
  get allDepartmentNameTree() { return this.$store.getters['selectData/allDepartmentNameTree'] };
  get isComplete() {
    return this.inputsProps.topic.value !== '' && this.inputsProps.categoryId.value !== '';
  }
  private readonly inputsProps = {
    topic: { title: '名称', required: true, msg: '请输入题名', type: 'text', value: '' },
    people: { title: '人物', required: false, type: 'text', value: '' },
    event: { title: '事件', required: false, type: 'text', value: '' },
    time: { title: '时间', required: false, type: 'date', value: '' },
    place: { title: '地点', required: false, type: 'text', value: '' },
    categoryId: { title: '类别', required: true, type: 'select', value: '' },
    departmentId: { title: '部门', required: false, type: 'select', value: '' },
    comment: { title: '备注', required: false, type: 'text', value: '' },
    sourse: { title: '来源', required: false, type: 'text', value: '' },
  }
  get inputsValue() {
    return {
      topic: this.inputsProps.topic,
      people: this.inputsProps.people,
      event: this.inputsProps.event,
      time: this.inputsProps.time,
      place: this.inputsProps.place,
      categoryId: this.inputsProps.categoryId,
      departmentId: this.inputsProps.departmentId,
      comment: this.inputsProps.comment,
      sourse: this.inputsProps.sourse,
    }
  }
  set inputsValue(newValue) {
    this.inputsProps.topic = newValue.topic;
    this.inputsProps.people = newValue.people;
    this.inputsProps.event = newValue.event;
    this.inputsProps.time = newValue.time;
    this.inputsProps.place = newValue.place;
    this.inputsProps.categoryId = newValue.categoryId;
    this.inputsProps.departmentId = newValue.departmentId;
    this.inputsProps.comment = newValue.comment;
    this.inputsProps.sourse = newValue.sourse;
  }

  private isSubmitted: boolean = false;
  created() {
    console.log('detail-com is created!')
    this.createSetting();
  }
  createSetting() {
    if (this.detailData.isSubmitted)
      this.isSubmitted = true;
    if (this.detailData.saveData)
      this.inputsValue = this.detailData.saveData;
    else if (this.detailData.fileName)
      this.inputsProps.topic.value = this.detailData.fileName;
  }
  
  // 提交部分
  trySubmit() {
    if (!this.isComplete) return;
    Dialog.confirm({
      title: '是否确认提交',
      cancelButtonText: '否',
      confirmButtonText: '是'
    }).then(() => {
      this.submit()
    }).catch(() => {})

  }
  private async submit() {
    const fullFileData: any = {
      // "id": "资料文件的id（新增情况下不需要填写）",
      topic: this.inputsProps.topic.value,
      people: this.inputsProps.people.value,
      event: this.inputsProps.event.value,
      time: this.inputsProps.time.value 
        && this.inputsProps.time.value + 'T00:00:00',
      place: this.inputsProps.place.value,
      categoryId:
        Number.parseInt(
          recursionGetId(this.collectFilesType, this.inputsProps.categoryId.value, 'typeName', 'id')
        ),
      departmentId:
        Number.parseInt(
          recursionGetId(this.allDepartmentNameTree, this.inputsProps.departmentId.value, 'departmentName', 'id')
        ),
      comment: this.inputsProps.comment.value,
      sourse: this.inputsProps.sourse.value,
      "fileId": this.detailData.fileId,
      "thumbnailFileId": this.detailData.thumbnailFileId,
      "zippedFileId": this.detailData.zippedImageFileId,
      // "attachmentIds": "附件（有传的话，要求传进来的要求是最新版本）"
    }

    let urlSuffix = 'addCollectedFile'
    if (this.detailData.newFileId) {
      urlSuffix = 'updateCollectedFile'
      fullFileData.id = this.detailData.newFileId
    }

    const test: any = {};
    for (const key in fullFileData) {
      if (fullFileData[key] && fullFileData[key] !== '') test[key] = fullFileData[key];
    }
    
    try {
      const { data } = await submitCollectedFile(urlSuffix, test);
      console.log('success!success!success!', data)
      if (data.code === 200) {
        this.submitFile();
        this.$set(this.detailData, 'isSubmitted', true);
        this.$set(this.detailData, 'saveData', this.inputsValue);
        /**
         * 此处如果返回id，将其赋给this.detailData.newFileId
         */
        MsgBox.success('提交成功');
      }
      else if (data.code === 400)
        throw Error(data.message);
      else
        throw Error('提交失败');
    } catch (error: any) {
      MsgBox.error(error.message.split('，')[0]);
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
    height: 1335px;
    border-radius: 1px;
    // margin: auto;
    padding: 0 25px 20px;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    .container {
      width: 700px;
      height: 1208px;
      box-sizing: border-box;
      padding: 18px 0 29px 40px;
      /* 用于头部占位的margin，因为外层margin会影响van-calendar的位置，被迫加载内层 */
      margin-top: 124px;
      background-color: #fff;
      .input-box {
        .title {
          margin: 15px 0 29px;
          font-size: 30px;
        }
        .inf-list {
          margin-right: 53px;
          .item {
            $item-height: 73px;
            display: flex;
            justify-content: space-between;
            .item-title {
              line-height: $item-height;
            }
            .required::after { // 用于显示必填红星
              content: '*';
              color: #FF0000;
            }
            .item-input {
              width: 430px;
              height: $item-height;
              border: none;
              border-bottom: 3px solid #E1E1E1;
              .select-pulldown-icon {
                position: absolute;
                top: 30px;
                right: 0;
                width: 27px;
                height: 15px;
              }
            }
          }
        }
      }
      .submit-box {
        margin-top: 50px;
        margin-right: 39px;
        .submit-btn {
          width: 100%;
          height: 75px;
          border: none;
          color: #FFF;
          box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
          border-radius: 8px;
          transition: background-color 0.15s ease-out
        }
      }
    }
  }
</style>