<template>
  <div class="floors-marking">
    <div class="floors-nav">
      <ButtonDefault
        class="button-close"
        :actionForClick="closeMarking"
      />
    </div>
    <div class="floors-grid">
      <div class="floors-image">
        <img src="/static/img/plan.svg">
        <svg class="floors-schema" @click="updatePoints">
          <template v-for="(coordinates, id, index) in readyFlatsCoordinates">
            <polygon
              :style="{ fill: flatColors[index] }"
              :points="coordinates"
              :key="id"
              :class="id"
            ></polygon>
          </template>
          <polygon :points="totalPoints" @contextmenu="removeMarking"></polygon>
          <template v-for="(circle, i) in newFlat.points">
            <circle
              :cx="circle.x"
              :cy="circle.y"
              r="6"
              :key="circle.x + '' + i"
              @contextmenu="rightClick"
              @mouseup="handleMouseUp"
              @mousedown="handleMouseDown"
            ></circle>
          </template>
        </svg>
      </div>
    </div>
    <div class="floors-flats">
      <div>
        <div>
          <FlatMarked
            v-for="(flatType, index) in computedFlatTypes"
            :key="flatType.fields.hash_id"
            :flatType="flatType.fields"
            :flatTypeWindows="flatType.fields.windows.split(',')"
            :flatTypeId="flatType.fields.hash_id"
            :flatTypeNumber="flatType.fields.number"
            :flatIndex="index"
            :flatSchemas="flatsSchemasOfCurrentHouse"
            :editableFlatIndex="editableFlatIndex"
            :errorsStack="errorsStack"
            @flatTypeRemovedSuccessful="getFlatTypes"
            @setCurrentCoordinates="editBlock"
            @updateFlat="updateMarkedFlat"
          />
        </div>
        <div class="marked-create" @click="createNewObject">Новый объект</div>
        <div class="marked-form" v-if="!editMode">
          <AlertDefault
            v-if="alertMessage"
            :message="alertMessage"
            @alertDie="alertMessage = ''"
          />
          <h2
            v-if="markingIsNotCompleted"
          >Этаж не размечен до конца</h2>
          <div class="form-group">
            <label class="form-group__label" for="number">Квартира №</label>
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
                v-model.number="newFlat.number"
                type="number"
                name="number"
                id="number"
                :class="validationClass.number"
                @click="clearError"
              />
              <span class="form-group__input_bar"></span>
            </div>
          </div>
          <div>
            <transition name="slide-fade">
                <span
                  v-if="errorsStack.flat_schema_hash_id"
                  class="form-group__alert"
                >
                  {{ errorsStack.flat_schema_hash_id }}
                </span>
            </transition>
            Планировка
            <select
              v-model="newFlat.flatSchemaId"
              type="flatSchema"
              name="flat_schema_hash_id"
              id="flat_schema_hash_id"
              :class="validationClass.flat_schema_hash_id"
              @click="clearError"
            >
              <option
                v-for="flatSchema in flatsSchemasOfCurrentHouse"
                :key="flatSchema.fields.hash_id"
                :value="flatSchema.fields.hash_id"
              >
                {{ staticFlatsSchemasTypes[flatSchema.fields.type].title }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-group__label" for="entrance">Подъезд №</label>
            <div class="form-group__input">
              <transition name="slide-fade">
                <span
                  v-if="errorsStack.entrance"
                  class="form-group__alert"
                >
                  {{ errorsStack.entrance }}
                </span>
              </transition>
              <input
                v-model.number="newFlat.entrance"
                type="number"
                name="entrance"
                id="entrance"
                :class="validationClass.entrance"
                @click="clearError"
              />
              <span class="form-group__input_bar"></span>
            </div>
          </div>
          <div class="marked-window">
            <div class="window-title">Окна выходят на:</div>
            <div class="window-list">
              <div>
                <input v-model="newFlat.windows" class="toggle" type="checkbox" id="street" value="Улица"/>
                <label for="street">Улица</label>
              </div>
              <div>
                <input v-model="newFlat.windows" class="toggle" type="checkbox" id="north" value="Север"/>
                <label for="north">Север</label>
              </div>
              <div>
                <input v-model="newFlat.windows" class="toggle" type="checkbox" id="south" value="Юг"/>
                <label for="south">Юг</label>
              </div>
              <div>
                <input v-model="newFlat.windows" class="toggle" type="checkbox" id="outdoors" value="Двор"/>
                <label for="outdoors">Двор</label>
              </div>
              <div>
                <input v-model="newFlat.windows" class="toggle" type="checkbox" id="east" value="Восток"/>
                <label for="east">Восток</label>
              </div>
              <div>
                <input v-model="newFlat.windows" class="toggle" type="checkbox" id="west" value="Запад"/>
                <label for="west">Запад</label>
              </div>
            </div>
          </div>
          <ButtonDefault
            name="Сохранить квартиру"
            class="button-expand"
            color="green"
            :actionForClick="writeMarkedFlat"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import CommonMethods from './CommonMethods'
import FlatMarked from './FlatMarked'
import AlertDefault from './AlertDefault'

export default {
  name: 'HouseFloorsMarking',
  data () {
    return {
      houseId: this.$store.state.currentHouseId,
      flatsSchemasOfCurrentHouse: [],
      staticFlatsSchemasTypes: {
        'studio_flat': {
          title: 'Студия',
          alias: 'S'
        },
        'one_room_flat': {
          title: 'Однокомнатная',
          alias: '1к'
        },
        'two_room_flat': {
          title: '2х-комнатная',
          alias: '2х'
        },
        'three_room_flat': {
          title: '3х-комнатная',
          alias: '3х'
        },
        'four_room_flat': {
          title: '4х-комнатная',
          alias: '4х'
        },
        'five_room_flat': {
          title: '5и-комнатная',
          alias: '5к'
        },
        'euro_two_room_flat': {
          title: 'Евро 2х-комнатная',
          alias: 'Е2'
        },
        'euro_three_room_flat': {
          title: 'Евро 3х-комнатная',
          alias: 'Е3'
        }
      },
      newFlat: {
        number: '',
        flatSchemaId: [],
        entrance: '',
        windows: [],
        selectedPointIndex: '',
        points: []
      },
      flatColors: [],
      flatTypes: [],
      originalFlatTypes: [],
      editMode: false,
      errorsStack: [],
      editableFlatIndex: null,
      alertMessage: ''
    }
  },
  props: {
    currentFloorId: String,
    numberOfFlats: {
      type: Number,
      required: true
    }
  },
  components: {
    FlatMarked,
    ButtonDefault,
    AlertDefault
  },
  mixins: [CommonMethods],
  created () {
    this.getFlatTypes()
    this.getFlatsSchemas()
  },
  methods: {
    getFlatsSchemas () {
      if (this.$store.state.flatsSchemas === null) {
        return this.$store.dispatch('retrieveItem', {
          url: '/houses/' + this.houseId + '/flats-schemas',
          storageName: 'flatsSchemas'
        })
          .then(flatsSchemas => {
            this.$store.dispatch('setItemToStore', {
              storageName: 'flatsSchemas',
              fields: flatsSchemas.data
            })
              .then(() => {
                this.flatsSchemasOfCurrentHouse = JSON.parse(flatsSchemas.data)
              })
              .catch(error => {
                console.info('Не удалось получить планировки. Вот почему: ', error.response.data)
              })
          })
      } else {
        this.flatsSchemasOfCurrentHouse = JSON.parse(this.$store.state.flatsSchemas)
      }
    },
    getFlatTypes () {
      return this.$store.dispatch('retrieveItem', {
        url: '/floor-type/' + this.currentFloorId + '/flat-types',
        storageName: 'flatTypes'
      })
        .then(flatTypes => {
          this.$store.dispatch('setItemToStore', {
            storageName: 'flatTypes',
            fields: flatTypes.data
          })
            .then(() => {
              this.originalFlats = flatTypes.data
              this.flatTypes = JSON.parse(flatTypes.data)
              this.flatTypes.map(item => {
              })
            })
            .catch(error => {
              if (error.response.status === 500) {
                this.alertMessage = 'Что-то пошло не так.'
              } else {
                this.errorsStack = error.response.data
                this.alertMessage = error.response.message
              }
            })
        })
    },
    resetEdit () {
      this.flatTypes = JSON.parse(this.originalFlats)
      this.newFlat.points = []
    },
    editBlock (params) {
      this.resetEdit()
      this.editMode = true
      this.editableFlatIndex = params.flatIndex
      this.flatTypes.map(flatType => {
        if (flatType.fields.hash_id === params.flatTypeId) {
          flatType.fields.coordinates = ''
        }
      })

      let editableCoordinates = params.coords.split(' ')
      editableCoordinates.map(coordsPair => {
        let coordsPairArr = coordsPair.split(',')
        this.updatePoints({
          layerX: coordsPairArr[0],
          layerY: coordsPairArr[1]
        })
      })
    },
    storeMarkedFlat (markedFlatsSchemaIdPath = '', action = 'writeItem') {
      let markedFlatData = {
        house_id: this.houseId,
        floor_type_id: this.currentFloorId,
        flat_schema_id: this.newFlat.flatSchemaId,
        entrance: this.newFlat.entrance,
        number: this.newFlat.number,
        windows: this.newFlat.windows.join(','),
        coordinates: this.totalPoints
      }
      return this.$store.dispatch(action, {
        fields: markedFlatData,
        url: '/flat-types',
        storageName: 'flatMarking'
      })
    },
    writeMarkedFlat () {
      let lastFlatIndex = this.flatTypes.length - 1
      if (lastFlatIndex >= 0) {
        let lastFlatNumber = Number(this.flatTypes[lastFlatIndex].fields.number)
        let lastFlatEntrance = Number(this.flatTypes[lastFlatIndex].fields.entrance)
        if ((this.newFlat.number - lastFlatNumber) !== 1 && this.newFlat.entrance === lastFlatEntrance) {
          this.alertMessage = 'Вы должны создавать квартиры последовательно!'
          return
        }
      }
      this.storeMarkedFlat()
        .then(() => {
          this.newFlat.points = []
          this.getFlatTypes()
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.alertMessage = 'Что-то пошло не так.'
          } else {
            console.info(error.response)
            this.errorsStack = error.response.data
            this.alertMessage = error.response.data.message
          }
        })
    },
    closeMarking () {
      this.$emit('closeMarking')
    },
    updateMarkedFlat (flatType) {
      let markedFlatData = {
        house_id: this.houseId,
        floor_type_id: this.currentFloorId,
        flat_schema_id: flatType.flatSchema,
        entrance: flatType.entrance,
        number: flatType.number,
        windows: flatType.windows.join(','),
        coordinates: this.totalPoints
      }
      return this.$store.dispatch('updateItem', {
        fields: markedFlatData,
        url: '/flat-types/' + flatType.id,
        storageName: 'flatMarking'
      })
        .then(() => {
          this.newFlat.points = []
          this.getFlatTypes()
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.alertMessage = 'Что-то пошло не так.'
          } else {
            console.info(error.response)
            this.errorsStack = error.response.data
            this.alertMessage = error.response.data.message
          }
        })
      // this.storeMarkedFlat('/' + this.selectedFlatSchema.hash_id, 'updateItem')
      // console.info(flatType)
    },
    processFile (event) {
      this.newFlat.flatSchema = event.target.files[0]
    },
    updatePoints (event) {
      this.setPoint(event.layerX, event.layerY)
    },
    checkSamePosition (nativeX, nativeY, layerX, layerY) {
      const differentStartLayerX = Math.abs(nativeX - layerX)
      const differentStartLayerY = Math.abs(nativeY - layerY)
      return (differentStartLayerX <= 10 && differentStartLayerY <= 10)
    },
    setPoint (x, y) {
      this.newFlat.points.push({ x: x, y: y })
    },
    rightClick (event) {
      event.preventDefault()
      let layerX = event.layerX
      let layerY = event.layerY
      for (let i in this.newFlat.points) {
        let item = this.newFlat.points[i]
        let isSamePosition = this.checkSamePosition(item.x, item.y, layerX, layerY)
        if (isSamePosition) {
          this.newFlat.points.splice(i, 1)
        }
      }
    },
    removeMarking (event) {
      event.preventDefault()
      this.newFlat.points = []
    },
    handleMouseDown (event) {
      if (event.button === 0) {
        this.newFlat.selectedPointIndex = this.newFlat.points.findIndex((item) => {
          let isSamePosition = this.checkSamePosition(item.x, item.y, event.layerX, event.layerY)
          return isSamePosition
        })
        document.addEventListener('mousemove', this.handleMouseMove)
      }
    },
    handleMouseUp (event) {
      if (event.button === 0) {
        document.removeEventListener('mousemove', this.handleMouseMove)
        this.newFlat.selectedPointIndex = ''
      }
    },
    handleMouseMove (event) {
      let i = this.newFlat.selectedPointIndex
      this.newFlat.points[i].x = event.layerX
      this.newFlat.points[i].y = event.layerY
    },
    addNewFlatColor () {
      this.flatColors.push('#' + Math.floor(Math.random() * 999999))
    },
    createNewObject () {
      this.resetEdit()
      this.editMode = false
      this.editableFlatIndex = null
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
    totalPoints () {
      let total = ''
      this.newFlat.points.map(function (item) {
        total += ' ' + item.x + ',' + item.y
      })
      return total.trim()
    },
    readyFlatsCoordinates () {
      let coordinates = {}
      this.flatTypes.map(flatType => {
        coordinates[flatType.fields.hash_id] = flatType.fields.coordinates
        this.addNewFlatColor()
      })
      return coordinates
    },
    computedFlatTypes () {
      return this.flatTypes
    },
    markingIsNotCompleted () {
      return this.computedFlatTypes.length - this.numberOfFlats !== 0
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
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/form.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";

  .floors-marking {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: "header header" "main sidebar";
    background-color: @color-white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    .floors {
      &-nav {
        display: flex;
        align-items: center;
        grid-area: header;
        border-bottom: 1px solid @color-light-grey;
        .padding-h(@v: 4rem);
        height: 4rem;
      }
      &-grid {
        grid-area: main;
        .padding(@v: 4rem);
      }
      &-flats {
        width: 460px;
        grid-area: sidebar;
        border-left: 1px solid @color-light-grey;
        .padding(@v: 4rem);
      }
      &-image {
        position: relative;
      }
    }
    .marked {
      &-create {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background-color: lighten(@color-light-red, 40%);
        border: 1px solid lighten(@color-light-red, 35%);
        border-radius: 3px;
        .padding-h(@v: 1.5rem);
        .padding-v(@v: 1rem);
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        &:hover {
          background-color: lighten(@color-light-red, 35%);
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      &-form {
        border-radius: 3px;
        border: 1px solid lighten(@color-light-grey, 0%);
        .padding(@v: 1.5rem);
      }
      &-window {
        margin-bottom: 2rem;
        .window {
          &-list {
            .grid(@c: 2; @cg: 1rem; @rg: 1rem);
          }
        }
      }
    }
  }

  circle {
    fill: #36a295;
    stroke: #3fbdb0;
    stroke-width: 2px;
  }

  polygon {
    fill: #42b983;
    opacity: .5;
    stroke: #545a6f;
  }

  .floors-schema {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
