<template>
  <div class="buildings-properties">
    <div class="properties-form">
      <div class="form-title">Введите информацию о комплексе:</div>
      <div class="form-group properties-title">
        <label class="form-group__label" for="name">Название ЖК</label>
        <div class="form-group__input">
          <transition name="slide-fade">
              <span
                v-if="errorsStack.name"
                class="form-group__alert"
              >
                {{ errorsStack.name[0] }}
              </span>
          </transition>
          <input
            @click="clearError"
            v-model="name"
            id="name"
            name="name"
            type="text"
            :class="validationClass.name"
          />
          <span class="form-group__input_bar"></span>
        </div>
      </div>
      <AlertDefault
        v-if="singleErrorMessage"
        :message="singleErrorMessage"
        @alertDie="singleErrorMessage = ''"
      />
      <div class="form-subtitle">Расположение:</div>
      <div class="form-grid">
        <div class="form-group properties-group">
          <label class="form-group__label label" for="country">Страна</label>
          <div class="form-group__input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.country"
                class="form-group__alert"
              >
                {{ errorsStack.country[0] }}
              </span>
            </transition>
            <input
              v-model="country"
              name="country"
              id="country"
              :class="validationClass.country"
              @click="clearError"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group properties-group">
          <label class="form-group__label label" for="region">Регион</label>
          <div class="form-group__input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.region"
                class="form-group__alert"
              >
                {{ errorsStack.region[0] }}
              </span>
            </transition>
            <input
              v-model="region"
              name="region"
              id="region"
              :class="validationClass.region"
              @click="clearError"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group properties-group">
          <label class="form-group__label label" for="currency">Валюта</label>
          <div class="form-group__input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.currency"
                class="form-group__alert"
              >
                {{ errorsStack.currency[0] }}
              </span>
            </transition>
            <input
              v-model="currency"
              name="currency"
              id="currency"
              :class="validationClass.currency"
              @click="clearError"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group properties-group">
          <label class="form-group__label label" for="city">Город</label>
          <div class="form-group__input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.city"
                class="form-group__alert"
              >
                {{ errorsStack.city[0] }}
              </span>
            </transition>
            <input
              v-model="city"
              name="city"
              id="city"
              :class="validationClass.city"
              @click="clearError"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group properties-group">
          <label class="form-group__label label" for="district">Район</label>
          <div class="form-group__input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.district"
                class="form-group__alert"
              >
                {{ errorsStack.district[0] }}
              </span>
            </transition>
            <input
              v-model="district"
              name="district"
              id="district"
              :class="validationClass.district"
              @click="clearError"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <!--<div class="form-group properties-group">
          <label class="form-group__label label" for="video">Видео</label>
          <div class="form-group__input">
            <input v-model="video" name="video" />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group properties-group">
          <label class="form-group__label label" for="images">Картинки</label>
          <div class="form-group__input">
            <input v-model="images" name="images" />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group properties-group">
          <label class="form-group__label label" for="coordinates">Координаты</label>
          <div class="form-group__input">
            <transition name="slide-fade">
              <span
                v-if="errorsStack.coordinates"
                class="form-group__alert"
              >
                {{ errorsStack.coordinates[0] }}
              </span>
            </transition>
            <input
              v-model="coords"
              name="coordinates"
              :class="validationClass.coordinates"
              @click="clearError"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>-->
      </div>
      <div>
        <ButtonDefault
          v-if="!editMode"
          name="Сохранить"
          color="green"
          :actionForClick = "storeBuildingsProperties"
        />
        <ButtonDefault
          v-else
          name="Обновить"
          color="green"
          :actionForClick = "updateBuildingsProperties"
        />
      </div>
    </div>
    <div class="properties-media">
      <div class="media-create">
        <button type="button" button-color="yellow" class="button button-expand">
          Добавить фото и видео
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import AlertDefault from './AlertDefault'

