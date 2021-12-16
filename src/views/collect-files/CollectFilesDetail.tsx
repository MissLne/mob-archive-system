import SlideWrapper from '@/components/public-com/Slide/SlideWrapper';
import CollectFilesDetailItem from './CollectFilesDetailItem.vue'
import { Component, Vue, Prop } from 'vue-property-decorator';
import DesHead from '@/components/des-com/index/des-head.vue';

@Component({
  name: 'CollectFilesDetail',
  components: {
    SlideWrapper,
    CollectFilesDetailItem,
    DesHead,
  }
})
export default class CollectFilesDetail extends Vue {
  @Prop() detailDataList!: Array<any>;
  indexList: Array<number> = [-1, 0, -1];
  // 头部数据与点击事件
  public headData: any = {
    title: '详情',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }
  public headClick({clickType}: any) {
    if (clickType === 'left') {
      this.$router.go(-1)
    }
  }

  onSetPages(indexList: Array<number>) {
    console.log('response set pages', indexList);
    this.indexList = indexList;
  }

  onSubmitFile() {
    const len = this.detailDataList.length;
    if (len === 1)
      this.$router.go(-1);
    else {
      let now = this.indexList[1];
      // len减小了1，让父组件修改更符合规范，这里为了方便。。
      this.detailDataList.splice(now, 1);

      if (now === len - 1) --now;
      this.indexList = [
        now <= 0 ? -1 : now - 1,
        now,
        now >= len - 2 ? -1 : now + 1
      ];
      (this.$refs['slide-wrapper'] as any).indexList = this.indexList;
    }
  }

  render() {
    return (
      <div class="temp-arch-detail">
        <DesHead headData={this.headData} onHandleClick={this.headClick}/>
        <slide-wrapper
          ref="slide-wrapper"
          maxLength={this.detailDataList.length}
          onSetPages={this.onSetPages}
        >
          {this.indexList.map((i, index) => {
            // 为了避免key冲突。。
            if (!(i === -1 && index !== 1))
              return (
                <CollectFilesDetailItem
                  key={this.detailDataList[i].fileId}
                  detailData={this.detailDataList[i]}
                  onSubmitFile={this.onSubmitFile}
                />
              )
          })}
        </slide-wrapper>
      </div>
    )
  }
}
