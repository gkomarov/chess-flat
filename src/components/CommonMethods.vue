<template>
  <div></div>
</template>

<script>

export default {
  name: 'CommonMethods',
  methods: {
    showError (error, pointer) {
      if (error.response !== undefined) {
        const errorMessages = error.response.data
        if (errorMessages.single_error) {
          pointer.singleErrorMessage = errorMessages.message
        } else {
          for (let i in errorMessages) {
            let textError = errorMessages[i][0]
            pointer[i].validationClass = 'error'
            pointer[i].validationText = textError
          }
        }
      } else {
        pointer.singleErrorMessage = 'Что-то пошло не так.'
      }
    },
    clearError (event) {
      let item = event.target.id
      this.$delete(this.errorsStack, item)
      this.singleErrorMessage = ''
    },
    showAlert (errorObject, type, alert) {
      const errorStatus = errorObject.response.status
      if (errorStatus !== 'undefined') {
        const errorMessages = errorObject.response.data
        for (let i in errorMessages) {
          let message = errorMessages[i]
          alert.message = message
        }
      } else {
        alert.message = 'Что-то пошло не так.'
      }
      alert.alive = true
      setTimeout(function () {
        alert.alive = false
      }, 3000)
    },
    resetData () {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style scoped>

</style>
