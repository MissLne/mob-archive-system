<template>
  <div class="des-detail">
    <ArchForm
      :inputsProps="inputsProps"
      :disabled="true"
      class="detail-form"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ArchForm from '@/components/public-com/ArchForm.vue'
import { recursionGetId } from '@/utils/utils-file';

@Component({
  components: {
    ArchForm
  }
})
export default class DesDetail extends Vue {
  private readonly inputsProps: {[key: string]: any} = {
    topic: { title: '题名', type: 'text', value: '' },
    confidentialLevel: { title: '密级', type: 'select', value: '' },
    departmentId: { title: '部门', type: 'select', value: '' },
    retentionPeriod: { title: '保密期限', type: 'radio', value: 1 },
    categoryCodeId: { title: '类别号', type: 'select', value: '' },
    fondsIdentifierId: { title: '全宗号', type: 'select', value: '' },
    catalogueNumber: { title: '目录号', type: 'text', value: '' }, // 预留
    seeNumber: { title: '参见号', type: 'text', value: '' }, // 预留
    keyWord: { title: '关键字', type: 'text', value: '' },
    introduction: { title: '简介', type: 'text', value: '' },
    yearNumber: { title: '年度', type: 'text', value: '' },
    recordUserAndTime: { title: '著录', type: 'UserAndTime', value: ['', ''] },
    archiveUserAndTime: { title: '归档', type: 'UserAndTime', value: ['', ''] },
    storageUserAndTime: { title: '入库', type: 'UserAndTime', value: ['', ''] },
  }

  created() {
    this.getDossierDetail();
  }
  async getDossierDetail() {
    const desId = this.$route.params.id;
    let { data } = await this.$service.get(`/api/api/dossier/getDossierDetail?id=${desId}`);
    console.log('des detail data', data);
    if (data.code !== 200) return;
    // 获取到的数据
    data = data.data;
    // 简写一下
    const props = this.inputsProps;
    // 遍历填值
    for (let key in props) {
      // 双值的属性
      if (key.endsWith('UserAndTime')) {
        // 搞到前缀
        const pre = key.split('UserAndTime')[0];
        props[key].value = [data[`${pre}User`], (data[`${pre}Time`])?.split('T')[0]];
      }
      else
        props[key].value = data[key];
    }
    // key不一样的
    props.fondsIdentifierId.value = data.fondsName;
    props.categoryCodeId.value = data.categoryName;
    props.departmentId.value = data.departmentName;
    props.fondsIdentifierId.value = 
      recursionGetId(this.$store.getters['selectData/fondsIdentifier'], props.fondsIdentifierId.value, 'fondsIdentifier', 'fondsName');
    // 获取的密级是数字，转为对应的字符
    props.confidentialLevel.value =
      this.$store.state.selectData.confidentialLevelArray[props.confidentialLevel.value].name;
  }
}
</script>

<style lang="scss">
  .des-detail {
    box-sizing: border-box;
    width: 100vw;
    padding: 0 25px;
    .detail-form {
      background-color: #fff;
      padding: 39px 0 68px 40px;
    }
  }
</style>