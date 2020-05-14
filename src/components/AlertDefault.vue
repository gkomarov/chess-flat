<template>
  <transition
    name="slide-fade"
    class="uk-alert"
    :alertType="alertType">
    <div v-if="message">{{ message }}</div>
  </transition>
</template>

<script>
export default {
  name: 'AlertDefault',
  props: {
    message: {
      type: String,
      required: true
    },
    alertType: {
      type: String,
      default: 'warning'
    }
  },
  created () {
    const context = this
    setTimeout(function () {
      context.$emit('alertDie')
    }, 3000)
  }
}
</script>

<style scoped>
  /* Анимации появления и исчезновения могут иметь */
  /* различные продолжительности и динамику.       */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active до версии 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
