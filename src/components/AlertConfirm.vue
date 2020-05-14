<template>
  <div class="container">
    <div class="alert-confirm">
      <div class="alert-confirm__title">{{ additionalMessage }}</div>
      <div class="alert-confirm__desc">Вы уверены?</div>
      <div>
        <ButtonDefault
          class="button"
          name="Да"
          color="red"
          :actionForClick="agreeAction"
        />
        <ButtonDefault
          class="button"
          name="Нет"
          color="grey"
          :actionForClick="disagreeAction"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'

export default {
  name: 'AlertConfirm',
  components: { ButtonDefault },
  props: {
    additionalMessage: String
  },
  methods: {
    agreeAction () {
      this.$emit('isAgree')
    },
    disagreeAction () {
      this.$emit('isDisagree')
    }
  }

}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/button.less";
.container{
  background: rgba(0,0,0,.5);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  opacity: 1;
  z-index: 800;
  transition: opacity .3s ease-out;
}
.container .alert-confirm{
  width: 500px;
  background-color: #fff;
  padding: 2rem;
  box-shadow: 0px 10px 40px 0px rgba(0,0,0,0.25);
  &__title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: @color-light-black;
  }
  &__desc {
    margin-bottom: 1rem;
    color: @color-dark-black;
  }
}
</style>
