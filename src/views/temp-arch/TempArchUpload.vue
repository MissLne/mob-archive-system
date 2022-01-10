<template>
  <div id="temp-arch-upload">
    <des-head @handleClick="headClick">
      新建
      <template #right>{{isChecking ? '全选' : '选择'}}</template>
    </des-head>
    <div class="slots"></div><!-- 占header的位置 -->

    <ArchList
      ref="ArchList"
      :canCancel="false"
      :canClickItem="false"
      :listData="listData"
      :editName="'著录'"
      @passClickIndex="passDetailData"
      @deleteClickIndex="deleteClickIndex"
      v-model="isChecking"
    />
    <UploadBtn :disabled="!canUpload" @uploadFiles="onUploadFiles"/>

  
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/Archive/ArchList.vue';
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { createFileChunk, getFileMd5, uploadFile } from '@/utils/utils-upload';
import { Dialog } from 'vant';
import Msg from '@/components/public-com/MsgBox/Msg';
import { addTemporaryArchive, deleteTemporaryArchive, selectTemporaryArchive } from '@/services/temp-arch';

@Component({
  name: 'TempArchUpload',
  components: {
    UploadBtn,
    ArchList,
    DesHead,
  }
})
export default class TempArchUpload extends Vue {
  private listData: Array<ArchItemData> = []
  // 正在上传时禁止，上传结束启用
  // 正在选择时禁止，[取消选择，删除成功，进入编辑]启用
  private canUpload: boolean = true;
  // 是否选择状态，v-model to ArchList
  private isChecking: boolean = false;
  // 开始选择
  public startSelect() {
    // 开始选择状态时，结束上传
    this.isChecking = true;
    (this.$refs['ArchList'] as ArchList).onChecking();
    this.canUpload = false;
  }
  // 停止选择
  public stopSelect() {
    // 取消选择状态时，启用上传
    this.isChecking = false;
    this.canUpload = true;
  }

  private activated() {
    // 每次用都更新一下
    this.getTempArchList()
  }
  // ajax获取数据
  private async getTempArchList() {
    const { data: { data } } = await selectTemporaryArchive();
    const list = this.listData;
    let p1 = list.length, p2 = data.length;
    while (p1 || p2) {
      console.log(p1, p2)
      // 1.如果list已经没了，data还有，就直接加到前面
      if (p1 === 0) {
        list.splice(0, 0, ...data.slice(0, p2));
        break;
      }
      // 2.如果list还有，data已经没了，说明删的是剩下这几个（第一次忽略，第二次只删一个，第三次才做对。。）
      else if (p2 === 0) {
        list.splice(0, p1);
        break;
      }
      // 3.两个都还有
      else {
        // 如果两个fileId不等（说明被删了一部分），减list的指针，并把这个项移除
        // 合理是因为顺序肯定是一样的
        while (p1 && list[p1 - 1].fileId !== data[p2 - 1].fileId) {
          console.log(p1, p2, 'in while2')
          list.splice(--p1, 1)
        }
        --p1, --p2;
      }
    }
  }
  // 上传文件
  private async onUploadFiles (file: File) {
    MsgBox.success('文件上传中...', true)
    // 正在上传时禁止
    this.canUpload = false;
    try {
      // 上传文件
      const fileChunkList = createFileChunk(file);
      const Md5 = getFileMd5(fileChunkList);
      const { data: fileData }: any = await uploadFile(Md5, file.name, fileChunkList, file.type);
      console.log('分片上传成功', fileData);
      // 添加临时档案
      const { fileId, thumbnailFileId, zippedFileId } = fileData;
      const { data: tempArchData }: any = await addTemporaryArchive([{ fileId, thumbnailFileId, zippedFileId }])
      console.log('添加临时档案', tempArchData);
      MsgBox.changeStatus('上传成功', true);
      // 更新临时档案列表
      this.getTempArchList();
    } catch (error) {
      console.log(error);
      MsgBox.changeStatus('上传失败', false);
    } finally {
      // 上传结束启用
      this.canUpload = true;
      MsgBox.closeBox(1000);
    }
  }
  // 编辑选择的档案，将选择的档案传出去
  @Emit('passDetailData')
  passDetailData(indexList: Array<number>) {
    // 开始编辑时，结束选择
    this.stopSelect();
    return indexList.map((value) => this.listData[value]);
  }
  // 删除选择的档案
  deleteClickIndex(indexList: Array<number>) {
    Dialog.confirm({
      title: '确认删除',
      cancelButtonText: '否',
      confirmButtonText: '是'
    }).then(async () => {
      try {
        const { data } = await deleteTemporaryArchive(
          indexList.map(checkedIndex => this.listData[checkedIndex].id)
        )
        if (data.code === 200) {
          // 更新数据，停止选择，弹窗提示
          this.getTempArchList();
          this.stopSelect();
          Msg.success('删除成功');
        }
        else throw Error();
      } catch (error) {
        Msg.error('删除失败');
      }
    }).catch(() => {
    })
  }
  // header的左边（返回）和右边（选择）
  headClick({clickType}: any) {
    // 正在上传不给点头部
    if (!this.isChecking && !this.canUpload) return;
    if (clickType === 'left') {
      if (this.isChecking)
        this.stopSelect()
      else
        this.$router.go(-1)
    }
    else {
      if (this.listData.length)
        this.startSelect()
      else
        MsgBox.error('请先上传文件')
    }
  }
}
</script>

<style lang="scss">
  #temp-arch-upload {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px 25px 0;
  }
</style>