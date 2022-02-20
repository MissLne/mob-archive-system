<template>
  <div id="collect-files-msg">
    <h1 class="msgTopic">{{ msgDetail.topic }}</h1>
    <p class="create">{{ createdTime() }}</p>
    <p class="department">创建部门：{{ msgDetail.department }}</p>
    <div class="change">
      <div>更换主题:</div>
      <van-dropdown-menu active-color="#327CD7" class="themeList">
        <van-dropdown-item
          @change="themeChange"
          v-model="themeNow"
          :options="themeList"
        />
      </van-dropdown-menu>
    </div>
    <div v-html="$xss(msgDetail.content)" class="msgBox"></div>
    <div class="toDetail"><img :src="src" alt="" /></div>
    <button @click="wxShare">分享</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getQRCoder } from "@/services/theme";
import { toObjectURL } from "@/utils/picture";

import { DropdownMenu, DropdownItem, Toast } from "vant";
import Msg from "@/components/public-com/MsgBox/Msg";
@Component({
  name: "CollectFilesMsg",
  components: {
    "van-dropdown-menu": DropdownMenu,
    "van-dropdown-item": DropdownItem,
  },
})
export default class CollectFilesMsg extends Vue {
  private msgDetail = {
    createdTime: "",
  };
  private src = {};
  private themeList = [];
  private themeNow = 1;

  async themeChange(value: number) {
    try {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载主题中",
      });
      this.$store.commit("selectData/setSelectedThemeId", value);
      await this.$store
        .dispatch("selectData/setSelectedThemeDetail", value)
        .then(() => {
          this.msgDetail = this.$store.state.selectData.selectedThemeDetail;
        });
      await this.getQR(value);
      Toast.clear();
    } catch (error) {
      Msg.error('主题加载失败')
    }
  }
  createdTime() {
    return this.msgDetail?.createdTime?.replace("T", " ");
  }
  wxShare() {
    console.log("wxShare");
  }
  async getQR(themeId: number) {
    // 这个data是一个blob对象
    const { data } = await getQRCoder({ themeId });
    // json是无二维码的信息，否则是二维码图片的blob对象
    if (data.type !== "application/json") this.src = toObjectURL(data);
  }
  created() {
    this.themeNow = Number.parseInt(this.$route.query.themeId as string);
    this.themeList = JSON.parse(
      sessionStorage
        .getItem("allTheme")
        ?.replaceAll("topic", "text")
        ?.replaceAll("themeId", "value") || ""
    );
    this.themeChange(this.themeNow);
  }
}
</script>

<style lang="scss">
#collect-files-msg {
  width: 100vw;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  .msgTopic {
    text-align: center;
    margin-bottom: 8px;
  }
  .create {
    font-size: 15px;
    color: #aaa;
    margin-bottom: 8px;
  }
  .department {
    font-size: 17px;
    color: green;
    margin-bottom: 8px;
  }
  .change {
    display: flex;
    align-items: center;
    .themeList {
      margin-left: 20px;
      width: 250px;
      border-radius: 20px;
      overflow: hidden;
      background-image: linear-gradient(180deg, #ecf2fe, #e9f1fe);
    }
  }
  .msgBox {
    width: 100%;
    overflow: hidden;
    * {
      background-image: linear-gradient(180deg, #ecf2fe, #e9f1fe);
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