<template>
  <div id="login" :style="{height: initInnerHeight + 'px'}">
    <div class="container">
      <img src="@/assets/login/logo.png" class="logo">
      <h3 class="title">仓颉智慧多媒体档案系统</h3>
      <h3 class="title">Cangjie - Smart Multimedia File System</h3>
      <Input
        ref="account"
        v-model="formData.account"
        :required="true"
        :holder="formMsg.account"
        :msg="formMsg.account"
        class="login-input"
        @focus="setAccountMsg"
      />
      <Input
        ref="password"
        v-model="formData.password"
        :type="'password'"
        :required="true"
        :holder="formMsg.password"
        :msg="formMsg.password"
        class="login-input"
        @focus="setPasswordMsg"
      />
      <router-link to="/collect-files" class="collect-files-link">校史征集>></router-link>
      <img
        class="login-btn"
        :src="complete ? require('@/assets/login/log-in-bright.png') : require('@/assets/login/log-in-gray.png')"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Input from '@/components/public-com/Input/Input.vue'
import MsgBox from '@/components/public-com/MsgBox/Msg';

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
    localStorage.removeItem('token')
    if (!this.complete) return;
    (this as any).$service.post('/api/api/user/login', this.formData)
      .then((res: any) => {
        console.log(res)
        res = res.data;
        if (res.success) {
          this.initLocalStorage(res.data);
          this.$router.replace({name: 'Home'})
          setTimeout(() => {
            MsgBox.success('登录成功')
          }, 450)
        }
        else {
          const msg = (res.message as string).split('，')[1];
          // 账号错误还是
          const index = msg[0] === '账' ? 'password' : 'account';
          this.formData[index] = '';
          (this.$refs[index] as Input).isWrong = true;
          this.formMsg[index] = msg;
        }
      })
  }
  // 设置信息
  setAccountMsg() {
    this.formMsg.account = '请输入用户名'
  }
  setPasswordMsg() {
    this.formMsg.password = '请输入密码'
  }
  private initLocalStorage(res: any) {
    console.log('登录咯', res)
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.user.name);
    localStorage.setItem('departmentId', res.user.departmentId);
    // 载入权限列表
    localStorage.setItem('permissionList', JSON.stringify(res.permissionList));
    // 载入元数据结构
    this.$service.get('/api/api/archive/getFileMetadataStructTree')
      .then(({data: res}: {data: any}) => {
        console.log(res)
        localStorage.setItem('struct', JSON.stringify(res.data))
      })
      .catch((res: any) => {
        console.log(res);
        MsgBox.error('获取元数据失败');
      })
    // 载入全宗号
    this.$service.get(`/api/api/fondsIdentifier/getFondsIdentifier`)
      .then(({data: res}: any) => {
        console.log('getCollectedFileType', res)
        if (res.success && res.code === 200)
          localStorage.setItem('fondsIdentifier', JSON.stringify(res.data))
      })
    // 载入类别号
    this.$service.get(`/api/api/type/getDossierType`)
      .then(({data: res}: any) => {
        console.log('getCollectedFileType', res)
        if (res.success && res.code === 200)
          localStorage.setItem('dossierType', JSON.stringify(res.data.children))
      })
    // 载入部门
    this.$service.get(`/api/api/department/getDepartmentTree`)
      .then(({data: res}: any) => {
        console.log('getCollectedFileType', res)
        if (res.success && res.code === 200)
          localStorage.setItem('departmentNameTree', JSON.stringify([res.data]))
      })
  }
}
</script>

<style lang="scss" scoped>
  #login {
    overflow: auto;
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
      .login-input {
        display: flex;
        justify-content: center;
        width: 379px;
        font-size: 24px;
        /deep/ input {
          color: #999;
          text-align: center;  
        }
        /deep/ input[class~="active"] {
          color: rgba(0, 79, 255, 0.5);
        }
        /deep/ .holder-box {
          color: #999;
        }
      }
      .collect-files-link {
        align-self: flex-end;
        margin: 31px 119px 60px 0;
        color: #8EBEFE;
        font-size: 20px;
      }
      .login-btn {
        width: 122px;
        height: 122px;
      }
    }
  }
</style>