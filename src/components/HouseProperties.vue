<template>
  <div>
    <HouseContainer>
      <AlertDefault
        v-if="singleErrorMessage"
        :message="singleErrorMessage"
        @alertDie="singleErrorMessage = ''"
      />
      <div class="house-properties">
        <div class="properties">
          <div class="properties-characteristics">
            <div class="characteristics-title">Введите характеристики дома:</div>
            <div class="characteristics-grid">
              <div class="form-group">
                <label class="form-group__label" for="number_of_floors">Всего этажей</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.number_of_floors"
                      class="form-group__alert"
                    >
                      {{ errorsStack.number_of_floors }}
                    </span>
                  </transition>
                  <input
                    v-model="numberOfFloors"
                    type="text"
                    id="number_of_floors"
                    :class="validationClass.number_of_floors"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="living_floors">С</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.livingFloorsStart"
                      class="form-group__alert"
                    >
                      {{ errorsStack.living_floors }}
                    </span>
                  </transition>
                  <input
                    v-model="livingFloorsStart"
                    type="text"
                    id="living_floors"
                    name="living_floors"
                    :class="validationClass.living_floors"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="livingFloorsEnd">По</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.living_floors"
                      class="form-group__alert"
                    >
                      {{ errorsStack.living_floors }}
                    </span>
                  </transition>
                  <input
                    v-model="livingFloorsEnd"
                    type="text"
                    id="livingFloorsEnd"
                    name="livingFloorsEnd"
                    :class="validationClass.number_of_floors"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="number_of_entrance">Подъездов</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.number_of_entrance"
                      class="form-group__alert"
                    >
                      {{ errorsStack.number_of_entrance }}
                    </span>
                  </transition>
                  <input
                    v-model="numberOfEntrance"
                    type="text"
                    id="number_of_entrance"
                    :class="validationClass.number_of_entrance"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="number_of_flat">Квартир</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.number_of_flat"
                      class="form-group__alert"
                    >
                      {{ errorsStack.number_of_flat }}
                    </span>
                  </transition>
                  <input
                    v-model="numberOfFlat"
                    type="text"
                    id="number_of_flat"
                    :class="validationClass.number_of_flat"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="streetName">Улица</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.street_name"
                      class="form-group__alert"
                    >
                      {{ errorsStack.street_name }}
                    </span>
                  </transition>
                  <input
                    v-model="streetName"
                    type="text"
                    id="street_name"
                    name="street_name"
                    :class="validationClass.street_name"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="number">№ дома</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.number"
                      class="form-group__alert"
                    >
                      {{ errorsStack.number }}
                    </span>
                  </transition>
                  <input
                    v-model="number"
                    type="text"
                    id="number"
                    :class="validationClass.number"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="finishing">Отделка</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.finishing"
                      class="form-group__alert"
                    >
                      {{ errorsStack.finishing }}
                    </span>
                  </transition>
                  <input
                    v-model="finishing"
                    type="text"
                    id="finishing"
                    :class="validationClass.finishing"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="stage_development">Этап строительства</label>
                <div class="form-group__input">
                  <transition name="slide-fade">
                    <span
                      v-if="errorsStack.stage_development"
                      class="form-group__alert"
                    >
                      {{ errorsStack.stage_development }}
                    </span>
                  </transition>
                  <input
                    v-model="stageDevelopment"
                    type="text"
                    id="stageDevelopment"
                    :class="validationClass.stage_development"
                    @click="clearError"
                  />
                  <span class="form-group__input_bar"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="startDevelopment">Начало строительства</label>
                <div class="form-group__input">
                  <input
                    @click="startDevelopment.calendarIsActive = !startDevelopment.calendarIsActive"
                    v-model="startDevelopment.value"
                    type="text"
                    id="startDevelopment"
                  />
                  <span class="form-group__input_bar"></span>
                  <DraggableCal
                    class="characteristics-cal"
                    v-if="startDevelopment.calendarIsActive"
                    :days=Number(1095)
                    @dateSelected="dateSelected(startDevelopment, $event)"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="endDevelopment">Конец строительства</label>
                <div class="form-group__input">
                  <input
                    @click="endDevelopment.calendarIsActive = !endDevelopment.calendarIsActive"
                    v-model="endDevelopment.value"
                    type="text"
                    id="endDevelopment"
                  />
                  <span class="form-group__input_bar"></span>
                  <DraggableCal
                    class="characteristics-cal"
                    v-if="endDevelopment.calendarIsActive"
                    :days=Number(1095)
                    @dateSelected="dateSelected(endDevelopment, $event)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="properties-finishing">
            <div class="finishing-title">Отделка:</div>
            <div class="finishing-grid">
              <div>
                <input v-model="materials" class="toggle" type="checkbox" id="without_finishing" value="Стройвариант"/>
                <label for="without_finishing">Стройвариант</label>
              </div>
              <div>
                <input v-model="materials" class="toggle" type="checkbox" id="rough_finishing" value="Черновая"/>
                <label for="rough_finishing">Черновая</label>
              </div>
              <div>
                <input v-model="materials" class="toggle" type="checkbox" id="prefinishing_finishing" value="Предчистовая"/>
                <label for="prefinishing_finishing">Предчистовая</label>
              </div>
              <div>
                <input v-model="materials" class="toggle" type="checkbox" id="finishing_finishing" value="Чистовая"/>
                <label for="finishing_finishing">Чистовая</label>
              </div>
              <div>
                <input v-model="materials" class="toggle" type="checkbox" id="with_repair" value="С ремонтом"/>
                <label for="with_repair">С ремонтом</label>
              </div>
            </div>
          </div>
          <div class="properties-buttons">
            <ButtonDefault
              v-if="!editMode"
              name="Следующий шаг"
              color="green"
              :actionForClick="createHouseProperties"
            />
            <div v-else>
              <ButtonDefault
                name="Обновить"
                color="green"
                :actionForClick="updateHouseProperties"
              />
              <ButtonDefault
                name="Пропустить"
                color="green"
                :actionForClick = "skipStep"
              />
            </div>
          </div>
        </div>
      </div>
    </HouseContainer>
  </div>
