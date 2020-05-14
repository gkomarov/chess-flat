<template>
  <div
    class="flat-marked"
    :class="flatTypeId"
    @click="editBlock"
  >
    <div class="marked-item">
      <div>Квартира № {{ flatTypeNumber }}</div>
      <div>
        <ButtonDefault
          class="button-icon"
          :actionForClick="alertConfirm"
        />
      </div>
    </div>
    <transition name="slide-fade">
      <div class="marked-form" v-if="editMode">
        <AlertDefault
          v-if="singleErrorMessage"
          :message="singleErrorMessage"
          @alertDie="clearSingleError"
        />
        <div class="form-group">
          <label class="form-group__label" for="number">Квартира №</label>
          <div class="form-group__input">
            <input
              v-model="number"
              type="number"
              name="number"
              id="number"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-group__label" for="flatSchema">Планировка</label>
          <div class="form-group__input">
            <select
              v-model="flatSchema"
              type="flatSchema"
              name="flatSchema"
              id="flatSchema"
            >
              <option
                v-for="flatSchema in flatSchemas"
                :key="flatSchema.fields.hash_id"
                :value="flatSchema.fields.hash_id"
                :selected="selectedFlatSchema"
              >
                {{ staticFlatsSchemas[flatSchema.fields.type].title }}
              </option>
          </select>
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-group__label" for="entrance">Подъезд №</label>
          <div class="form-group__input">
            <input
              v-model="entrance"
              type="number"
              name="entrance"
              id="entrance"
            />
            <span class="form-group__input_bar"></span>
          </div>
        </div>
        <div class="marked-window">
          <div class="window-title">Окна выходят на:</div>
          <div class="window-list">
            <div>
              <input v-model="windows"
                     type="checkbox"
                     class="toggle"
                     id="street"
                     value="Улица"
                     name="street" />
              <label for="street">Улица</label>
            </div>
            <div>
              <input v-model="windows"
                     type="checkbox"
                     class="toggle"
                     id="north"
                     value="Север"
                     name="north" />
              <label for="north">Север</label>
            </div>
            <div>
              <input v-model="windows" class="toggle" type="checkbox" id="south" value="Юг"/>
              <label for="south">Юг</label>
            </div>
            <div>
              <input v-model="windows" class="toggle" type="checkbox" id="outdoors" value="Двор"/>
              <label for="outdoors">Двор</label>
            </div>
            <div>
              <input v-model="windows" class="toggle" type="checkbox" id="east" value="Восток"/>
              <label for="east">Восток</label>
            </div>
            <div>
              <input v-model="windows" class="toggle" type="checkbox" id="west" value="Запад"/>
              <label for="west">Запад</label>
            </div>
          </div>
        </div>
        <ButtonDefault
          name="Сохранить квартиру"
          class="button-expand"
          color="green"
          :actionForClick="updateFlat"
        />
      </div>
    </transition>
    <AlertConfirm
      v-if="alertShow"
      @isAgree="removeFlat"
      @isDisagree="closeAlertConfirm"
    />
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import AlertConfirm from './AlertConfirm'
import AlertDefault from './AlertDefault'

export default {
  name: 'FlatMarked',
  data () {
    return {
      alertShow: false,
      singleErrorMessage: '',
      number: this.flatType.number,
      flatSchema: this.flatType.flat_schema_hash_id,
      entrance: this.flatType.entrance,
      windows: this.flatTypeWindows,
      selectedFlatType: [],
      staticFlatsSchemas: {
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
      }
    }
  },
  props: {
    flatType: {
      type: Object,
      required: true
    },
    flatTypeId: {
      type: String,
      required: true
    },
    flatIndex: {
      type: Number,
      required: true
    },
    editableFlatIndex: Number,
    flatTypeNumber: {
      type: Number,
      required: true
    },
    flatSchemas: {
      type: Array,
      required: true
    },
    flatTypeWindows: {
      type: Array,
      required: true
    },
    errorsStack: Array
  },
  components: {
    AlertConfirm,
    ButtonDefault,
    AlertDefault
  },
  methods: {
    alertConfirm () {
      this.alertShow = true
    },
    updateFlat () {
      this.$emit('updateFlat', {
        id: this.flatTypeId,
        number: this.number,
        flatSchema: this.flatSchema,
        entrance: this.entrance,
        windows: this.windows
      })
    },
    removeFlat () {
      this.$store.dispatch('removeItem', {
        url: '/flat-types/' + this.flatTypeId
      })
        .then(() => {
          this.$emit('flatTypeRemovedSuccessful')
        })
        .catch(() => {
          this.singleErrorMessage = 'Не удалось удалить квартиру.'
          console.info('Не удалось удалить квартиру.')
          this.closeAlertConfirm()
        })
    },
    /* clearSingleError () {
      this.singleErrorMessage = ''
    }, */
    closeAlertConfirm () {
      this.alertShow = false
    },
    editBlock () {
      if (!this.editMode) {
        this.$emit('setCurrentCoordinates', {
          flatTypeId: this.flatTypeId,
          flatIndex: this.flatIndex,
          coords: this.flatType.coordinates
        })
      }
    },
    clearSingleError () {
      // Общее напоминание чистится методом удаления свойства single_error
      this.singleErrorMessage = ''
    },
    clearError (event) {
      // Получаем id элемента и удаляем его из стека ошибок
      // Vue автоматически отреагирует на это, скрыв отображение
      let item = event.target.id
      this.$delete(this.errorsStack, item)
      this.clearSingleError()
    }
  },
  watch: {
    errorsStack (errors) {
      console.info(errors)
      this.singleErrorMessage = errors.message
    }
  },
  computed: {
    editMode () {
      return this.editableFlatIndex === this.flatIndex
    },
    selectedFlatSchema () {
      let isExist = false
      this.flatSchemas.map(flatSchema => {
        return this.flatSchema === flatSchema.fields.type
      })
      return isExist
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

  .flat-marked {
    margin-bottom: 0.5rem;
    .marked {
      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background-color: lighten(@color-light-green, 50%);
        border: 1px solid lighten(@color-light-green, 40%);
        border-radius: 3px;
        .padding-h(@v: 1.5rem);
        .padding-v(@v: 1rem);
        margin-bottom: 0.5rem;
        &:hover {
          background-color: lighten(@color-light-green, 40%);
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

</style>
