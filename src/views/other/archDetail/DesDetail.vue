<template>
  <div>
    <ArchForm
      :inputsProps="inputsProps"
      :disabled="true"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ArchForm from '@/components/public-com/ArchForm.vue'

@Component({
  components: {
    ArchForm
  }
})
export default class DesDetail extends Vue {
  @Prop() desId!: number;

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
    recordUserAndTime: { title: '著录', type: 'text date', value: ['', ''] },
    archiveUserAndTime: { title: '归档', type: 'text date', value: ['', ''] },
    storageUserAndTime: { title: '入库', type: 'text date', value: ['', ''] },
  }

  created() {
    this.getDossierDetail();
  }
  async getDossierDetail() {
    let { data } = await this.$service.get(`/api/api/dossier/getDossierDetail?id=${this.desId}`)
    console.log('des detail data', data);
    if (data.code !== 200) return;
    data = data.data;
    const props = this.inputsProps;
    for (let key in props) {
      // 双值的属性
      if (key.endsWith('UserAndTime')) {
        // 搞到前缀
        const pre = key.split('UserAndTime')[0];
        props[key].value = [data[`${pre}User`], data[`${pre}Time`]];
      }
      else
        props[key].value = data[key];
    }
  }
}
</script>

<style lang="scss">

</style>