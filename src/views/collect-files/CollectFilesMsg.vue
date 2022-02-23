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
          :options="menuList"
        />
      </van-dropdown-menu>
    </div>
    <div v-html="$xss(msgDetail.content)" class="msgBox"></div>
    <div class="toDetail"><img :src="src" alt="" /></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getQRCoder, getAllTheme } from "@/services/theme";
import { toObjectURL } from "@/utils/picture";

import { DropdownMenu, DropdownItem, Toast, Image } from "vant";
import Msg from "@/components/public-com/MsgBox/Msg";
@Component({
  name: "CollectFilesMsg",
  components: {
    "van-dropdown-menu": DropdownMenu,
    "van-dropdown-item": DropdownItem,
    "van-image": Image,
  },
})
export default class CollectFilesMsg extends Vue {
  private msgDetail = {
    createdTime: "",
    content: "",
  };
  private src = {};
  private themeList = [];
  private menuList = [];
  private themeNow = 1;

  async themeChange(value: number) {
    try {
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载主题中",
      });
      this.themeNow = value;
      this.$store.commit("selectData/setSelectedThemeId", value);
      this.getQR(value);
      await this.$store
        .dispatch("selectData/setSelectedThemeDetail", value)
        .then((res) => {
          this.msgDetail = res;
        });
    } catch (error) {
      Msg.error((error as string) || "主题加载失败");
    } finally {
      Toast.clear();
    }
  }
  createdTime() {
    return this.msgDetail?.createdTime?.replace("T", " ");
  }
  async getQR(themeId: number) {
    // 这个data是一个blob对象
    const { data } = await getQRCoder({ themeId });
    // json是无二维码的信息，否则是二维码图片的blob对象
    if (data.type !== "application/json") this.src = toObjectURL(data);
  }
  async getThemeList() {
    const { data } = await getAllTheme();
    if (data.data) {
      this.themeList = data.data;
      this.$store.commit("selectData/setThemeList", data.data);
      this.menuList = JSON.parse(
        JSON.stringify(data.data)
          ?.replaceAll("topic", "text")
          ?.replaceAll("themeId", "value") || ""
      );
      console.log(this.menuList);
    }
  }
  async created() {
    try {
      this.themeNow = Number.parseInt(this.$route.query.themeId as string);
      let allTheme = this.$store.state.selectData.themeList;
      if (allTheme.length) {
        this.themeList = allTheme;
        this.menuList = JSON.parse(
          JSON.stringify(allTheme)
            ?.replaceAll("topic", "text")
            ?.replaceAll("themeId", "value") || ""
        );
      } else await this.getThemeList();
      this.themeChange(this.themeNow);
    } catch (error) {
      Msg.error("主题列表加载失败");
    }
  }
}
</script>

<style lang="scss">
#collect-files-msg {
  /* width: 100vw; */
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  .msgTopic {
    text-align: center;
    margin-bottom: 18px;
  }
  .create {
    font-size: 25px;
    color: #aaa;
    margin-bottom: 18px;
  }
  .department {
    font-size: 28px;
    color: green;
    margin-bottom: 18px;
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