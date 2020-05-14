<template>
  <AuthContainer>
    <div class="login-form" v-if="!send">
      <div class="login-title">Регистрация пользователя</div>
      <div class="form-group">
        <label class="form-group__label" for="company_name">Компания:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.company_name"
              class="form-group__alert"
            >
              {{ errorsStack.company_name[0]}}
            </span>
          </transition>
          <input
            :class="validationClass.company_name"
            v-model="companyName"
            @click="clearError"
            type="text"
            id="company_name"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-group__label" for="last_name">Фамилия:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.last_name"
              class="form-group__alert"
            >
              {{ errorsStack.last_name[0] }}
            </span>
          </transition>
          <input
            :class="validationClass.last_name"
            v-model="lastName"
            @click="clearError"
            type="text"
            id="last_name"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-group__label" for="first_name">Имя:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.first_name"
              class="form-group__alert"
            >
              {{ errorsStack.first_name[0] }}
            </span>
          </transition>
          <input
            :class="validationClass.first_name"
            v-model="firstName"
            @click="clearError"
            type="text"
            id="first_name"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-group__label" for="middle_name">Отчество:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.middle_name"
              class="form-group__alert"
            >
              {{ errorsStack.middle_name[0] }}
            </span>
          </transition>
          <input
            :class="validationClass.middle_name"
            v-model="middleName"
            @click="clearError"
            type="text"
            id="middle_name"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-group__label" for="email">Email:</label>
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
            @click="clearError"
            type="email"
            id="email"
            required
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-group__label" for="phone">Телефон:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.phone"
              class="form-group__alert"
            >
              {{ errorsStack.phone[0] }}
            </span>
          </transition>
          <input
            :class="validationClass.phone"
            v-model="phone"
            @click="clearError"
            id="phone"
            required
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="password">Пароль:</label>
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
            @click="clearError"
            id="password"
            required
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-group__label" for="password_confirmation">Повторить пароль:</label>
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
            @click="clearError"
            id="password_confirmation"
            required
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>

      <div class="form-group">
        <div></div>
        <div class="form-group__input">

          <input
            :class="validationClass.is_agree_with_save_personal_data"
            class="toggle"
            v-model="isAgreeWithSavePersonalData"
            @click="clearError"
            type="checkbox"
            id="is_agree_with_save_personal_data"
          />
          <label for="is_agree_with_save_personal_data">Я принимаю договор-оферту и даю согласие на обработку
            персональных данных</label>
        </div>
      </div>
      <div v-if="singleErrorMessage" class="static-error">
        {{ singleErrorMessage }}
      </div>
      <ButtonDefault
        class="button-expand"
        name="Отправить"
        color="green"
        :actionForClick="register"
      />
    </div>
    <div class="login-reset" v-else>
      <div class="login-reset__title">Отлично! Осталось подтвердить ваш email. На вашу почту отправлено письмо с
        подтверждением.
      </div>
      <div class="login-reset__email">{{ this.email }}</div>
      <div class="login-button">
        <div class="login-button__register">
          <div class="login-button__register_title">Есть учетная запись?</div>
        </div>
        <div class="login-button__register">
          <router-link to="/login" class="link">Авторизуйтесь здесь</router-link>
        </div>
      </div>
    </div>
  </AuthContainer>
</template>

<script>
import CommonMethods from './CommonMethods'
import AuthContainer from './AuthContainer'
import ButtonDefault from './ButtonDefault'

export default {
  name: 'AuthRegister',
  data () {
    return {
      companyName: '',
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      errorsStack: [],
      isAgreeWithSavePersonalData: false,
      send: false
    }
  },
  components: {
    AuthContainer,
    ButtonDefault
  },
  mixins: [ CommonMethods ],
  methods: {
    register () {
      if (this.password === this.passwordConfirmation) {
        const data = JSON.stringify({
          company_name: this.companyName,
          first_name: this.firstName,
          last_name: this.lastName,
          middle_name: this.middleName,
          email: this.email,
          is_agree_with_save_personal_data: this.isAgreeWithSavePersonalData,
          phone: this.phone,
          password: this.password,
          password_confirmation: this.passwordConfirmation
        })
        this.$store.dispatch('registerUser', data)
          .then(() => {
            this.send = true
          })
          .catch(error => {
            this.errorsStack = error.response.data
          })
      } else {
        this.errorsStack['password_confirmation'] = 'Пароли должны совпадать'
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
@import (less) "../../static/less/button.less";
</style>
