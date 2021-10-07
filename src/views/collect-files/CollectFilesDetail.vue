<template>
  <div id="collect-files-detail">
    <DesHead :headData="headData" @handleClick="headClick"/>
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
              style="z-index: 2;"
              class="item-input"
            >
              <span class="select-result">
                {{item.value}}
                <img src="@/assets/head/pulldown@2x.png" class="select-pulldown-icon">
              </span>
              
              <Select
                v-if="item.title === '类别'"
                v-model="item.value"
                class="selector"
                :myData="collectFilesType"
                :optionVariableName="'typeName'"
                :optionVariableKey="'id'"
              />
              <Select
                v-else
                v-model="item.value"
                class="selector"
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
          class="submit"
          :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE'}"
          @click="trySubmit"
        >提交</button>
      </div>
      <Alerts
        v-show="alertsData.isAlerts"
        :title="alertsData.title"
        @sureDelete="alertsData.sureHandle"
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
import Msg from '@/components/public-com/MsgBox/Msg';

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

  created() {
    console.log(this.detailData)
    if (this.detailData.fileName)
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
    sureHandle: function(){},
    alerts(title: string) {
      this.isAlerts = true;  
      this.title = title;
    }
  }
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
      this.alertsData.alerts('未提交的信息将会丢失');
      this.alertsData.sureHandle = function() {
        console.log(123);
        this.isAlerts = false;
      }
    }
  }

  // 提交部分
  trySubmit() {
    if (!this.isComplete) return;
    this.alertsData.alerts('是否确认提交');
    this.alertsData.sureHandle = function() {
      console.log(123);
    }
  }
  sureSubmit({type}: any) {
    this.alertsData.isAlerts = false;
    if (type === 'sure') this.submit();
  }
  private submit() {
    const fullFileData = {
      // "id": "资料文件的id（新增情况下不需要填写）",
      topic: this.inputsProps.topic.value,
      people: this.inputsProps.people.value,
      event: this.inputsProps.event.value,
      time: this.inputsProps.time.value,
      place: this.inputsProps.place.value,
      categoryId: this.inputsProps.categoryId.value,
      departmentId: this.inputsProps.departmentId.value,
      comment: this.inputsProps.comment.value,
      sourse: this.inputsProps.sourse.value,
      "fileId": this.detailData.fileId,
      "thumbnailFileId": this.detailData.thumbnailFileId,
      "zippedFileId": this.detailData.zippedImageFileId,
      // "attachmentIds": "附件（有传的话，要求传进来的要求是最新版本）"
    }
    this.$service.post('/api/api/collectedFile/addCollectedFile', fullFileData)
      .then(({data}: any) => {
        console.log('success!success!success!', data)
        if (data.code === 200) {
          this.nextDetail();
        }
        else
          throw Error('保存失败');
      })
      .catch((err: Error) => {
        MsgBox.error(err.message);
      })
  }
  @Emit('nextDetail')
  nextDetail() {
    console.log('xxxx')
  }
}
</script>

<style lang="scss">
  #collect-files-detail {
    width: 700px;
    height: 1208px;
    border-radius: 1px;
    margin: auto;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 700px;
      height: 100%;
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
              z-index: 1;
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
              .selector {
                z-index: 2;
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
  }
</style>