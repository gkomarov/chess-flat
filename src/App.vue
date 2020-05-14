<template>
  <div>
    <Navbar v-if="isAuthenticated"/>
    <main><router-view/></main>
  </div>
</template>

<script>
import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.getters.loggedIn
    }
  }
}
</script>

<style lang="less">
  @import (less) "../static/less/global.less";
  @import (less) "../static/less/media.less";
  @import (less) "../static/less/padding.less";
  main {
    .padding();
    @media @desktop {
      .padding(@v: 2rem;);
    }
    @media @mobile {
      .padding(@v: 1rem;);
    }
  }
</style>
