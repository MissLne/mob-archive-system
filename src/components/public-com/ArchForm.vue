<template>
  <div class="arch-form">
    <title class="title">基础信息</title>
    <ul class="form">
      <li v-for="item in inputsProps" :key="item.title" class="item">
        <span class="item-title" :class="{ required: item.required }">{{
          item.title
        }}</span>
        <Input
          v-if="item.type === 'text'"
          v-model="item.value"
          :required="item.required"
          :msg="item.msg"
        />
        <InputDate v-else-if="item.type === 'date'" v-model="item.value" />
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
          />
          <Select
            v-else-if="item.title === '类别号'"
            v-model="item.value"
            :myData="dossierType"
            :optionVariableName="'typeName'"
            :optionVariableKey="'id'"
          />
          <Select
            v-else-if="item.title === '部门'"
            v-model="item.value"
            :myData="departmentNameTree"
            :optionVariableName="'departmentName'"
            :optionVariableKey="'id'"
          />
          <Select
            v-else
            v-model="item.value"
            :myData="confidentialLevelArray"
            :optionVariableName="'name'"
            :optionVariableKey="'id'"
          />
        </div>

        <div v-else class="item-input">
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
            />
            <i class="check-circle">✓</i>
            <span>{{ labelItem }}</span>
          </label>
        </div>

        <!-- 写到下面才能挡住 -->
        <transition name="van-fade">
          <div class="disabled-mask" v-show="disabled"></div>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Input from "@/components/public-com/Input/Input.vue";
import InputDate from "@/components/public-com/Input/InputDate.vue";
import Select from "@/components/public-com/Select/Select.vue";

@Component({
  components: {
    Input,
    InputDate,
    Select,
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
      .radio-box {
        line-height: $item-height;
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
          margin-right: 34px;
        }
      }
      .disabled-mask {
        z-index: 2;
        position: absolute;
        right: 0;
        width: 430px;
        height: 100%;
        background: rgba(255, 255, 255, 0.4);
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
</style>