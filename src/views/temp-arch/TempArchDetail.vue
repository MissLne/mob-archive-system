<template>
  <div id="temp-arch-detail">
    <button @click="getData">载入</button>
    <div class="container">
      <div class="preview-box">
        <span class="title">预览</span>
        <img src="" alt="">
      </div>
      <h3 class="title">基础信息</h3>
      <ul class="inf-list">
        <li v-for="item in inputsProps" :key="item.title" class="item">
          <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>

          <input
            v-if="item.type === 'text' || item.type === 'date'"
            class="item-input"
            :type="item.type ? item.type : text"
          >

          <div
            v-else-if="item.type === 'select'"
            class="item-input"
          >
            <Select class="input-select"/>
          </div>

          <div v-else class="item-input">
            <label><input type="radio" name="period">永久</label>
            <label><input type="radio" name="period">30年</label>
            <label><input type="radio" name="period">10年</label>            
          </div>
        </li>
        
        <!-- <li v-for="item in selectInputsProps" :key="item.title" class="item">
          <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>
          <select class="item-input">
          </select>
        </li> -->
        
        <li class="item">
          <span class="item-title">哈哈哈</span>
          <div class="item-input" @click="test">
            <Select class="input-select" :myData="testData.children"/>
          </div>
          <!-- v-model="item.value" -->
        </li>

      </ul>
      <div class="go-meta-box">
        <a href="#">查看元数据>></a>
      </div>
      <div class="btns-box">
        <button class="left-btn">删除</button>
        <button class="right-btn">著录</button>
      </div>
    </div>
    <!-- <div class="bg-box"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Select from '@/components/public-com/Select/Select.vue'

@Component({
  components: {
    Select
  }
})
export default class TempArchDetail extends Vue {
  @Prop() detailData!: ArchItemData;
  @Prop() fondsIdentifier!: any;
  @Prop() dossierType!: any;
  @Prop() departmentTree!: any;
  getData() {
    Promise.all([
        // 全宗号
        this.$service.get(`/api/api/fondsIdentifier/getFondsIdentifier?id=${this.detailData.departmentId}`),
        // 类别号
        this.$service.get(`/api/api/type/getDossierType?id=${this.detailData.departmentId}`),
        // 部门
        this.$service.get(`/api/api/department/getDepartmentTree?id=${this.detailData.departmentId}`),
      ])
      .then(values => {
        console.log(values)
      })
    console.log(this.detailData)
    const ptr = this.inputsProps;
  }
  private readonly inputsProps = {
    topic: { title: '题名', required: true, type: 'text' },
    people: { title: '人物', required: false, type: 'text' },
    time: { title: '时间', required: false, type: 'date' },
    place: { title: '地点', required: false, type: 'text' },
    event: { title: '事件', required: false, type: 'text' },
    fondsIdentifierId: { title: '全宗号', required: true, type: 'select', optionsData: [] },
    categoryCodeId: { title: '类别号', required: true, type: 'select', optionsData: [] },
    departmentId: { title: '部门', required: true, type: 'select', optionsData: [] },
    confidentialLevel: { title: '密级', required: true, type: 'select', optionsData: [] },
    retentionPeriod: { title: '保密期限', required: true, type: 'radio', optionsData: [] },
  }
  private spread = false;
  test() {
    this.spread = true;
  }
  testData =  {
        "id": -1,
        "categoryCode": null,
        "typeName": "root",
        "categoryType": 1,
        "children": [
            {
                "id": 25,
                "categoryCode": "23",
                "typeName": "校史",
                "categoryType": 1,
                "children": [
                    {
                        "id": 29,
                        "categoryCode": "33",
                        "typeName": "计院史",
                        "categoryType": 1,
                        "children": [
                            {
                                "id": 32,
                                "categoryCode": "49",
                                "typeName": "计科",
                                "categoryType": 1,
                                "children": null
                            },
                            {
                                "id": 33,
                                "categoryCode": "41",
                                "typeName": "软工",
                                "categoryType": 1,
                                "children": null
                            },
                            {
                                "id": 34,
                                "categoryCode": "42",
                                "typeName": "网工",
                                "categoryType": 1,
                                "children": null
                            }
                        ]
                    },
                    {
                        "id": 30,
                        "categoryCode": "34",
                        "typeName": "自院史",
                        "categoryType": 1,
                        "children": [
                          {
                              "id": 300,
                              "categoryCode": "41",
                              "typeName": "自然真美",
                              "categoryType": 1,
                              "children": null
                          },
                          {
                              "id": 301,
                              "categoryCode": "42",
                              "typeName": "自动化也是",
                              "categoryType": 1,
                              "children": null
                          }
                        ]
                    },
                    {
                        "id": 31,
                        "categoryCode": "35",
                        "typeName": "信院史",
                        "categoryType": 1,
                        "children": null
                    }
                ]
            },
            {
                "id": 35,
                "categoryCode": "36",
                "typeName": "秃头史",
                "categoryType": 1,
                "children": [
                    {
                        "id": 36,
                        "categoryCode": "37",
                        "typeName": "tu秃了",
                        "categoryType": 1,
                        "children": null
                    }
                ]
            }
        ]
  }
}
</script>

<style lang="scss">
  #temp-arch-detail {
    height: 1208px;
    border-radius: 1px;
    font-size: 28px;
    font-family: PingFang-SC-Regular;
    .container {
      width: 700px;
      height: 100%;
      box-sizing: border-box;
      padding: 18px 0 31px 40px;
      background-color: #fff;
      .preview-box {
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
            
          }
        }
        
      }
      .go-meta-box {
        width: 100%;
        margin-bottom: 40px;
      }
      .btns-box {
        display: flex;
        justify-content: space-between;
        margin-left: 40px;
        margin-right: 90px;
        font-size: 42px;
        .left-btn,
        .right-btn {
          width: 162px;
          height: 75px;
          border: none;
          border-radius: 8px;
        }
        .left-btn {
          background-color: #fff;
          color: rgba(255, 0, 0, 0.7);
          box-shadow: 0px 3px 7px 0px rgba(143, 143, 143, 0.35);
        }
        .right-btn {
          background-color: #85B8FD;
          color: #fff;
          box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        }
      }
    }
    .bg-box {
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      
      background: linear-gradient(180deg, #ECF2FE, #E9F1FE);
    }
  }
</style>