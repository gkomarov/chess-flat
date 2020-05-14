<template>
  <Sidebar
    v-if="sidebarShow"
    title="Типовая планировка"
    @closeSidebar="closeSidebarToFlatsSchemas"
  >
    <AlertDefault
      v-if="singleErrorMessage"
      :message="singleErrorMessage"
      @alertDie="clearSingleError"
    />
    <div class="login-form">
      <img
        v-if="editMode"
        width="100"
        height="100"
        :src="flatSchemaImage"
      />
      <div class="form-group">
        <label class="form-group__label" for="type">Тип квартиры:</label>
        <div class="form-group__select">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.type"
              class="form-group__alert"
            >
              {{ errorsStack.type }}
            </span>
          </transition>
          <!-- Тип квартиры: <input v-model="type" name="type_apartment"/> -->
          <select
            v-model="type"
            type="flat_schema"
            name="type"
            id="type"
            :class="validationClass.type"
            @click="clearError"
          >
            <option
              v-for="(flatSchema, index) in staticFlatsSchemasTypes"
              :key="index"
              :value="index"
            >
              {{ flatSchema }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="area">Типовая площадь:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.area"
              class="form-group__alert"
            >
              {{ errorsStack.area }}
            </span>
          </transition>
          <input
            v-model="area"
            name="area"
            id="area"
            :class="validationClass.area"
            @click="clearError"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="number_of_balcony">Балконы: </label>
        <div class="form-group__input">
          <transition name="slide-fade">
          <span
            v-if="errorsStack.number_of_balcony"
            class="form-group__alert"
          >
            {{ errorsStack.number_of_balcony }}
          </span>
          </transition>
          <input
            v-model.number="numberOfBalcony"
            id="number_of_balcony"
            name="number_of_balcony"
            :class="validationClass.number_of_balcony"
            @click="clearError"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="number_of_rooms">Количество комнат:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
          <span
            v-if="errorsStack.number_of_rooms"
            class="form-group__alert"
          >
            {{ errorsStack.number_of_rooms }}
          </span>
          </transition>
          <input
            v-model.number="numberOfRooms"
            id="number_of_rooms"
            name="number_of_rooms"
            :class="validationClass.number_of_rooms"
            @click="clearError"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="number_of_loggia">Лоджии:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.number_of_loggia"
              class="form-group__alert"
            >
              {{ errorsStack.number_of_loggia }}
            </span>
          </transition>
          <input
            v-model.number="numberOfLoggia"
            name="number_of_loggia"
            id="number_of_loggia"
            :class="validationClass.number_of_loggia"
            @click="clearError"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="price">Цена:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.price"
              class="form-group__alert"
            >
              {{ errorsStack.price }}
            </span>
          </transition>
          <input
            v-model="price"
            name="price"
            id="price"
            :class="validationClass.price"
            @click="clearError"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <div class="form-group__image">
        <img v-if="!imagePreview" class="form-group__image_file" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4Ij4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSAxKSI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTI1NS0xQzExNC4yLTEtMSwxMTQuMi0xLDI1NXMxMTUuMiwyNTYsMjU2LDI1NnMyNTYtMTE1LjIsMjU2LTI1NlMzOTUuOC0xLDI1NS0xeiBNMjU1LDE2LjA2NyAgICAgYzYzLjA1NCwwLDEyMC41OTgsMjQuNzY0LDE2My40MTMsNjUuMDMzbC02NS4zMzYsNjQuODAyTDMzNC4zNiw5Ny45ODdjLTAuODUzLTIuNTYtNC4yNjctNS4xMi03LjY4LTUuMTJIMTg1LjAyNyAgICAgYy0zLjQxMywwLTUuOTczLDEuNzA3LTcuNjgsNS4xMkwxNTYuMDEzLDE1Mi42aC00OC42NGMtMTcuMDY3LDAtMzAuNzIsMTMuNjUzLTMwLjcyLDMwLjcydjE2OC45NiAgICAgYzAsMTcuMDY3LDEzLjY1MywzMC43MiwzMC43MiwzMC43Mmg2LjY1M2wtMzQuMjYsMzMuOTgxQzQwLjI4NSwzNzQuMzE5LDE2LjA2NywzMTcuMzU0LDE2LjA2NywyNTUgICAgIEMxNi4wNjcsMTIzLjU4NywxMjMuNTg3LDE2LjA2NywyNTUsMTYuMDY3eiBNMzE0LjczMywyNTVjMCwzMy4yOC0yNi40NTMsNTkuNzMzLTU5LjczMyw1OS43MzMgICAgIGMtMTMuNTYzLDAtMjUuOTktNC4zOTYtMzUuOTU3LTExLjg1NGw4NC4xMjUtODMuNDM4QzMxMC40NDksMjI5LjM0LDMxNC43MzMsMjQxLjYxNiwzMTQuNzMzLDI1NXogTTE5NS4yNjcsMjU1ICAgICBjMC0zMy4yOCwyNi40NTMtNTkuNzMzLDU5LjczMy01OS43MzNjMTMuNjY1LDAsMjYuMTc0LDQuNDY3LDM2LjE3OSwxMi4wMjhsLTg0LjE4Myw4My40OTUgICAgIEMxOTkuNjEzLDI4MC44NTIsMTk1LjI2NywyNjguNDg3LDE5NS4yNjcsMjU1eiBNMzAzLjM3NCwxOTUuMTk5QzI5MC4yMDEsMTg0LjU1OCwyNzMuMzk5LDE3OC4yLDI1NSwxNzguMiAgICAgYy00Mi42NjcsMC03Ni44LDM0LjEzMy03Ni44LDc2LjhjMCwxOC4xNyw2LjIwNiwzNC43NzksMTYuNjEsNDcuODc3bC02My41NzYsNjMuMDU3SDEwNi41MmMtNy42OCwwLTEzLjY1My01Ljk3My0xMy42NTMtMTMuNjUzICAgICBWMTgzLjMyYzAtNy42OCw1Ljk3My0xMy42NTMsMTMuNjUzLTEzLjY1M2g1NC42MTNjMy40MTMsMCw2LjgyNy0yLjU2LDcuNjgtNS4xMmwyMS4zMzMtNTQuNjEzaDEyOS43MDdsMTkuNDA0LDQ5LjY3NSAgICAgTDMwMy4zNzQsMTk1LjE5OXogTTIwNi44NDgsMzE0Ljk3NEMyMTkuOTg3LDMyNS41MDksMjM2LjcwMywzMzEuOCwyNTUsMzMxLjhjNDIuNjY3LDAsNzYuOC0zNC4xMzMsNzYuOC03Ni44ICAgICBjMC0xOC4wNjgtNi4xMzgtMzQuNTkyLTE2LjQzNi00Ny42NTVsMzcuOTg4LTM3LjY3OGg0OS4yNzRjNy42OCwwLDEzLjY1Myw1Ljk3MywxMy42NTMsMTMuNjUzdjE2OC45NiAgICAgYzAsNy42OC01Ljk3MywxMy42NTMtMTMuNjUzLDEzLjY1M0gxNTUuNDY5TDIwNi44NDgsMzE0Ljk3NHogTTI1NSw0OTMuOTMzYy02Mi45NTQsMC0xMjAuNDE1LTI0LjY4Ni0xNjMuMjA4LTY0Ljg0M0wxMzguMjYyLDM4MyAgICAgSDQwMy40OGMxNy4wNjcsMCwzMC43Mi0xMy42NTMsMzEuNTczLTMwLjcyVjE4My4zMmMwLTE3LjA2Ny0xMy42NTMtMzAuNzItMzAuNzItMzAuNzJIMzcwLjU2bDU5Ljg2NS01OS4zNzYgICAgIGMzOS4zNjgsNDIuNjM5LDYzLjUwOSw5OS41MjEsNjMuNTA5LDE2MS43NzZDNDkzLjkzMywzODYuNDEzLDM4Ni40MTMsNDkzLjkzMywyNTUsNDkzLjkzM3oiIGZpbGw9IiNkM2UxZTMiLz4KCQkJPHBhdGggZD0iTTM4MywxODYuNzMzYy05LjM4NywwLTE3LjA2Nyw3LjY4LTE3LjA2NywxNy4wNjdjMCw5LjM4Nyw3LjY4LDE3LjA2NywxNy4wNjcsMTcuMDY3czE3LjA2Ny03LjY4LDE3LjA2Ny0xNy4wNjcgICAgIEM0MDAuMDY3LDE5NC40MTMsMzkyLjM4NywxODYuNzMzLDM4MywxODYuNzMzeiIgZmlsbD0iI2QzZTFlMyIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" src1="imagePreview"/>
        <img v-else class="form-group__image_file" :src="imagePreview"/>
        <div class="form-group__image_grid">
          <label class="form-group__label form-group__image_label" for="image">Изображение: </label>
          <div class="form-group__input form-group__image_input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.image"
                class="form-group__alert"
              >
                {{ errorsStack.image }}
              </span>
            </transition>
            <input @change="processFile" name="image" type="file"/>
          </div>
          <button
            class="button button-icon form-group__image_remove"
            @click="resetImage"
            type="button"
          ></button>
        </div>
      </div>
      <ButtonDefault
        v-if="!editMode"
        name="Создать типовую планировку"
        color="grey"
        class="button-expand"
        :actionForClick="writeFlatSchema"
      />
      <ButtonDefault
        v-else
        name="Обновить"
        color="grey"
        class="button-expand"
        :actionForClick="updateFlatSchema"
      />
    </div>
  </Sidebar>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import AlertDefault from './AlertDefault'
import Sidebar from './Sidebar'

export default {
  name: 'HouseFlatsSchemasAdd',
  data () {
    return {
      type: this.selectedFlatSchema.type || '',
      flatSchemaId: this.selectedFlatSchema.hash_id || '',
      area: this.selectedFlatSchema.area || '',
      numberOfBalcony: this.selectedFlatSchema.number_of_balcony || '',
      numberOfLoggia: this.selectedFlatSchema.number_of_loggia || '',
      numberOfRooms: this.selectedFlatSchema.number_of_rooms || '',
      price: this.selectedFlatSchema.price || '',
      flatSchemaImage: this.selectedFlatSchema.image || '',
      imagePreview: '',
      staticFlatsSchemasTypes: {
        'studio_flat': 'Студия',
        'one_room_flat': 'Однокомнатная',
        'two_room_flat': '2х-комнатная',
        'three_room_flat': '3х-комнатная',
        'four_room_flat': '4х-комнатная',
        'five_room_flat': '5и-комнатная',
        'euro_two_room_flat': 'Евро 2х-комнатная',
        'euro_three_room_flat': 'Евро 3х-комнатная'
      },
      errorsStack: []
    }
  },
  props: {
    storeIndex: String,
    houseId: {
      type: String,
      require: true
    },
    selectedFlatSchema: Object,
    editMode: {
      type: Boolean,
      default: false
    },
    sidebarShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ButtonDefault,
    AlertDefault,
    Sidebar
  },
  methods: {
    closeSidebarToFlatsSchemas () {
      this.$emit('closeSidebar')
    },
    resetImage () {
      this.flatSchemaImage = ''
      this.imagePreview = ''
    },
    storeFlatSchema (FlatSchemaIdPath = '', action = 'writeItem') {
      let flatSchemaProperties = new FormData()
      const data = {
        house_id: this.houseId,
        flats_schemas_id: this.flatSchemaId || '',
        type: this.type,
        area: this.area,
        number_of_balcony: this.numberOfBalcony,
        number_of_rooms: this.numberOfRooms,
        number_of_loggia: this.numberOfLoggia,
        price: this.price,
        image: this.flatSchemaImage
      }
      for (let i in data) {
        flatSchemaProperties.append(i, data[i])
      }
      return this.$store.dispatch(action, {
        fields: flatSchemaProperties,
        url: '/flats-schemas' + FlatSchemaIdPath,
        storageName: 'houseFlatsSchemas'
      })
    },
    writeFlatSchema () {
      this.storeFlatSchema()
        .then(() => {
          this.$emit('refreshAfterChange')
        })
        .catch(error => {
          this.errorsStack = error.response.data
        })
    },
    updateFlatSchema () {
      this.storeFlatSchema('/' + this.selectedFlatSchema.hash_id, 'updateItem')
        .then(() => {
          this.$emit('refreshAfterChange')
        })
        .catch(error => {
          this.errorsStack = error.response.data
          console.info(error.response.data)
        })
    },
    clearSingleError () {
      // Общее напоминание чистится методом удаления свойства single_error
      this.$delete(this.errorsStack, 'single_error')
    },
    clearError (event) {
      // Получаем id элемента и удаляем его из стека ошибок
      // Vue автоматически отреагирует на это, скрыв отображение
      let item = event.target.id
      this.$delete(this.errorsStack, item)
      this.clearSingleError()
    },
    processFile (event) {
      this.flatSchemaImage = event.target.files[0]
      let reader = new FileReader()
      reader.onprogress = (progress) => {
        console.info(progress)
      }
      reader.onloadend = () => {
        this.imagePreview = reader.result
      }
      if (this.flatSchemaImage) {
        reader.readAsDataURL(this.flatSchemaImage)
      } else {
        this.imagePreview = ''
      }
    }
  },
  computed: {
    singleErrorMessage () {
      if (this.errorsStack.single_error) {
        return this.errorsStack.message
      } else {
        return null
      }
    },
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

<style lang="less" scoped>
@import (less) "../../static/less/button.less";
@import (less) "../../static/less/color.less";
@import (less) "../../static/less/global.less";
@import (less) "../../static/less/media.less";
@import (less) "../../static/less/form.less";
.form-group__image {
  margin-bottom: 2rem;
}
.form-group__image_file {
  object-fit: contain;
  width: 100%;
  padding: 0 4rem;
}
.form-group__image_grid {
  display: grid;
  grid-column-gap: 1rem;
  align-items: center;
  grid-template-columns: auto 1fr auto ;
  input {
    border: none;
  }
}
</style>
