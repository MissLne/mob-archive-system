<template>
  <div id="face-recognition">
    <div class="container">
      <div class="input-box">
        <img src="" alt="" class="face-img">
        <ul class="inf-list">
          <li v-for="item in inputsProps" :key="item.title" class="item">
            <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>
            <Input
              v-model="item.value"
              :required="item.required"
              :msg="item.msg"
            />
          </li>
        </ul>
        {{test}}
      </div>
      <div class="submit-box">
        <button
          class="submit"
          :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE' }"
          @click="submit"
        >提交</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Input from '@/components/public-com/Input/Input.vue';
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    Input
  }
})
export default class FaceRecognition extends Vue {
  @Prop() faceData: any;
  @Prop() fileId!: string;
  test: any = '';
  get isComplete() {
    return this.inputsProps.topic.value !== '';
  }
  created() {
    this.$service.get(`/api/face/faceRecognition`)
  }
  private readonly inputsProps = {
    topic: { title: '名称', required: true, msg: '请输入姓名', value: '' },
    department: { title: '部门', required: false, value: '' },
    comment: { title: '职务', required: false, value: '' },
    identify: { title: '身份ID', required: false, value: '' },
  }
  private submit() {
    if (!this.isComplete) return;
    this.$service.post('/api/api/face/faceInformationEntry', {
      id: this.faceData.uid,
      name: this.faceData.name,
      department: this.inputsProps.department.value,
      identify: this.inputsProps.department.value,
      information: this.faceData.information,
    })
    .then(({data}: any) => {
      console.log('success!success!success!')
    })
  }
}
</script>

<style lang="scss">
  #face-recognition {
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
      padding: 47px 0 29px;
      background-color: #fff;
      text-align: center;
      .input-box {
        .face-img {
          width: 540px;
          height: 333px;
          background-color: #84B8FC;
          border-radius: 12px;
          margin-bottom: 50px;
        }
        .inf-list {
          margin-left: 40px;
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
          }
        }
      }
      .submit-box {
        margin: 0 39px;
        .submit {
          width: 100%;
          height: 75px;
          border: none;
          color: #FFF;
          background: #8EBEFE;
          box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
          border-radius: 8px;
          transition: background-color 0.15s ease-out
        }
      }
    }
    
  }
</style>