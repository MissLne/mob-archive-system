<template>
  <div id="arch-detail">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <div v-if="detailData" class="container">
      <div class="input-box">
        <div class="preview-box">
          <span class="preview-title">预览</span>
          <div class="preview-img-box">
            <img 
              v-if="detailData.picSrc"
              :src="detailData.picSrc"
              class="preview-img"
            >
          </div>
        </div>
        <h3 class="title">基础信息</h3>
        <ul class="inf-list">
          <li v-for="item in inputsProps" :key="item.title" class="item">
            <span class="item-title" :class="{ 'required': item.required }">{{item.title}}</span>
              <Input
                v-if="item.type === 'text'"
                v-model="item.value"
                :required="item.required"
                :msg="item.msg"
              />
              <InputDate
                v-else-if="item.type === 'date'"
                v-model="item.value"
              />
              <div
                v-else-if="item.type === 'select'"
                class="item-input"
              >
                <img src="@/assets/temp-arch/pulldown-gray@2x.png" class="select-pulldown-icon">
                
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
                >
                <i class="check-circle">✓</i>
                <span>{{labelItem}}</span>
              </label>
            </div>

            <!-- 写到下面才能挡住 -->
            <transition name="van-fade">
              <div class="disabled-mask" v-show="!isEditing"></div>
            </transition>
          </li>
        </ul>
      </div>
      <div 
        v-if="haveMetaData"
        class="go-meta-box"
      >
        <router-link
          :to="{ name: 'archMetaData' }"
          class="go-meta"
        >查看元数据>></router-link>
      </div>

      <transition name="btns-move" mode="out-in">
        <div v-if="!isEditing" class="btns-box" key="box1">
          <button
            class="left-btn"
            @click="deleteFile"
          >删除</button>
          <button
            class="right-btn"
            :style="{ 'background-color': isComplete ? '#8EBEFE' : '#D2E6FE'}"
            @click="editFile"
          >编辑</button>
        </div>
        
        <div v-else class="btns-box" key="box2">
          <button class="single-save-btn" @click="saveFile">保存</button>
        </div>
      </transition>

    </div>
    <!-- <div class="bg-box"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import Select from '@/components/public-com/Select/Select.vue'
import Input from '@/components/public-com/Input/Input.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import DesHead from '@/components/des-com/index/des-head.vue';
import { recursionGetId, downloadPic, fillArchDetail, setPicByContentType } from '@/utils/fileUtils';
import InputDate from '@/components/public-com/Input/InputDate.vue';
import { Dialog } from 'vant';
import Msg from '@/components/public-com/MsgBox/Msg';
import metaData from '@/store/modules/meta-data';

