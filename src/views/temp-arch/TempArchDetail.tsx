import SlideWrapper from '@/components/public-com/Slide/SlideWrapper';
import TempArchDetailItem from './TempArchDetailItem.vue';
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import DesHead from '@/components/des-com/index/des-head.vue';

@Component({
  name: 'TempArchDetail',
  components: {
    SlideWrapper,
    TempArchDetailItem,
    DesHead,
  }
})
export default class TempArchDetail extends Vue {
  @Prop() detailDataList!: ArchItemData[];
  // select的内容
  @Prop() fondsIdentifier!: Array<any>;
  @Prop() dossierType!: Array<any>;
  @Prop() departmentNameTree!: Array<any>;
  indexList: Array<number> = [-1, 0, -1];

  /* @Watch('detailDataList.length') t() {
    console.log('watcher get the change!', this.testlen);
    console.log((this.$refs['slide-wrapper'] as any).maxLength);
  }
  get testlen() {
    console.log('computed get the change!');
    return this.detailDataList.length;
  } */

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

  private headClick({clickType}: any) {
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

      // 年度迷惑问题，如果替换成逻辑2，slidewrapper的maxlength不会变化，从而导致算出错误的indexList
        /* this.$nextTick(() => console.log('nexttick is invoked')) */
      // 逻辑1：直接修改当前组件的indexList(dom变化)，再直接修改孩子的indexList
      // 如果now在原来的尾部，往回走一个
      if (now === len - 1) --now;
      this.indexList = [
        now <= 0 ? -1 : now - 1,
        now,
        now >= len - 2 ? -1 : now + 1
      ];
      (this.$refs['slide-wrapper'] as any).indexList = this.indexList;
      // 逻辑2：调用孩子的setPages更新孩子的indexList，再响应$emit修改当前组件的indexList
      /* if (now === len - 1)
        (this.$refs['slide-wrapper'] as any).setPages(1);
      else
        (this.$refs['slide-wrapper'] as any).setPages(0); */
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
            if (i === -1 && index !== 1)
              return (<div key={Math.random()} style="width: 100vw;"></div>)
            else
              return (
                <TempArchDetailItem
                  key={this.detailDataList[i].fileId}
                  detailData={this.detailDataList[i]}
                  fondsIdentifier={this.fondsIdentifier}
                  dossierType={this.dossierType}
                  departmentNameTree={this.departmentNameTree}
                  onSubmitFile={this.onSubmitFile}
                />
              )
          })}
        </slide-wrapper>
      </div>
    )
  }
}