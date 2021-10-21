export function watchRouteChange(_this: any) {
  _this.$set(_this, 'transitionName', '')
  _this.$watch('$route', function(to: any, from: any) {
    // 刚打开登录页面的时候，from为null，会有谜之动画
    if (from.name === null) return;
    else if (from.name === 'login') {
      _this.transitionName = 'slide-left';
      return;
    }
    else if (to.name === 'login') {
      _this.transitionName = 'slide-right';
      return;
    }

    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    // console.log(to.name, from)
    // console.log(toDepth, fromDepth)
    if (toDepth === fromDepth) _this.transitionName = ''
    else _this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  })
}