</template>

<script>
import HouseContainer from './HouseContainer'
import ButtonDefault from './ButtonDefault'
import DraggableCal from 'vue-draggable-cal'
import AlertDefault from './AlertDefault'

export default {
  name: 'HouseProperties',
  components: {
    ButtonDefault,
    HouseContainer,
    DraggableCal,
    AlertDefault
  },
  data () {
    return {
      houseId: '',
      buildingId: '',
      pluginDate: '',
      materials: [],
      numberOfFloors: null,
      livingFloorsStart: '',
      livingFloorsEnd: '',
      numberOfEntrance: null,
      numberOfFlat: null,
      streetName: '',
      number: '',
      finishing: '',
      stageDevelopment: '',
      startDevelopment: {
        calendarIsActive: false,
        value: ''
      },
      endDevelopment: {
        calendarIsActive: false,
        value: ''
      },
      errorsStack: [],
      editMode: false
    }
  },
  created () {
    this.houseId = this.$store.state.currentHouseId
    if (this.houseId !== undefined) {
      this.getProperties()
        .then(houseProperties => {
          this.editMode = true
          this.fillHouseProperties(houseProperties.data)
        })
    }
    /** Временно, пока для записи нужен Building Id. Илья обещал убрать */
    let currentBuildingStoreIndex = this.$store.state.currentBuildingStoreIndex
    this.buildingId = JSON.parse(this.$store.state.buildings)[currentBuildingStoreIndex].building.hash_id
  },
  methods: {
    createStrDateFromObject (dateObject) {
      let dateArr = [dateObject.getDate(), dateObject.getMonth() + 1, dateObject.getFullYear()]
      for (let i in dateArr) {
        dateArr[i] = dateArr[i].toString().replace(/^([0-9])$/, '0$1')
      }
      let clientDate = dateArr[0] + '.' + dateArr[1] + '.' + dateArr[2]
      console.info(clientDate)
      return clientDate
    },
    dateSelected (dataObject, date) {
      dataObject.value = this.createStrDateFromObject(date)
      setTimeout(function () {
        dataObject.calendarIsActive = false
      }, 600)
    },
    reformatDate (dataString, forServer) {
      let symbolSeparate = '-'
      let symbolJoin = '.'
      if (forServer) {
        let tmp = symbolJoin
        symbolJoin = symbolSeparate
        symbolSeparate = tmp
      }
      let dateArr = dataString.split(symbolSeparate)
      let newDate = dateArr[2] + symbolJoin + dateArr[1] + symbolJoin + dateArr[0]
      console.info(newDate)
      return newDate
    },
    getProperties () {
      return this.$store.dispatch('retrieveItem', {
        url: '/houses/' + this.houseId,
        storageName: 'properties'
      })
    },
    fillHouseProperties (house) {
      let livingFloorsArr = house.living_floors.split(',')
      this.houseId = house.hash_id
      this.buildingId = house.building_hash_id
      this.materials = house.materials.split(',')
      this.numberOfFloors = house.number_of_floors
      this.livingFloorsStart = livingFloorsArr[0]
      this.livingFloorsEnd = livingFloorsArr[1]
      this.numberOfEntrance = house.number_of_entrance
      this.numberOfFlat = house.number_of_flat
      this.streetName = house.street_name
      this.number = house.number
      this.finishing = house.finishing
      this.stageDevelopment = house.stage_development
      this.startDevelopment.value = this.reformatDate(house.start_development)
      this.endDevelopment.value = this.reformatDate(house.end_development)
    },
    createHouseProperties () {
      this.storeHouseProperties()
        .then((response) => {
          this.$store.dispatch('setItemToStore', {
            storageName: 'properties',
            fields: JSON.stringify(response.data)
          })
          this.$store.dispatch('setItemToStore', {
            storageName: 'currentHouseId',
            fields: response.data.hash_id
          })
          this.$router.push({ name: 'HouseFlatsSchemas' })
        })
        .catch(error => {
          this.errorsStack = error.response.data
        })
    },
    updateHouseProperties () {
      this.storeHouseProperties('/' + this.houseId, 'updateItem')
        .then(() => { this.$router.push({ name: 'BuildingMain' }) })
        .catch(error => {
          this.errorsStack = error.response.data
        })
    },
    skipStep () {
      this.$router.push({ name: 'HouseFlatsSchemas' })
    },
    storeHouseProperties (houseIdPath = '', action = 'writeItem') {
      const houseProperties = {
        building_id: this.buildingId,
        materials: this.materials.join(',').trim(),
        number_of_floors: this.numberOfFloors,
        living_floors: this.livingFloors,
        number_of_entrance: this.numberOfEntrance,
        number_of_flat: this.numberOfFlat,
        street_name: this.streetName,
        number: this.number,
        finishing: this.finishing,
        stage_development: this.stageDevelopment,
        start_development: this.reformatDate(this.startDevelopment.value, true),
        end_development: this.reformatDate(this.endDevelopment.value, true)
      }
      return this.$store.dispatch(action, {
        fields: houseProperties,
        url: '/houses' + houseIdPath,
        storageName: 'properties'
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
    },
    livingFloors () {
      return this.livingFloorsStart + ',' + this.livingFloorsEnd
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/form.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";

  .house-properties {
    .properties {
      background-color: @color-white;
      .padding();
      @media @desktop {
        .padding(@v: 2rem);
      }
      &-characteristics {
        .characteristics {
          &-title {
            .font(@s: 1.75rem; @w: 100);
            margin-bottom: 2rem;
          }
          &-grid {
            .grid(@c: 2);
            @media @mobile {
              .grid(@c: 1);
            }
            .form {
              &-group {
                grid-template-columns: 120px 1fr;
                margin-bottom: 1rem;
                label {
                  color: @color-dark-grey ;
                  .font(@s: 0.875rem;);
                }
                @media @mobile {
                  margin-bottom: 0rem;
                }
              }
            }
          }
          &-cal {
            background-color: #fff;
            box-shadow: 0 28px 50px rgba(22, 0, 27, 0.14);
            position: absolute;
            top: 0;
            padding: 2rem;
            width: 100%;
            margin: 0;
            z-index: 1;
          }
        }
      }
      &-finishing {
        .finishing {
          &-title {
            color: @color-dark-grey;
            .font(@s: 1.25rem; @w: 100);
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
          &-grid {
            .grid(@c: 5);
            @media @desktop {
              .grid(@c: 3);
            }
            @media @tablet {
              .grid(@c: 2);
            }
            @media @mobile {
              .grid(@c: 1);
            }
          }
        }
      }
      &-buttons {
        margin-top: 2rem;
      }
    }
  }
</style>
