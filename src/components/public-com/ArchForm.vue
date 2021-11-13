<template>
  <div class="arch-form">
    <title class="title">基础信息</title>
    <ul class="form">
      <li v-for="item in inputsProps" :key="item.title" class="item">
        <!-- 标题 -->
        <span class="item-title" :class="{ required: item.required }">
          {{item.title}}
          <!-- {{item.value}}{{typeof item.value}} -->
        </span>
        <!-- 人脸识别图标，为了选择器能选到input才写到上面 -->
        <transition name="van-fade">
          <FaceRecognitionIcon
            v-if="!disabled && canRecognize && item.title === '人物'"
            class="face-icon"
            :fileId="fileId"
            @passFaceDataName="setFaceDataName"
          />
        </transition>
        <!-- 文本输入 -->
        <Input
          v-if="item.type === 'text'"
          v-model="item.value"
          :required="item.required"
          :msg="item.msg"
          :disabled="disabled"
        />
        <!-- 日期输入 -->
        <InputDate
          v-else-if="item.type === 'date'"
          v-model="item.value"
          :disabled="disabled"
        />
        <!-- 下拉选择 -->
        <div v-else-if="item.type === 'select'" class="item-input">
          <img
            src="@/assets/temp-arch/pulldown-gray@2x.png"
            class="select-pulldown-icon"
          />

          <Select
            v-if="item.title === '全宗号'"
            v-model="item.value"
            :myData="fondsIdentifier"
            :optionVariableName="'fondsName'"
            :optionVariableKey="'id'"
            :disabled="disabled"
          />
          <Select
            v-else-if="item.title === '类别号'"
            v-model="item.value"
            :myData="dossierType"
            :optionVariableName="'typeName'"
            :optionVariableKey="'id'"
            :disabled="disabled"
          />
          <Select
            v-else-if="item.title === '部门'"
            v-model="item.value"
            :myData="departmentNameTree"
            :optionVariableName="'departmentName'"
            :optionVariableKey="'id'"
            :disabled="disabled"
          />
          <Select
            v-else
            v-model="item.value"
            :myData="confidentialLevelArray"
            :optionVariableName="'name'"
            :optionVariableKey="'id'"
            :disabled="disabled"
          />
        </div>
        <!-- 多选框 -->
        <div v-else class="item-input all-radio-boxes">
          <!-- 虽然用index绑定不好，但是这是不会变的 -->
          <label
            v-for="(labelItem, labelIndex) in retentionPeriodArray"
            :key="labelIndex"
            class="radio-box"
          >
            <input
              v-model="item.value"
              type="radio"
              name="period"
              :value="labelIndex + 1"
              :disabled="disabled"
            />
            <i class="check-circle">✓</i>
            <span class="disabled-color-transition" :class="{'disabled-color': disabled}">{{ labelItem }}</span>
          </label>
        </div>
        <!-- 防止输入的遮罩层，写到下面才能挡住 -->
        <!-- <transition name="van-fade">
          <div class="disabled-mask" v-show="disabled"></div>
        </transition> -->
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Input from "@/components/public-com/Input/Input.vue";
import InputDate from "@/components/public-com/Input/InputDate.vue";
import Select from "@/components/public-com/Select/Select.vue";
import FaceRecognitionIcon from "@/views/face-recognition/FaceRecognitionIcon.vue";

@Component({
  components: {
    Input,
    InputDate,
    Select,
    FaceRecognitionIcon,
  },
})
export default class ArchForm extends Vue {
  // 数据
  @Prop() inputsProps: any;
  @Prop() fondsIdentifier!: Array<any>;
  @Prop() dossierType!: Array<any>;
  @Prop() departmentNameTree!: Array<any>;
  @Prop() confidentialLevelArray!: Array<any>;
  @Prop() retentionPeriodArray!: Array<any>;
  // 功能
  @Prop({default: false}) disabled!: boolean;
  @Prop({default: true}) canRecognize!: boolean;
  // 人脸识别用
  @Prop() fileId!: number;

  setFaceDataName(nameString: string) {
    console.log('receive!', nameString)
    if (this.inputsProps.people)
      this.inputsProps.people.value = nameString;
  }
}
</script>

<style lang="scss" scoped>
.arch-form {
  .title {
    margin: 15px 0 29px;
    font-size: 30px;
  }
  .form {
    margin-right: 53px;
    .item {
      $item-height: 73px;
      position: relative; // 为了disabled-mask
      display: flex;
      justify-content: space-between;
      .item-title {
        line-height: $item-height;
      }
      .required::after {
        // 用于显示必填红星
        content: "*";
        color: #ff0000;
      }
      .item-input {
        position: relative;
        width: 430px;
        height: $item-height;
        border: none;
        border-bottom: 3px solid #e1e1e1;
        .select-pulldown-icon {
          position: absolute;
          top: 30px;
          right: 0;
          width: 27px;
          height: 15px;
          // mix-blend-mode: difference;
        }
      }
      .all-radio-boxes {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .radio-box {
          input[type="radio"] {
            width: 0;
            height: 0;
            margin: 0;
          }
          input[type="radio"] + .check-circle {
            /* position: absolute;
                top: 10px;
                right: 10px; */
            display: inline-block;
            width: 38px;
            height: 38px;
            box-sizing: border-box;
            border: 4px solid #d1e5fe;
            margin-right: 11px;
            color: transparent;
            font-weight: bold;
            text-align: center;
            line-height: 32px;
            border-radius: 50%;
            transition: all 0.15s ease-out;
          }
          input[type="radio"]:checked + .check-circle {
            border-color: #89bcfe;
            color: #89bcfe;
          }
          span {
            color: #666666;
            line-height: inherit;
          }
        }
      }
      // 如果下一个元素是人脸识别图标，就加一点padding
      .face-icon {
        z-index: 2;
        position: absolute;
        top: 19px;
        right: 0;
        & + .input-wrap /deep/ input{
          padding-right: 45px;
        }
      }
    }
  }
}
// 禁用文本的颜色
.disabled-color {
  color: #bbb !important;
}
// 禁用文本变色过渡效果
.disabled-color-transition {
  transition: color 0.35s ease-out;
}
</style>