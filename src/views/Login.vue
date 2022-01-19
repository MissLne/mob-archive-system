<template>
  <div id="login" :style="{height: initInnerHeight + 'px'}">
    <div class="container">
      <img src="@/assets/login/logo.png" class="logo">
      <h3 class="title">仓颉智慧多媒体档案系统</h3>
      <h3 class="title">Cangjie - Smart Multimedia File System</h3>
      <form>
        <Input
          ref="account"
          v-model="formData.account"
          :required="true"
          :holder="formMsg.account"
          :msg="formMsg.account"
          class="ac-input"
          autocomplete="account"
          @focus="setAccountMsg"
        />
        <Input
          ref="password"
          v-model="formData.password"
          :type="'password'"
          :required="true"
          :holder="formMsg.password"
          :msg="formMsg.password"
          class="pw-input"
          autocomplete="password"
          @focus="setPasswordMsg"
        />
      </form>
      <div class="collect-files-box">
        <img
          :src="require('@/assets/login/scan.png')"
          class="scan"
          @click="$router.push({ name: 'collectFilesScan' })"
        >
        <router-link to="/collect-files" class="link">校史征集>></router-link>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        class="login-btn"
        viewBox="0 0 122 122"
        :style="{ 'background-image': complete ?
          'linear-gradient(rgba(173, 198, 249, 0.7), rgba(131, 161, 226, 0.7))' :
          'linear-gradient(rgba(213, 226, 252, 0.7), rgba(185, 202, 239, 0.7))'
        }"
        @click="onClick"
      >
        <path fill-rule="evenodd" fill="#fff" d="M84.528,60.889 C84.308,61.424 83.785,61.773 83.207,61.773 L37.430,61.773 C36.640,61.773 35.999,61.131 35.999,60.341 C35.999,59.550 36.640,58.909 37.430,58.909 L79.753,58.909 L59.307,38.444 C58.748,37.885 58.748,36.979 59.307,36.419 C59.866,35.860 60.771,35.860 61.330,36.419 L84.218,59.329 C84.627,59.738 84.750,60.354 84.528,60.889 ZM73.611,67.920 C74.170,67.360 75.075,67.360 75.634,67.920 C76.193,68.479 76.193,69.385 75.634,69.945 L61.330,84.263 C61.050,84.543 60.684,84.683 60.318,84.683 C59.952,84.683 59.586,84.543 59.307,84.263 C58.748,83.704 58.748,82.797 59.307,82.238 L73.611,67.920 Z"/>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Input from '@/components/public-com/Input/Input.vue'
import crypto from "@/utils/crypto"
import {
  postLogin,
  getFileMetadataStructTree,
  getFondsIdentifier,
  getDossierType,
  getDepartmentTree
} from '@/services/login'

@Component({
  components: {
    Input
  }
})
export default class Login extends Vue {
  // 输入框的状态类
  private formData = {
    account: '',
    password: ''
  }
  private formMsg = {
    account: '请输入用户名',
    password: '请输入密码',
  }
  // 是否输入完成
  private get complete(): boolean {
    return this.formData.account !== ''  && this.formData.password !== '';
  }
  // 按照用户进入页面时的窗口高度，设置页面高度，防止滑动时
  private initInnerHeight: number = 1334;
  created() {
    // console.log(window.innerHeight, window.outerHeight)
    this.initInnerHeight = window.innerHeight || 1334;
    // console.log(this.$el);
  }

  // 登录按钮
  private onClick(): void {
    if (!this.complete) return;
    const login = async () => {
      const { data } = await postLogin(this.formData);
      if (data.success) {
        this.initLocalStorage(data.data);
        this.$router.replace({name: 'Home'})
      }
      else {
        const msg = (data.message as string).split('，')[1];
        // 账号错误还是
        const index = msg[0] === '账' ? 'password' : 'account';
        this.formData[index] = '';
        (this.$refs[index] as Input).isWrong = true;
        this.formMsg[index] = msg;
      }
    }
    login();
  }
  // 设置信息
  setAccountMsg() {
    this.formMsg.account = '请输入用户名'
  }
  setPasswordMsg() {
    this.formMsg.password = '请输入密码'
  }
  private async initLocalStorage(res: any) {
    crypto.setLocal('token', res.token)
    localStorage.setItem('username', res.user.name);
    localStorage.setItem('departmentId', res.user.departmentId);
    // 载入权限列表
    localStorage.setItem('permissionList', JSON.stringify(res.permissionList));

    const [
      { data: metaDataStructTree },
      { data: fondsIdentifier },
      { data: dossierType },
      { data: departmentTree },
    ] = await Promise.all([
      getFileMetadataStructTree(),
      getFondsIdentifier(),
      getDossierType(),
      getDepartmentTree(),
    ])
    // 载入元数据结构
    localStorage.setItem('struct', JSON.stringify(metaDataStructTree.data))
    // 载入全宗号
    localStorage.setItem('fondsIdentifier', JSON.stringify(fondsIdentifier.data))
    // 载入类别号
    localStorage.setItem('dossierType', JSON.stringify(dossierType.data.children))
    // 载入部门
    localStorage.setItem('departmentNameTree', JSON.stringify([departmentTree.data]))
  }
}
</script>

<style lang="scss" scoped>
  #login {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100vw;
    // min-height: 1334px;
    // height: 100vh;
    height: var(--inner-height);
    background: url('../assets/login/bg.png') no-repeat;
    background-size: cover;
    background-position-x: 100%;
    font-family: PingFang SC Regular;
    box-sizing: border-box;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      width: 612px;
      height: 942px;
      margin: 120px auto 149px;
      // margin: auto;
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 8px 6px 14px 0px rgba(76, 108, 174, 0.5);
      .logo {
        width: 182px;
        height: 182px;
        margin-bottom: 47px;
      }
      .title {
        margin-bottom: 14px;
        color: #327CD7;
        font-size: 36px;
        &:last-of-type {
          margin-bottom: 139px;
          font-size: 24px;
        }
      }
      // 登录框
      .ac-input,
      .pw-input {
        width: 379px;
        font-size: 24px;
        /deep/ .holder-box,
        /deep/ .wrong-box {
          left: 55px;
        }
        /deep/ input {
          color: #999;
          text-indent: 55px;
        }
        /deep/ input[class~="active"] {
          color: rgba(0, 79, 255, 0.5);
        }
        /deep/ .holder-box {
          color: #999;
        }
        &::after {
          content: '';
          position: absolute;
          top: 52%;
          left: 0;
          width: 42px;
          height: 42px;
          background:
            top left / 40px
            no-repeat;
          transform: translateY(-50%);
        }
      }
      .ac-input::after {
        background-image: url(../assets/login/account.svg);
      }
      .pw-input::after {
        background-image: url(../assets/login/password.svg);
      }
      .collect-files-box {
        align-self: flex-end;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 31px 119px 50px 0;
        .scan {
          width: 28px;
          height: 28px;
        }
        .link {
          color: #8EBEFE;
          font-size: 20px;
        }
      }
      .login-btn {
        width: 122px;
        height: 122px;
        border-radius: 50%;
      }
    }
  }
</style>