export default {
  name: 'BuildingProperties',
  components: {
    ButtonDefault,
    AlertDefault
  },
  data () {
    return {
      hashId: '',
      name: '',
      region: '',
      district: '',
      city: '',
      country: '',
      video: '',
      images: '',
      coords: [],
      currency: '',
      errorsStack: [],
      editMode: false
    }
  },
  created () {
    let buildingStoreIndex = this.$route.params.buildingStoreIndex
    if (buildingStoreIndex !== undefined) {
      this.$store.dispatch('setItemToStore', {
        storageName: 'currentBuildingStoreIndex',
        fields: buildingStoreIndex
      })
    }
    let currentBuildingStoreIndex = this.$store.state.currentBuildingStoreIndex
    // Если в Store есть индекс массива текущего строения, то значит пользователь редактирует
    if (currentBuildingStoreIndex !== null) {
      this.editMode = true
      this.fillLinesByData(currentBuildingStoreIndex)
    }
  },
  methods: {
    storeBuildingsProperties (buildingIdPath = '', action = 'writeItem') {
      const data = {
        company_id: this.$store.state.companyHashId,
        name: this.name,
        region: this.region,
        district: this.district,
        city: this.city,
        country: this.country,
        video: this.video,
        images: this.images,
        coordinates: this.coords,
        currency: this.currency
      }
      this.$store.dispatch(action, {
        fields: data,
        url: '/buildings' + buildingIdPath,
        storageName: 'buildingProperties'
      })
        .then(() => {
          this.$router.push('/')
        })
        .catch(error => {
          this.errorsStack = error.response.data
        })
    },
    updateBuildingsProperties () {
      this.storeBuildingsProperties('/' + this.hashId, 'updateItem')
    },
    fillLinesByData (storeIndex) {
      let buildingsJson = this.$store.state.buildings
      let building = JSON.parse(buildingsJson)[storeIndex].building

      this.hashId = building.hash_id
      this.name = building.name
      this.country = building.country
      this.region = building.region
      this.currency = building.currency
      this.city = building.city
      this.district = building.district
      this.video = building.video
      this.images = building.images
      this.coords = building.coordinates
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
  @import (less) "../../static/less/button.less";
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";
  .buildings-properties {
    display: grid;
    align-items: flex-start;
    grid-template-columns: 1fr 400px;
    grid-column-gap: 3rem;
    grid-row-gap: 2rem;
    @media @xdesktop {
      grid-template-columns: 1fr;
    }
    .properties {
      &-form {
        background-color: @color-white;
        .padding(@v: 3rem);
        @media @desktop {
          .padding(@v: 2rem);
        }
        .form {
          &-title {
            .font(@s: 1.75rem;@w: 100;);
            margin-bottom: 2rem;
          }
          &-subtitle {
            color: @color-light-black;
            .font(@s: 1.25rem;@w: 100;);
            margin-top: 4rem;
            margin-bottom: 2rem;
          }
          &-grid {
            .grid(@c: 2;@cg: 6rem; @rg: 1rem);
            @media @desktop {
              .grid(@c: 2;@cg: 3rem; @rg: 1rem);
            }
            @media @mobile {
              .grid(@c: 1;@cg: 0rem; @rg: 1rem);
            }
          }
        }
      }
      &-title {
        grid-template-columns: 125px 1fr;
        @media @mobile {
          .grid(@c: 1;@cg: 6rem; @rg: 0rem);
        }
        label {
          color: @color-dark-grey ;
        }
        input {
          .font(@s: 1.75rem; @w: 100);
          text-align: center;
          @media @mobile {
            .font(@s: 1.25rem; @w: 400);
            text-align: left;
          }
        }
      }
      &-group {
        grid-template-columns: 120px 1fr;
        @media @tablet {
          .grid(@c: 1; @cg: 6rem; @rg: 0rem);
        }
        label {
          color: @color-dark-grey ;
          .font(@s: 0.875rem;);
        }
        input {
          @media @tablet {
            padding: 10px 0;
          }
        }
      }
      &-media {
        background-color: @color-white;
        .padding(@v: 3rem);
        @media @desktop {
          .padding(@v: 2rem);
        }
        .media {
          &-create {
            .padding(@v: 2rem);
            border: 3px dashed @color-light-grey;
          }
        }
      }
    }
  }
</style>
