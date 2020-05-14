<template>
  <AuthContainer>
    <div class="form-group">
      <label class="form-group__label" for="password">Пароль</label>
      <div class="form-group__input">
        <transition name="slide-fade">
          <span
            v-if="errorsStack.password"
            class="form-group__alert"
          >
            {{ errorsStack.password[0] }}
          </span>
        </transition>
        <input
          :class="validationClass.password"
          v-model="password"
          @click = "clearError"
          type="password"
          id="password"
        />
        <span class="form-group__input_bar"></span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-group__label" for="password_confirmation">Повторить пароль</label>
      <div class="form-group__input">
        <transition name="slide-fade">
          <span
            v-if="errorsStack.password_confirmation"
            class="form-group__alert"
          >
            {{ errorsStack.password_confirmation[0] }}
          </span>
        </transition>
        <input
          :class="validationClass.password_confirmation"
          v-model="passwordConfirmation"
          @click = "clearError"
          type="password"
          id="password_confirmation"
        />
        <span class="form-group__input_bar"></span>
      </div>
    </div>
    <div v-if="singleErrorMessage" class="login-alert">
      {{ singleErrorMessage }}
    </div>
    <ButtonDefault
      v-if="!sendingOut"
      :actionForClick="resetPassword"
      name="Восстановить пароль"
      color="green"
    />
    <BeatLoader v-else/>
  </AuthContainer>
</template>

<script>
import axios from 'axios'
import AuthContainer from './AuthContainer'
import CommonMethods from './CommonMethods'
import ButtonDefault from './ButtonDefault'
import BeatLoader from './BeatLoader'

export default {
  name: 'AuthPasswordReset',
  data () {
    return {
      password: '',
      passwordConfirmation: '',
      send: false,
      sendingOut: false,
      errorsStack: [],
      singleErrorMessage: ''
    }
  },
  components: {
    AuthContainer,
    ButtonDefault,
    BeatLoader
  },
  mixins: [ CommonMethods ],
  methods: {
    resetPassword () {
      if (this.password === this.passwordConfirmation) {
        var data = JSON.stringify({
          password: this.password,
          password_confirmation: this.passwordConfirmation,
          /** Параметр password_code берётся из url */
          password_code: this.$route.params.password_code
        })
        axios.post(this.$rootUrl + '/password/reset', data)
          .then(response => {
            const loginData = {
              apiKey: response.data.api_key,
              companyHashId: response.data.company_hash_id
            }
            this.send = true
            this.$store.dispatch('storeLoginData', loginData)
              .then(() => {
                this.$router.push('/')
              })
              .catch((error) => {
                this.showError(error, this)
              })
          })
          .catch(error => {
            this.showError(error, this)
          })
      } else {
        this.singleErrorMessage = 'Пароли не совпадают'
      }
    }
  },
  computed: {
    validationClass () {
      let errors = {}
      for (let item in this.errorsStack) {
        errors[item] = 'error'
      }
      return errors
    }
  }
}
</script>

<style scoped>

</style>
