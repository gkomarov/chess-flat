<template>
  <Sidebar
    class="floors-add"
    v-if="sidebarShowComputed"
    title="Типовой этаж"
    @closeSidebar="closeSidebarToFloor"
  >
    <AlertDefault
      v-if="errorsStack.single_error"
      :message="errorsStack.message"
      @alertDie="clearSingleError"
    />
    <div>
      <div class="form-group">
        <label class="form-group__label" for="floor_number">№ этажа:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.floor_number"
              class="form-group__alert"
            >
              {{ errorsStack.floor_number }}
            </span>
          </transition>
          <input
            v-model.number="floorNumber"
            name="floor_number"
            id="floor_number"
            :class="validationClass.floor_number"
            @click="clearError"
          />
        </div>
      </div>
      <div v-if="!editMode">
        Клонировать для этажей:
        <div class="clone-items">
          <span class="clone-item"
            v-for="(floorNumber, index) in convertFloorRangeToSequence(cloneFloorsList)"
            :key="index"
          >
            <input
              v-model="cloneFloors"
              class="clone-floor"
              type="checkbox"
              :id="floorNumber"
              :value="floorNumber"
            />
            <label :for="floorNumber">{{ floorNumber }}</label>
          </span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label" for="number_of_flats">Квартир на этаже:</label>
        <div class="form-group__input">
          <transition name="slide-fade">
            <span
              v-if="errorsStack.number_of_flats"
              class="form-group__alert"
            >
              {{ errorsStack.number_of_flats }}
            </span>
          </transition>
          <input
            v-model="numberOfFlats"
            name="number_of_flats"
            id="number_of_flats"
            :class="validationClass.number_of_flats"
            @click="clearError"
          />
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
        name="Создать этаж"
        color="green"
        class="button-expand"
        :actionForClick="writeFloor"
      />
      <ButtonDefault
        v-else
        name="Обновить"
        color="green"
        class="button-expand"
        :actionForClick="updateFloor"
      />
    </div>
  </Sidebar>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import Sidebar from './Sidebar'
import AlertDefault from './AlertDefault'

export default {
  name: 'HouseFloorsAdd',
  data () {
    return {
      floorNumber: this.selectedFloor.number || this.freeFloors.firstValidFloor,
      numberOfFlats: this.selectedFloor.number_of_flats || '',
      cloneFloors: this.selectedFloor.clone_floors || [],
      cloneFloorsList: this.freeFloors.cloneFloorsList || [],
      floorImage: this.selectedFloor.image || '',
      imagePreview: '',
      errorsStack: {}
    }
  },
  props: {
    storeIndex: String,
    houseId: {
      type: String,
      require: true
    },
    freeFloors: Object,
    selectedFloor: Object,
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
    AlertDefault,
    ButtonDefault,
    Sidebar
  },
  methods: {
    closeSidebarToFloor () {
      this.$emit('closeSidebar')
    },
    resetImage () {
      this.floorImage = ''
      this.imagePreview = ''
    },
    storeFloor (floorIdPath = '', action = 'writeItem') {
      let floorProperties = new FormData()
      const data = {
        api_key: this.$store.state.apiKey,
        house_id: this.houseId,
        number: this.floorNumber,
        number_of_flats: this.numberOfFlats,
        clone_floors: this.cloneFloors.join(),
        image: this.floorImage
      }
      for (let i in data) {
        floorProperties.append(i, data[i])
      }
      return this.$store.dispatch(action, {
        fields: floorProperties,
        url: '/floor-types' + floorIdPath,
        storageName: 'houseFloor'
      })
    },
    writeFloor () {
      this.storeFloor()
        .then(() => {
          this.$emit('refreshAfterChange')
        })
        .catch(error => {
          this.errorsStack = error.response.data
          console.info(error)
        })
    },
    updateFloor () {
      this.storeFloor('/' + this.selectedFloor.hash_id, 'updateItem')
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
      this.floorImage = event.target.files[0]
      let reader = new FileReader()
      reader.onloadend = () => {
        this.imagePreview = reader.result
      }
      if (this.floorImage) {
        reader.readAsDataURL(this.floorImage)
      } else {
        this.imagePreview = ''
      }
    },
    convertFloorRangeToSequence (floorsRange) {
      let floorSequence = []
      /** Изначально параметр имеет вид строки (например 2,12).
       * Из этой строки делается последовательность от 2 до 12 вида [2,3,4...12] */
      for (let i = Number(floorsRange[0]); i <= Number(floorsRange[floorsRange.length - 1]); i++) {
        floorSequence.push(i)
      }
      return floorSequence
    }
  },
  watch: {
    cloneFloors (floors) {
      let lastSelectedFloor = floors[floors.length - 1]
      let preLastSelectedFloor = floors[floors.length - 2]
      if ((lastSelectedFloor - preLastSelectedFloor) > 1) {
        this.cloneFloors.pop()
        this.errorsStack['single_error'] = true
        this.errorsStack['message'] = 'Клонируйте этажи последовательно'
      }
      let firsValidFloor = this.cloneFloorsList[0]
      if (floors[0] > firsValidFloor) {
        this.cloneFloors.pop()
        this.errorsStack['single_error'] = true
        this.errorsStack['message'] = 'Вы не можете оставить предыдущие этажи пустыми'
      }
    }
  },
  computed: {
    sidebarShowComputed () {
      return this.sidebarShow
    },
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
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/form.less";
  @import (less) "../../static/less/media.less";
  .floors-add {
    .clone {
      &-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, 34px);
        grid-column-gap: 0.25rem;
        grid-row-gap: 0.25rem;
        margin-top: 1rem;
        margin-bottom: 2rem;
      }
      &-item {
        label {
          color: #FFFFFF;
          background-color: darken(@color-light-grey, 15%);
          padding: 0.5rem;
          display: block;
          text-align: center;
          border-radius: 3px;
          cursor: pointer;
        }
        input {
          display: none;
        }
        input[type="checkbox"]:checked + label {
          background-color: @color-light-green;
        }
      }
    }
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
  }

</style>
