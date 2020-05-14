<template>
  <div>
    <div>
      <div
        class="container"
        @click="closeSidebar"
      >
      </div>
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="header-title">{{ title }}</div>
          <button
            class="button button-close"
            type="button"
            uk-close
            @click="closeSidebar"
          ></button>
        </div>
        <div class="sidebar-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    title: {
      type: String,
      default: 'default title'
    }
  },
  methods: {
    closeSidebar () {
      this.$emit('closeSidebar')
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";

  .container {
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    z-index: 800;
    transition: opacity 0.3s ease-out;
  }
  .sidebar {
    min-height: 100vh;
    width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    .padding(@v: 3rem);
    border-left: 1px solid #dddddd;
    z-index: 810;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4rem;
      .header {
        &-title {
          .font(@s: 1.75rem;@w: 100);
        }
      }
    }
  }
  .sidebar::-webkit-scrollbar { width: 0; }
</style>
