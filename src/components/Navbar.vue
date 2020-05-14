<template>
    <header class="navbar">
      <router-link class="navbar-logo" :to="{ name: 'Buildings'  }">
        <img src="/static/img/footer_logo.svg"/>
      </router-link>
      <div class="navbar-notice">1</div>
      <div class="navbar-profile">
        <div class="profile-name"
          @click="toggleDropdown"
        >{{ userName }}
        </div>
        <transition name="fade">
          <div class="profile-menu"
            v-if="isEnableDropdown"
            @mouseleave="toggleDropdown">
            <a href="#" class="menu-item" v-for="(value, key) of menuItem" :key="key">{{ value }}</a>
            <router-link  class="menu-item" :to="{ name: 'Logout' }">Выход</router-link>
          </div>
        </transition>
      </div>
    </header>
</template>

<script>
export default {
  data: function () {
    return {
      userName: this.$store.state.email,
      menuItem: ['Профиль', 'Оплата', 'Справка'],
      isEnableDropdown: false
    }
  },
  methods: {
    toggleDropdown () {
      this.isEnableDropdown = !this.isEnableDropdown
    }
  },
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    }
  }

}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";

  .navbar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 2rem;
    grid-template-rows: 4rem;
    align-items: center;
    background-color: @color-white;
    .padding-h();
    @media @desktop {
      grid-column-gap: 1rem;
      .padding-h(@v: 2rem);
    }
    &-logo {
      img {
        height: 2rem;
      }
    }
    &-notice {
      margin-left: auto;
    }
    &-profile {
      position: relative;
      display: flex;
      align-self: stretch;
      align-items: center;
      .profile {
        &-name {
          display: flex;
          align-self: stretch;
          align-items: center;
          cursor: pointer;
          .padding-h(@v: 2rem);
          &:hover {
            background-image: linear-gradient( 135deg, #E9F6FF 11.2%, #F8F5FF 91.2% );
          }
          &:active {
            background-image: linear-gradient( 135deg, darken(#E9F6FF, 3%) 11.2%, darken(#F8F5FF, 3%) 91.2% );
          }
        }
        &-menu {
          box-shadow: 0 28px 50px rgba(22, 0, 27, 0.14);
          font-size: 0.875rem;
          position: absolute;
          background: #fff;
          right: 0;
          top: 5rem;
          padding: 1rem 0;
          &:before{
            position: absolute;
            top: -10px;
            right: 1rem;
            margin-left: -10px;
            content:"";
            display:block;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid @color-white;
          }
          .menu {
            &-item {
              color: @color-grey;
              display: block;
              padding: 0.75rem 2rem;
              text-decoration: none;
              &:hover {
                color: @color-white;
                background-color: @color-green;
              }
            }
          }
        }
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
    transform: translateY(0);
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
    transform: translateY(1rem);
  }
</style>
