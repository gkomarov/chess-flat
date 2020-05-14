<template>
  <AuthContainer>
    <div>
      <div v-if="!send">
        <div class="login-title">Сброс пароля</div>
        <form @submit.prevent>
          <div class="form-group">
            <label class="form-group__label" for="email">Email</label>
            <div class="form-group__input">
              <transition name="slide-fade">
              <span
                v-if="errorsStack.email"
                class="form-group__alert"
              >
                {{ errorsStack.email[0] }}
              </span>
              </transition>
              <input
                :class="validationClass.email"
                v-model="email"
                @click = "clearError"
                type="email"
                id="email"
              />
              <span class="form-group__input_bar"></span>
            </div>
          </div>

          <div v-if="singleErrorMessage" class="login-alert">
            {{ singleErrorMessage }}
          </div>
      <div class="login-button">
        <div>
          <ButtonDefault
            v-if="!sendingOut"
            class="button-expand"
            name="Восстановить"
            color="green"
            :actionForClick="sentEmailForResetPassword"
          />
          <BeatLoader v-else/>
        </div>
        <div class="login-button__register">
          <div class="login-button__register_title">Вспомнили пароль?</div>
          <router-link to="/login" class="link">Авторизуйтесь здесь</router-link>
        </div>
      </div>
        </form>
      </div>
      <div class="login-reset" v-else>
        <div class="login-reset__title">Письмо с информацией для смены пароля отправлено на адрес:</div>
        <div class="login-reset__email">{{ this.email }}</div>

        <div class="login-button">
          <div class="login-button__register">
            <div class="login-button__register_title">Вспомнили пароль?</div>
          </div>
          <div class="login-button__register">
            <router-link to="/login" class="link">Авторизуйтесь здесь</router-link>
          </div>
        </div>
     </div>
    </div>
  </AuthContainer>
</template>

<script>
import AuthContainer from './AuthContainer'
import ButtonDefault from './ButtonDefault'
import BeatLoader from './BeatLoader'

export default {
  name: 'AuthPasswordEmail',
  data () {
    return {
      email: '',
      send: false,
      sendingOut: false,
      errorsStack: []
    }
  },
  components: {
    AuthContainer,
    ButtonDefault,
    BeatLoader
  },
  methods: {
    sentEmailForResetPassword () {
      this.sendingOut = true
      this.$store.dispatch('writeItem', {
        url: '/password/email',
        fields: { email: this.email }
      })
        .then(() => {
          this.send = true
          this.sendingOut = false
        })
        .catch(error => {
          this.errorsStack = error.response.data
          this.sendingOut = false
        })
    }
  },
  computed: {
    validationClass () {
      let errors = {}
      for (let item in this.errorsStack) {
        errors[item] = 'error'
      }
      return errors
    },
    singleErrorMessage () {
      if (this.errorsStack.single_error) {
        return this.errorsStack.message
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
</style>
