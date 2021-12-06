
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import Description from "@/views/principal/Description.vue";
import Apply from "@/views/principal/Apply.vue";
import Me from "@/views/principal/Me.vue";
import './slide.scss'

@Component({
  components: {
    Description,
    Apply,
    Me
  },
})
export default class SlideWrapper extends Vue {
  @Prop({ default: 0 }) maxLength!: number
  /* @Watch('maxLength') a() {
    console.log('长度变惹')
  } */
  
  startX: number = 0;
  startY: number = 0;
  movePercentage: number = 0;
  isLeftRight: any = null;
  isTween = false;
  indexList: Array<number> = [0, 0, 0];

  // 禁止向左走和向右走
  get stopGoLeft() {
    return this.indexList[0] === -1;
  }
  get stopGoRight() {
    return this.indexList[2] === -1;
  }

  onTouchstart({touches}: TouchEvent) {
    if (touches.length === 1) {
      this.startX = touches[0].clientX;
      this.startY = touches[0].clientY;
    }
  }
  onTouchmove(e: TouchEvent) {
    if (e.touches.length === 1) {
      // 设定方向，一旦设定end后才会重置
      if (this.isLeftRight === null)
        this.isLeftRight = Math.abs(e.touches[0].clientX - this.startX) > Math.abs(e.touches[0].clientY -this.startY);
      if (this.isLeftRight) {
        this.movePercentage = (e.touches[0].clientX - this.startX) / window.innerWidth;      
        // 触发之后只能左右
        e.preventDefault();
      }
    }
  }
  onTouchend(e: TouchEvent, outsidePercentage: number) {
    if (outsidePercentage) {
      this.movePercentage = outsidePercentage;
      console.log('outside percentage!');
    }
    if (0.5 < Math.abs(this.movePercentage) && Math.abs(this.movePercentage) <= 1) {
      if (this.movePercentage > 0)
        this.movePercentage = this.stopGoLeft ? 0 : 1;
      else
        this.movePercentage = this.stopGoRight ? 0 : -1;
    }
    else
      this.movePercentage = 0;
    // 不然垂直滚动完会有延迟- -  
    if (this.isLeftRight) {
      this.isTween = true;
      // 与补间动画0.3s同步（本来使用transitionend，因为input的动画也会冒泡触发，担心性能问题）
      setTimeout(() => {
        this.setPages(this.movePercentage);
        this.movePercentage = 0;
        this.isTween = false; 
      }, 300)
    }
    this.isLeftRight = null;
  }
  @Emit('setPages')
  public setPages(go: number) {
    const now = this.indexList[1] - go;
    this.indexList = [
      now === 0 ? -1 : now - 1,
      now,
      now === this.maxLength - 1 ? -1 : now + 1
    ]
    return this.indexList;
  }
  created() {
    this.setPages(0);
  }
  render() {
    // 参考https://www.bilibili.com/video/BV1YU4y177wa
    return (
      /* 视口，100vw */
      <div class="slide-wrapper">
        {/* 滑动窗口，长度3 * 100vw */}
        <div
          style={{transform: `translateX(${-100 + this.movePercentage * 100}%)`}}
          class={{'tween': this.isTween, 'flex-wrapper': true}}
          onTouchstart={this.onTouchstart}
          onTouchmove={this.onTouchmove}
          onTouchend={this.onTouchend}
        >
          {this.$slots['default']}
        </div>
      </div>
    )
  }
}