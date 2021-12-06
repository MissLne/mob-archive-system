import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }

    // 参考https://github.com/vuejs/vue-cli/issues/2417
    interface ElementAttributesProperty{
      $props: {}
    }
  }
}
