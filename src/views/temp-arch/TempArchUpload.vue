<template>
  <div id="temp-arch-upload">
    <des-head @handleClick="headClick">
      新建
      <template #right>{{isChecking ? '全选' : '选择'}}</template>
    </des-head>
    <div class="slots"></div><!-- 占header的位置 -->

    <ArchList
      ref="archList"
      :canCancel="false"
      :canClickItem="false"
      :listData="listData"
      :editName="'著录'"
      @passClickIndex="passDetailData"
      @deleteClickIndex="deleteClickIndex"
      @stopSelect="stopSelect"
    />
    <UploadBtn :disabled="disabledUpload" @uploadFiles="onUploadFiles"/>

  
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
import { addTemporaryArchive, deleteTemporaryArchive, getImageMetadata, selectTemporaryArchive } from '@/services/temp-arch';
// import fileUtils from '@/utils/fileUtils';

@Component({
  components: {
    UploadBtn,
    ArchList,
    DesHead,
  }
})
export default class TempArchUpload extends Vue {
  private listData: Array<ArchItemData> = []
  // 正在上传时，禁止上传
  private disabledUpload: boolean = false;
  // 正在上传时，禁止选择
  private disabledCheck: boolean = false;

  private created() {
    this.getTempArchList()
  }
  // ajax获取数据
  private async getTempArchList() {
    const { data: { data } } = await selectTemporaryArchive();
    const list = this.listData;
    let p1 = list.length, p2 = data.length;
    while (p1 || p2) {
      // 1.如果list已经没了，data还有，就直接加到前面
      if (p1 === 0) {
        list.splice(0, 0, ...data.slice(0, p2));
        break;
      }
      // 2.如果list还有，data已经没了，说明删的是第一个（第一次忽略的情况）
      else if (p2 === 0) {
        list.splice(0, 1);
        break;
      }
      // 3.两个都还有
      else {
        // 如果两个fileId不等（说明被删了一部分），减list的指针，并把这个项移除
        // 合理是因为顺序肯定是一样的
        while (p1 && list[p1 - 1].fileId !== data[p2 - 1].fileId) {
          list.splice(--p1, 1)
        }
      }
      --p1, --p2;
    }
  }
  // ajax添加数据
  private async addTempArch({ fileId, thumbnailFileId, zippedFileId }: any) {
    return await addTemporaryArchive([{ fileId, thumbnailFileId, zippedFileId }])
  }
  // ajax获取图片的额外数据
  private async getImageMetaData(fileId: number) {
    return await getImageMetadata({ fileId })
  }
  // 上传文件
  private onUploadFiles (file: File) {
    MsgBox.success('文件上传中...', true)
    this.disabledUpload = true;
    this.disabledCheck = true;

    const fileChunkList = createFileChunk(file);
    const Md5 = getFileMd5(fileChunkList)
    uploadFile(Md5, file.name, fileChunkList, file.type)
      .then((res: any) => {
        console.log('分片上传成功', res);
        return this.addTempArch(res.data)
      })
      .then((res: any) => {
        console.log('添加临时档案', res);
        MsgBox.changeStatus('上传成功', true);
        this.getTempArchList();
      })
      .catch((err: any) => {
        console.log('失败', err);
        MsgBox.changeStatus('上传失败', false);
      })
      .finally(() => {
        MsgBox.closeBox(1000);
        this.disabledUpload = false;
        this.disabledCheck = false;
      })
  }
  // 将选择的档案传出去
  @Emit('passDetailData')
  passDetailData(indexList: Array<number>) {
    // 开始编辑时，结束选择，启用上传
    this.disabledUpload = false;
    return indexList.map((value) => this.listData[value]);
  }
  // 删除选择的档案
  deleteClickIndex(indexList: Array<number>) {
    this.isChecking = false;
    this.disabledCheck = true;
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
          Msg.success('删除成功');
          this.getTempArchList();
        }
        else throw Error();
      } catch (error) {
        Msg.error('删除失败');
      }
    }).catch(() => {
    }).finally(() => {
      this.disabledUpload = false;
      this.disabledCheck = false;
    })
  }
  // 是否选择状态，与archlist同步
  private isChecking: boolean = false;
  // header的左边（返回）和右边（选择）
  public headClick({clickType}: any) {
    // 正在上传不给点头部
    if (this.disabledCheck) return;
    if (clickType === 'left') {
      if (this.isChecking) {
        (this.$refs.archList as ArchList).stopSelect()
        this.isChecking = false
      }
      else
        this.$router.go(-1)
    }
    else {
      if (this.listData.length) {
        (this.$refs.archList as ArchList).onChecking()
        this.isChecking = true
        // 开始选择时，禁用上传
        this.disabledUpload = true
      }
      else
        MsgBox.error('请先上传文件')
    }
  }
  // 停止选择
  public stopSelect() {
    // 取消选择状态时，结束选择，启用上传
    this.disabledUpload = false;
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