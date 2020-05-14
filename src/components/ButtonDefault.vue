<template>
  <button
    type="button"
    class="button"
    :button-color="color"
    @click = "methodFromParent"
  >
    {{ name }}
  </button>
</template>

<script>
export default {
  name: 'ButtonDefault',
  props: {
    color: {
      type: String,
      default: function () {
        return 'white'
      }
    },
    name: {
      type: String,
      require: true
    },
    actionForClick: Function
  },
  methods: {
    methodFromParent () {
      this.actionForClick()
    }
  }
}
</script>

<style lang="less">
@import (less) "../../static/less/color.less";
@import (less) "../../static/less/global.less";
@import (less) "../../static/less/form.less";
@import (less) "../../static/less/media.less";
@import (less) "../../static/less/button.less";
</style>
