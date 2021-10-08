<template>
  <div id="collect-files-detail">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <div class="container">
      <div class="input-box">
        <div class="preview-box">
          <span class="preview-title">预览</span>
          <div class="preview-img-box">
            <img :src="detailData.picSrc" alt="" class="preview-img">
          </div>
        </div>
        <h3 class="title">基础信息</h3>
        <ul class="inf-list">
          <li v-for="item in inputsProps" :key="item.title" class="item">
            <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>
            <div v-if="item.type === 'text' || item.type === 'date'" class="item-box">
              <Input
                v-model="item.value"
                :type="item.type"
                :required="item.required"
                :msg="item.msg"
              />
              <!-- 人脸识别的图标 -->
              <!-- <img
                v-if="item.title === '人物'"
                class="face-recognition-icon"
                :src="canRecognize
                  ? require('@/assets/temp-arch/face-recognition.png')
                  : require('@/assets/temp-arch/manual-input.png')"
                @click="onRecognizing"
              > -->
            </div>
            <div
              v-else-if="item.type === 'select'"
              class="item-input"
            >
              <span class="select-result">
                {{item.value}}
                <img src="@/assets/head/pulldown@2x.png" class="select-pulldown-icon">
              </span>
              
              <Select
                v-if="item.title === '类别'"
                v-model="item.value"
                :myData="collectFilesType"
                :optionVariableName="'typeName'"
                :optionVariableKey="'id'"
              />
              <Select
                v-else
                v-model="item.value"
                :myData="departmentNameTree"
                :optionVariableName="'departmentName'"
                :optionVariableKey="'id'"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="submit-box">
        <button
          v-if="!isSubmitted"
          class="submit"
          :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE'}"
          @click="trySubmit"
        >提交</button>
        <button
          v-else
          class="submit"
          style="background-color: #D2E6FE;"
        >该资料已提交</button>
      </div>

      <div v-if="isSubmitted" class="disabled-mask"></div>

      <Alerts
        v-show="alertsData.isAlerts"
        :title="alertsData.title"
        @sureDelete="sureHandle"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import Select from '@/components/public-com/Select/Select.vue'
import Input from '@/components/public-com/Input/Input.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import DesHead from '@/components/des-com/index/des-head.vue';
import Alerts from '@/components/tools/alerts.vue';
import fileutils from '@/utils/fileutils';

@Component({
  components: {
    Select,
    Input,
    DesHead,
    Alerts
  }
})
export default class CollectFilesDetail extends Vue {
  @Prop() detailData!: UploadFileData;
  @Prop() collectFilesType: any;
  @Prop() departmentNameTree: any;
  get isComplete() {
    return this.inputsProps.topic.value !== '' && this.inputsProps.categoryId.value !== '';
  }
  private readonly inputsProps = {
    topic: { title: '名称', required: true, msg: '请输入姓名', type: 'text', value: '' },
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
    if (this.detailData.isSubmitted)
      this.isSubmitted = true;

    if (this.detailData.saveData)
      this.inputsValue = this.detailData.saveData;
    else if (this.detailData.fileName)
      this.inputsProps.topic.value = this.detailData.fileName;
  }

  /* private canRecognize: boolean = false;
  onRecognizing() {
    if (this.canRecognize) {
      console.log('when recognize', this.detailData)
      this.$service.get(`/api/api/face/faceRecognition/${this.detailData.fileId}`)
        .then(({data}: any) => {
          if (data.code !== 200) throw Error;
          this.passFaceData(data.data);
        })
        .catch((err: any) => {
          console.log(err);
          this.canRecognize = false;
          MsgBox.error('人脸识别失败', 1500);
        })
    }
    else {
      this.$router.push({name: 'faceRecognition'})
    }
  }
  @Emit('passFaceData')
  passFaceData(faceData: any) {
    return faceData;
  } */
  
