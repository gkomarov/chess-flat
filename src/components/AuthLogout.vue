<template>
  <AlertDefault v-if="alert.alive"
    :message="alert.message"
    :alertType="alert.type"
  />
</template>

<script>
import AlertDefault from './AlertDefault'
import CommonMethods from './CommonMethods'

export default {
  name: 'AuthLogout',
  components: { AlertDefault },
  data () {
    return {
      alert: {
        alive: false,
        type: 'danger',
        message: ''
      }
    }
  },
  mixins: [ CommonMethods ],
  created () {
    this.$store.dispatch('destroyApiKey')
      .then(() => {
        this.$router.push('/')
      })
      .catch((error) => {
        const alert = this.alert
        if (error.response.status === 500) {
          this.alert.message = 'Что-то пошло не так.'
        } else {
          this.alert.message = error.response.data.message
        }
        alert.alive = true
        setTimeout(function () {
          alert.alive = false
        }, 3000)
      })
  }
}
</script>

<style scoped>

</style>
