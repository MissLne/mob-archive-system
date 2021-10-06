import MsgBox from './MsgBox.vue'
import Vue from 'vue'

const vm = new Vue({
  render: h => h(MsgBox)
}).$mount();

const box: any = vm.$children[0];
// let handle: ReturnType<typeof setTimeout>;

function showBox(manual: boolean) {
  document.body.appendChild(vm.$el)
  box.$data.isShow = true;
  if (!manual) closeBox(1000)
}

/**
 * @param delay 关闭弹窗的延迟，默认为0
 */
function closeBox(delay: number = 0) {
  console.log('close!')
  /* console.log('handle is', handle)
  if (handle) {
    box.$data.isShow = true;
    clearInterval(handle);
  } */
  // box.$data.isShow = false
  setTimeout(() => box.$data.isShow = false, 500 + delay)
  setTimeout(() => document.body.removeChild(vm.$el), 1000 + delay)
}
function changeStatus(msg?: string) {
  box.$data.isSuccess = !box.$data.isSuccess;
  if (msg) box.$data.showMsg = msg;
}

export default {
  /**
   * 成功弹窗（绿）
   * @param msg 弹窗信息
   * @param manual 是否手动关闭弹窗
   */
  success(msg: string, manual: boolean = false) {
    box.$data.showMsg = msg;
    box.$data.isSuccess = true;
    showBox(manual);
  },
  /**
   * 失败弹窗（红）
   * @param msg 弹窗信息
   * @param manual 是否手动关闭弹窗
   */
  error(msg: string, manual: boolean = false) {
    box.$data.showMsg = msg;
    box.$data.isSuccess = false;
    showBox(manual);
  },
  closeBox,
  changeStatus
}