<template>
  <div id="collect-files-msg">
    <des-head @handleClick="headClick" class="deshead">
      详情
    </des-head>
    <h1 class="msgTopic">{{ msgDetail.topic }}</h1>
    <p class="create">{{ createdTime() }}</p>
    <p class="department">创建部门：{{ msgDetail.department }}</p>
    <div class="change">
      <div>更换主题:</div>
      <van-dropdown-menu active-color="#327CD7" class="themeList">
        <van-dropdown-item
          @change="themeChange"
          v-model="themeNow"
          :options="menuList"
        />
      </van-dropdown-menu>
    </div>
    <CollectFilesDetailItem :theme="themeNow" class="item" />
    <!-- <div v-html="$xss(msgDetail.content)" class="msgBox"></div> -->
    <div class="toDetail"><img :src="src" alt="" /></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { getQRCoder, getAllTheme } from '@/services/theme'
import { toObjectURL } from '@/utils/picture'

import { DropdownMenu, DropdownItem, Toast, Image } from 'vant'
import Msg from '@/components/public-com/MsgBox/Msg'
import DesHead from '@/components/des-com/index/des-head.vue'
import SlideWrapper from '@/components/public-com/Slide/SlideWrapper.vue'
import CollectFilesDetailItem from './CollectFilesDetailItem.vue'
@Component({
  name: 'CollectFilesMsg',
  components: {
    'van-dropdown-menu': DropdownMenu,
    'van-dropdown-item': DropdownItem,
    'van-image': Image,
    DesHead,
    SlideWrapper,
    CollectFilesDetailItem,
  },
})
export default class CollectFilesMsg extends Vue {
  @Prop() theme!: Theme
  indexList: Array<number> = [-1, 0, -1]
  private msgDetail = {
    createdTime: '',
    content: '',
  }
  private src = {}
  private themeList = []
  private menuList = []
  private themeNow = 1

  onSetPages(indexList: Array<number>) {
    console.log('response set pages', indexList)
    this.indexList = indexList
  }

  async themeChange(value: number) {
    try {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载主题中',
      })
      this.themeNow = value
      this.$store.commit('selectData/setSelectedThemeId', value)
      this.getQR(value)
      await this.$store
        .dispatch('selectData/setSelectedThemeDetail', value)
        .then((res) => {
          this.msgDetail = res
        })
    } catch (error) {
      Msg.error((error as string) || '主题加载失败')
    } finally {
      Toast.clear()
    }
  }
  createdTime() {
    return this.msgDetail?.createdTime?.replace('T', ' ')
  }
  async getQR(themeId: number) {
    // 这个data是一个blob对象
    const { data } = await getQRCoder({ themeId })
    // json是无二维码的信息，否则是二维码图片的blob对象
    if (data.type !== 'application/json') this.src = toObjectURL(data)
  }

  //头部点击函数
  headClick({ clickType }: any) {
    // 正在上传不给点头部
    if (clickType === 'left') {
      this.$router.go(-1)
    }
  }

  async getThemeList() {
    const { data } = await getAllTheme()
    if (data.data) {
      this.themeList = data.data
      this.$store.commit('selectData/setThemeList', data.data)
      this.menuList = JSON.parse(
        JSON.stringify(data.data)
          ?.replaceAll('topic', 'text')
          ?.replaceAll('themeId', 'value') || ''
      )
      console.log(this.menuList)
    }
  }
  async created() {
    try {
      this.themeNow = Number.parseInt(this.$route.query.themeId as string)
      let allTheme = this.$store.state.selectData.themeList
      if (allTheme.length) {
        this.themeList = allTheme
        this.menuList = JSON.parse(
          JSON.stringify(allTheme)
            ?.replaceAll('topic', 'text')
            ?.replaceAll('themeId', 'value') || ''
        )
      } else await this.getThemeList()
      this.themeChange(this.themeNow)
    } catch (error) {
      Msg.error('主题列表加载失败')
    }
  }
}
</script>

<style lang="scss">
#collect-files-msg {
  //   /* width: 100vw; */
  min-height: 100vh;
  //   padding: 20px;
  box-sizing: border-box;
  margin-top: 11vw;
  .deshead {
    z-index: 100;
  }
  .msgTopic {
    text-align: center;
    margin-bottom: 18px;
    margin-left: 20px;
  }
  .create {
    font-size: 25px;
    color: #aaa;
    margin: 18px 0px 18px 20px;
  }
  .department {
    font-size: 28px;
    color: green;
    margin-bottom: 18px;
    margin-left: 20px;
  }
  .change {
    display: flex;
    align-items: center;
    margin-left: 20px;
    .themeList {
      margin-left: 20px;
      width: 250px;
      border-radius: 20px;
      overflow: hidden;
      background-image: linear-gradient(180deg, #ecf2fe, #e9f1fe);
    }
  }
  .wrapper {
    // margin-top: 30px;
    width: 100%;
    // background-color: pink;
    padding: 0;
    height: 85vw !important;
    .item {
      width: 100%;
      //   padding: 0;
      //   height: 50px;
      //   background-color: pink;
    }
  }
  .msgBox {
    margin: 20px 0;
    padding: 15px;
    /* width: 100%; */
    overflow: hidden;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
    * {
      background-image: linear-gradient(180deg, #ecf2fe, #e9f1fe);
    }
    img {
      max-width: 100% !important;
      object-fit: contain;
      /* object-fit: cover; */
    }
  }
  .toDetail {
    text-align: center;
    img {
      width: 250px;
    }
  }
}
</style>
