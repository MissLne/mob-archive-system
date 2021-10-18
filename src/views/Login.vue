<template>
  <div id="login" :style="{height: initInnerHeight + 'px'}">
    <div class="container">
      <img src="@/assets/login/logo.png" class="logo">
      <h3 class="title">仓颉智慧多媒体档案系统</h3>
      <h3 class="title">Cangjie - Smart Multimedia File System</h3>
      <div class="input-wrap">
        <input
          class="username input"
          :class="{ active: states['un'].isActive, wrong: states['un'].isWrong }"
          type="text"
          @focus="onFocus($event, 'un')"
          @blur="onBlur($event, 'un')"
          v-model="states['un'].value"
        >
        <div
          class="wrong-box"
          :class="{ 'wrong-box-hidden': !states['un'].isWrong }"
        >
          {{states['un'].msg}}
        </div>
      </div>
      <div class="input-wrap">
        <input
          class="password input"
          :class="{ active: states['pw'].isActive, wrong: states['pw'].isWrong }"
          :type="states['pw'].isEmpty ? 'text' : 'password'"
          @focus="onFocus($event, 'pw')"
          @blur="onBlur($event, 'pw')"
          v-model="states['pw'].value"
        >
        <div
          class="wrong-box"
          :class="{ 'wrong-box-hidden': !states['pw'].isWrong }"
        >
          {{states['pw'].msg}}
        </div>
      </div>
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
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { Component, Vue } from 'vue-property-decorator';

class State {
  constructor(holder: string) {
    this.holder = holder;
    this.value = holder;
    this.msg = holder;
  }
  readonly holder: string;
  value: string;
  msg: string;
  isActive: boolean = false;
  isWrong: boolean = false;
  get isEmpty() {
    return this.value === this.holder || this.value === '';
  }
}

@Component
export default class Login extends Vue {
  // 输入框的状态类
  private states: {[key: string]: State} = {
    un: new State('请输入用户名'), 
    pw: new State('请输入密码'),
  }
  // 是否输入完成
  private get complete(): boolean {
    return !this.states.un.isEmpty && !this.states.pw.isEmpty;
  }
  // 按照用户进入页面时的窗口高度，设置页面高度，防止滑动时
  private initInnerHeight: number = 1334;
  created() {
    // console.log(window.innerHeight, window.outerHeight)
    this.initInnerHeight = window.innerHeight || 1334;
    // console.log(this.$el);
  }
  // 输入栏聚焦
  private onFocus({target}: {target: HTMLInputElement}, which: string) {
    let state = this.states[which];
    state.isActive = true, state.isWrong = false, state.msg = state.holder;
    if (state.isEmpty) state.value = '';

  }
  // 输入栏失焦
  private onBlur({target}: {target: HTMLInputElement}, which: string) {
    let state = this.states[which];
    state.isActive = false;
    if (state.isEmpty) state.isWrong = true;
  }

  // 登录按钮
  private onClick(): void {
    localStorage.removeItem('token')
    if (!this.complete) return;
    (this as any).$service.post('/api/api/user/login', {
        account: this.states.un.value,
        password: this.states.pw.value,
      },
    ).then((res: any) => {
      console.log(res)
      res = res.data;
      if (res.success) {
        this.initLocalStorage(res.data);
        this.$router.push({name: 'Home'})
        setTimeout(() => {
          MsgBox.success('登录成功')
        }, 450)
      }
      else {
        const msg = (res.message as string).split('，')[1];
        const index = msg[0] === '账' ? 'pw' : 'un';
        this.states[index].value = '';
        this.states[index].isWrong = true;
        this.states[index].msg = msg;
      }
    })
  }
  private initLocalStorage(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.user.name);
    localStorage.setItem('departmentId', res.user.departmentId);
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
          localStorage.setItem('departmentNameTree', JSON.stringify(res.data.children))
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
      .input-wrap {
        z-index: 1; //为了防止错误提示文本被背景淹没
        position: relative;
        font-size: 24px;
        .input {
          width: 379px;
          border: none;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          background-color: transparent;
          color: #999;
          text-align: center;
          transition: border-color 0.15s ease-in, color 0.25s ease-in;
          &.username {
            margin-bottom: 95px;
          }
          &.password {
            margin-bottom: 31px;
          }
        }
        .active {
          border-color: rgba(0, 79, 255, 0.2);
          color: rgba(0, 79, 255, 0.5);
          transition-timing-function: ease-out;
        }
        .wrong {
          border-color: rgba(255, 0, 0, 0.2);
          transition-timing-function: ease-out;
        }
        .wrong-box {
          z-index: -1;
          position: absolute;
          top: 5px;
          left: 50%;
          color: rgba(255, 0, 0, 0.5);
          transform: translateX(-50%);
          transition: opacity 0.35s ease-out;
        }
        .wrong-box-hidden {
          opacity: 0;
          transition: none;
        }
      }
      .collect-files-link {
        align-self: flex-end;
        margin-bottom: 60px;
        margin-right: 119px;
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