@Component({
  components: {
    Select,
    Input,
    DesHead,
    InputDate
  }
})
export default class TempArchDetail extends Vue {
  @Prop() archId!: number;
  private detailData: ArchItemData | null = null;
  // select的内容
  private fondsIdentifier: Array<any> = [];
  private dossierType: Array<any> = [];
  private departmentNameTree: Array<any> = [];
  get isAllow() {
    return this.$store.getters.permissionList
  }
  // 密级列表
  private readonly confidentialLevelArray = [
    {name: '公开', id: 0},
    {name: '内部', id: 1},
    {name: '绝密', id: 2},
    {name: '机密', id: 3},
    {name: '秘密', id: 4}
  ];
  // 保密期限列表
  private readonly retentionPeriodArray = [ '永久', '30年', '10年' ];

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
    topic: { title: '题名', required: true, msg: '请输入题名', type: 'text', value: '' },
    people: { title: '人物', required: false, type: 'text', value: '' },
    time: { title: '时间', required: false, type: 'date', value: '' },
    place: { title: '地点', required: false, type: 'text', value: '' },
    event: { title: '事件', required: false, type: 'text', value: '' },
    fondsIdentifierId: { title: '全宗号', required: true, msg: '请输入全宗号', type: 'select', value: '' },
    categoryCodeId: { title: '类别号', required: true, msg: '请输入类别号', type: 'select', value: '' },
    departmentId: { title: '部门', required: true, msg: '请输入部门', type: 'select', value: '' },
    confidentialLevel: { title: '密级', required: true, type: 'select', value: '' },
    retentionPeriod: { title: '保密期限', required: true, type: 'radio', value: 1 },
  }
  // 提交表单信息
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
    obj['fondsIdentifierId'] = recursionGetId(this.fondsIdentifier, obj['fondsIdentifierId'], 'fondsName', 'id');
    obj['categoryCodeId'] = recursionGetId(this.dossierType, obj['categoryCodeId'], 'typeName', 'id');
    obj['departmentId'] = recursionGetId(this.departmentNameTree, obj['departmentId'], 'departmentName', 'id');
    obj['confidentialLevel'] = recursionGetId(this.confidentialLevelArray, obj['confidentialLevel'], 'name', 'id');

    obj['metadata'] = (
      [...(this.$store.state.metaData.flatArr), ...(specialMeta)] as Array<MetaDataItem>
    )
      .filter(value => value.metadataValue)
      .map((value) => {
        let { id, metadataValue, metadataName } = value
        if (metadataName.slice(-2) === '时间')
          metadataValue += 'T00:00:00'
        return { metadataId: id, metadataValue }
      }
    )
    obj['id'] = this.archId;

    return obj;
  }

  private headData: any = {
    title: '详情',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }
  private created() {
    // 获取详细数据
    this.$service.get(`/api/api/archive/getArchiveDetail?id=${this.$route.params.id}`)
      .then(({data: res}: {data: any}) => {
        console.log('archDetailData', res);
        this.detailData = res.data;

        if (!this.detailData) return;

        if ((this.detailData.fileType as string).split('/')[0] === 'image' || 
        (this.detailData.fileType as string).split('/')[0] === 'video') {
          if (this.detailData.thumbnailFileToken)
            return downloadPic(this.detailData.thumbnailFileToken, this.detailData.fileType)
          else if (this.detailData.fileToken)
            return downloadPic(this.detailData.fileToken, this.detailData.fileType)
        }
        else
          return setPicByContentType(this.detailData.fileType as string)
      })
      .then((res: any) => {
        if (this.detailData)
          this.$set(this.detailData, 'picSrc', res);
        this.createSetting()
      })

    // 设置select菜单的内容
    this.fondsIdentifier = JSON.parse(localStorage.getItem('fondsIdentifier') as string)
    this.dossierType = JSON.parse(localStorage.getItem('dossierType') as string)
    this.departmentNameTree = JSON.parse(localStorage.getItem('departmentNameTree') as string)

  }
  createSetting() {
    const dData = this.detailData;
    const props = this.inputsProps;
    // 将获取的数据填入表单
    fillArchDetail(dData, this.inputsProps);
    // 获取的全宗号是数字，转为对应的字符
    props.fondsIdentifierId.value = 
      recursionGetId(this.fondsIdentifier, props.fondsIdentifierId.value, 'fondsIdentifier', 'fondsName');
    // 获取的密级是数字，转为对应的字符
    props.confidentialLevel.value =
      this.confidentialLevelArray[props.confidentialLevel.value].name;
    // 初始化元数据
      this.$store.commit('metaData/setMetaDataTree', {
        metaData: ((dData as any).metadataStructTreeBoList as Array<MetaDataItem>)
          .filter(value => {
            const name = value.metadataName;
            return name !== '人物'
              && name !== '时间'
              && name !== '地点'
              && name !== '事件'
          }),
        fileType: (dData as any).fileType.split('/')[0],
      });
  }

  // 编辑
  editFile() {
    this.isEditing = true;
  }
  // 删除
  deleteFile() {
    Dialog.confirm({
      title: '确认删除',
      confirmButtonText: '是',
      cancelButtonText: '否'
    }).then(() => {
      let queryStr;
      if (this.isAllow('managerDeleteArchive') !== -1)
        queryStr = 'managerDeleteArchive';
      else if (this.isAllow('userDeleteArchive') !== -1)
        queryStr = 'userDeleteArchive';
      else
        return;
      
      this.$service.post(`/api/api/archive/${queryStr}`, {
        ids: [this.archId]
      }).then(({data}: any) => {
        if (data.code === 200) {
          Msg.success('删除成功')
          this.$router.back();
        }
        else throw Error();
      }).catch(err => {
        Msg.error('删除失败')
      })
    }).catch(() => {})
  }
  // 保存
  saveFile() {
    console.log(this.inputsValue)
    this.$service.post('/api/api/archive/updateArchive', this.inputsValue)
      .then(({data: res}: any) => {
        console.log(res)
        if(res.code === 200)
          Msg.success('保存成功')
        else
          throw Error()
      })
      .catch((err: any) => {
        console.log(err)
        Msg.error('保存失败')
      })
    this.isEditing = false;
  }

  // 是否存在元数据
  get haveMetaData() {
    const type = this.detailData?.fileType.split('/')[0];
    return type === 'image' || type === 'audio' || type === 'video';
  }

  private headClick({clickType}: any) {
    if (clickType === 'left') {
      this.$router.go(-1)
    }
  }

  private radioIsChecked(radioIndex: number) {
    console.log(radioIndex + 1 === this.inputsProps.retentionPeriod.value)
    return radioIndex + 1 === this.inputsProps.retentionPeriod.value;
  }
}
</script>

<style lang="scss">
  #arch-detail {
    overflow: hidden;
    width: 700px;
    height: 1335px;
    border-radius: 1px;
    // margin: auto;
    padding: 0 25px 20px;
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
        .title {
          margin: 15px 0 29px;
          font-size: 30px;
        }
        .inf-list {
          margin-right: 53px;
          .item {
            $item-height: 73px;
            position: relative; // 为了disabled-mask
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
              position: relative;
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
                // mix-blend-mode: difference;
              }
            }
            .radio-box {
              line-height: $item-height;
              input[type=radio] {
                width: 0;
                height: 0;
                margin: 0;
              }
              input[type=radio] + .check-circle {
                /* position: absolute;
                top: 10px;
                right: 10px; */
                display: inline-block;
                width: 38px;
                height: 38px;
                box-sizing: border-box;
                border: 4px solid #D1E5FE;
                margin-right: 11px;
                color: transparent;
                font-weight: bold;
                text-align: center;
                line-height: 32px;
                border-radius: 50%;
                transition: all 0.15s ease-out;
              }
              input[type=radio]:checked + .check-circle {
                border-color: #89BCFE;
                color: #89BCFE;
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
      .go-meta-box {
        width: 100%;
        margin: 24px 0 42px;
        a {
          color: #8EBEFE;
        }
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
        .single-save-btn {
          width: 100%;
          height: 75px;
          border: none;
          background-color: #85B8FD;
          color: #FFF;
          box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
          border-radius: 8px;
          transition: background-color 0.15s ease-out;
        }
      }
      @import '~@/assets/css/animation/btns-move.scss';
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