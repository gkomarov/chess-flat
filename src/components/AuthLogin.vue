<template>
  <AuthContainer>
    <div class="login-title">Личный кабинет</div>
    <form class="login-form" @submit.prevent>
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
            id="password"
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
            :actionForClick="login"
            name="Войти"
            color="green"
            class="button-expand"
          />
        </div>
        <div class="login-button__register">
          <div class="login-button__register_title">Ещё нет аккаунта?</div>
          <router-link to="/register/" class="link">Пройти простую регистрацию</router-link>
        </div>
        <div class="login-button__reset">
          <router-link to="/password/email/" class="link">Восстановить пароль</router-link>
        </div>
      </div>
    </form>
  </AuthContainer>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import AuthContainer from './AuthContainer'

export default {
  name: 'AuthLogin',
  data () {
    return {
      email: '',
      password: '',
      errorsStack: []
    }
  },
  components: {
    AuthContainer,
    ButtonDefault
  },
  methods: {
    login () {
      this.$store.dispatch('retrieveAuthData', {
        email: this.email,
        password: this.password
      })
        .then(() => {
          this.$router.push('/')
        })
        .catch(error => {
          this.errorsStack = error.response.data
        })
    },
    clearError (event) {
      // Получаем id элемента и удаляем его из стека ошибок
      // Vue автоматически отреагирует на это, скрыв отображение
      let item = event.target.id
      this.$delete(this.errorsStack, item)
      // Общее напоминание чистится методом удаления свойства single_error
      this.$delete(this.errorsStack, 'single_error')
    }
  },
  computed: {
    validationClass () {
      let errors = {}
      // Возвращается массив с набором элементов, для которых отрисовывается класс error
      // Если элемент удалён из стека ошибок, то и здесь его не будет
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

<style lang="less" scoped>
@import (less) "../../static/less/color.less";
@import (less) "../../static/less/global.less";
@import (less) "../../static/less/media.less";
@import (less) "../../static/less/form.less";
</style>
