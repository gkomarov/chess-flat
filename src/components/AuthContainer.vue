<template>
  <div class="login-column">
    <div
      class="login-column__bg"
      style="background-image: url(/static/img/city.png)"
    >
    </div>
    <div class="login-column__text">
      <div class="login-container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthContainer'
}
</script>

<style lang="less" scoped>
@import (less) "../../static/less/color.less";
@import (less) "../../static/less/global.less";
@import (less) "../../static/less/media.less";
@import (less) "../../static/less/button.less";
@import (less) "../../static/less/form.less";

.login {
  &-column {
    color: @color-grey;
    display: grid;
    grid-template-columns: 50% 50%;
    min-height: 100vh;
    @media @desktop {
      grid-template-columns: 100%;
    }
    &__bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      @media @desktop {
        grid-area: ~'1 / 1 / 2 / 2';
      }
    }
    &__text {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @media @desktop {
        grid-area: ~'1 / 1 / 2 / 2';
      }
    }
  }
  &-container {
    background-color: @color-white;
    border-width: 10px;
    border-style: solid;
    border-color: #eee;
    padding: 60px;
    max-width: 560px;
    width: 100%;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    @media @desktop {
      background-color: rgba(254,254,254,0.9);
      border-radius: 3px;
      border-width: 0px;
      box-shadow: 0 28px 50px rgba(0,0,0,0.25);
    }
    @media @mobile {
      background-color: rgba(254, 254, 254, 0.8);
      width: inherit;
      margin: 0rem;
      padding: 2rem;
    }
  }
  &-title {
    color: darken(@color-grey, 20%);
    font-size: 1.75rem;
    margin-bottom: 2rem;
    @media @mobile {
      font-size: 1.5rem;
    }
  }
  &-alert {
    font-size: 0.75rem;
    font-weight: 600;
    color: @color-red;
    border: 3px solid @color-red;
    padding: 20px;
    text-align: center;
    margin-bottom: 40px;
  }
  &-button {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 40px;
    grid-row-gap: 20px;
    font-size: 0.75rem;
    &__register {
      &_title {
        margin-bottom: 1rem / 3;
      }
    }
    &__reset {
      text-align: center;
    }
  }
  &-reset {
    text-align: center;
    &__title {
      font-size: 1.5rem;
      text-align: center;
      margin-bottom: 2rem;
    }
    &__email {
      font-size: 1.5rem;
      color: @color-base;
      margin-bottom: 2rem;
    }
  }
}

</style>
