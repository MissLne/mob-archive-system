<template>
  <div id="face-detail">
    <div class="container">
      <div class="img-box">
        <van-image :src="detailData.url" class="img"/>
      </div>
      <div class="input-box">
        <ul class="inf-list">
          <li v-for="(item, key) in inputsProps" :key="item.title" class="item">
            <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>
            <!-- 偷懒了，v-model直接绑定后台给的数据了 -->
            <Input
              v-model="detailData[key]"
              :required="item.required"
              :msg="item.msg"
            />
          </li>
        </ul>
      </div>
      <SingleBtn
        :name="'提交'"
        :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE' }"
        :isLoading="isBtnLoading"
        class="btn-margin"
        @click="submit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Input from '@/components/public-com/Input/Input.vue';
import SingleBtn from '@/components/public-com/Btn/SingleBtn.vue'
import Msg from '@/components/public-com/MsgBox/Msg';

@Component({
  components: {
    Input,
    SingleBtn,
  }
})
export default class FaceDetail extends Vue {
  @Prop() detailData!: FaceData;
  @Prop() fileId!: string;
  // 提交按钮状态
  private isBtnLoading: boolean = false;
  get isComplete() {
    return this.inputsProps.name.value !== '';
  }
  private readonly inputsProps: {[key: string]: any} = {
    name: { title: '名称', required: true, msg: '请输入姓名' },
    department: { title: '部门', required: false },
    position: { title: '职务', required: false },
    identity: { title: '身份ID', required: false },
  }
  created() {
    for (const key in this.inputsProps) {
      console.log(key)
      if (this.detailData[key])
        this.inputsProps[key].value = this.detailData[key];
    }
  }
  
  private submit() {
    if (!this.isComplete) return;
    this.isBtnLoading = true;
    this.$service.post('/api/api/face/faceInformationEntry', {
      ...this.detailData,
      id: this.detailData.uid,
    })
    .then(({data: res}: any) => {
      if (res.code === 200)
        Msg.success('人物信息完善成功')
      else throw Error()
    })
    .catch(() => {
      Msg.error('人物信息完善失败')
    })
    .finally(() => {
      this.isBtnLoading = false;
    })
  }
}
</script>

<style lang="scss">
  #face-detail {
    width: 700px;
    border-radius: 1px;
    padding: 0 25px;
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
      .img-box {
        align-self: center;
        display: flex;
        width: 540px;
        height: 333px;
        // margin: auto; 效果非常神奇！还是先不用了
        background-color: #84B8FC;
        border-radius: 12px;
        margin-bottom: 50px;
        .img {
          width: 250px;
          height: 250px;
          margin: auto; // 和上面的注释一样神奇
        }
      }
      .input-box {
        margin-bottom: auto;
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
      .btn-margin {
        margin: 0 39px;
      }
    }
    
  }
</style>