  // 提示框
  private alertsData = {
    isAlerts: false,
    title: '',
    alerts(title: string) {
      this.isAlerts = true;  
      this.title = title;
    },
    close() {
      this.isAlerts = false;
    }
  }
  private sureHandle = ({type}: any) => {};
  // 头部数据与点击事件
  public headData: any = {
    title: '详情',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }
  public headClick({clickType}: any) {
    if (clickType === 'left') {
      // this.alertsData.alerts('未提交的信息将会丢失');
      // this.sureHandle = ({type}: any) => {
        // if (type === 'sure')
      this.detailData.saveData = this.inputsValue;
      this.$router.replace({name: 'collectFilesUpload'})
        // this.alertsData.close()
      // }
    }
  }
  // 提交部分
  trySubmit() {
    // if (!this.isComplete) return;
    this.alertsData.alerts('是否确认提交');
    this.sureHandle = ({type}: any) => {
      if (type === 'sure') this.submit()
      this.alertsData.close()
    }
  }
  private submit() {
    const fullFileData: any = {
      // "id": "资料文件的id（新增情况下不需要填写）",
      topic: this.inputsProps.topic.value,
      people: this.inputsProps.people.value,
      event: this.inputsProps.event.value,
      time: this.inputsProps.time.value 
        && this.inputsProps.time.value.split('/').join('-') + 'T00:00:00',
      place: this.inputsProps.place.value,
      categoryId:
        Number.parseInt(
          fileutils.recursionGetId(this.collectFilesType, this.inputsProps.categoryId.value, 'typeName', 'id')
        ),
        // this.inputsProps.categoryId.value,
      departmentId:
        Number.parseInt(
          fileutils.recursionGetId(this.departmentNameTree, this.inputsProps.departmentId.value, 'departmentName', 'id')
        ),
        // this.inputsProps.departmentId.value,
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

    this.$service.post(`/api/api/collectedFile/${urlSuffix}`, test)
      .then(({data}: any) => {
        console.log('success!success!success!', data)
        if (data.code === 200) {
          this.nextDetail();
          this.detailData.isSubmitted = true;
          this.detailData.saveData = this.inputsValue;
          /**
           * 此处如果返回id，将其赋给this.detailData.newFileId
           */
          MsgBox.success('提交成功');
        }
        else
          throw Error('提交失败');
      })
      .catch((err: Error) => {
        // MsgBox.error(err.message);
        MsgBox.error('提交失败');
      })
  }
  @Emit('nextDetail')
  nextDetail() {
  }
}
</script>

<style lang="scss">
  #collect-files-detail {
    width: 700px;
    height: 1335px;
    border-radius: 1px;
    margin: auto;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 700px;
      height: 1208px;
      box-sizing: border-box;
      padding: 18px 0 29px 40px;
      background-color: #fff;
      .input-box {
        .preview-box {
          $preview-box-height: 186px;
          display: flex;
          justify-content: space-between;
          height: $preview-box-height;
          margin-right: 75px;
          .preview-title {
            line-height: $preview-box-height;
          }
          .preview-img-box {
            overflow: hidden;
            display: flex;
            justify-content: center;
            width: 186px;
            height: $preview-box-height;
            .preview-img {
              height: 100%;
            }
          }
          
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
              .select-result {
                position: absolute;
                width: 430px;
                background-color: #fff; // 为了子元素的mix-blend-mode
                color: rgba(102, 102, 102, 1);
                height: $item-height;
                line-height: $item-height;
                .select-pulldown-icon {
                  position: absolute;
                  top: 30px;
                  right: 0;
                  width: 27px;
                  height: 15px;
                  mix-blend-mode: difference;
                }
              }
            }
            /* .item-box {
              position: relative;
              .face-recognition-icon {
                z-index: 2;
                position: absolute;
                top: 19px;
                right: 0;
                width: 35px;
                height: 35px;
              }
            } */
          }
        }
      }
      
      .submit-box {
        margin-right: 39px;
        .submit {
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
    .disabled-mask {
      position: absolute;
      z-index: 1000;
      width: 100%;
      height: 100%;
    }
  }
</style>