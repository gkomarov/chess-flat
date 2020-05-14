<template>
  <div class="floors-item"
       @mouseover="toggleEditButton"
       @mouseout="toggleEditButton"
  >
    <div class="item-buttons">
      <ButtonDefault
        v-if="isVisibleButtons"
        name="Редактировать"
        color="green"
        class="button-small"
        :actionForClick="editFloor"
      />
      <ButtonDefault
        v-if="isVisibleButtons"
        name="Удалить"
        color="red"
        class="button-small"
        :actionForClick="removeFloor"
      />
    </div>
    <div class="item-image">
      <img :src="image">
    </div>
    <div class="item-desc">
      <div
        v-if="markingEnable">
        Этаж доступен для разметки
      </div>
      <div>
        № этажа: {{ floorNumber }}
      </div>
      <div class="item-desc__clone">
        <div class="clone-title">Клонировать для этажей:</div>
        <div class="clone-items" v-if="cloneFloors != ''">
          <span class="clone-item" v-for="(cloneFloor, i) in cloneFloors" :key="i">{{ cloneFloor }}</span>
        </div>
      </div>
      <ButtonDefault
        name="Разметить этаж"
        color="yellow"
        class="button-expand"
        :actionForClick="emitMarkingFloor"
      />
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import HouseFloorsAdd from './HouseFloorsAdd'

export default {
  name: 'HouseFloorsItem',
  data () {
    return {
      isVisibleButtons: false,
      sidebarShow: false
    }
  },
  components: {
    ButtonDefault,
    HouseFloorsAdd
  },
  props: {
    houseId: {
      type: String,
      require: true
    },
    floorId: {
      type: String,
      require: true
    },
    image: {
      type: String,
      require: true
    },
    floorNumber: {
      type: Number,
      require: true
    },
    markingEnable: {
      type: Boolean,
      require: true
    },
    cloneFloors: {
      type: Array,
      require: true
    },
    numberOfFlats: {
      type: Number,
      require: true
    },
    storeIndex: {
      type: Number,
      require: true
    }
  },
  methods: {
    toggleEditButton () {
      this.isVisibleButtons = !this.isVisibleButtons
    },
    emitMarkingFloor () {
      this.$emit('emitMarkingFloor', {
        id: this.floorId,
        storeIndex: this.storeIndex,
        numberOfFlats: this.numberOfFlats,
        markingEnable: this.markingEnable
      })
    },
    removeFloor () {
      this.$emit('activateAlertConfirm', this.floorId)
    },
    editFloor () {
      this.$emit('activateSidebar', this.storeIndex)
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";
  .floors-item {
    position: relative;
    background-color: @color-white;
    &:hover {
      box-shadow: 0 28px 50px rgba(22, 0, 27, 0.14);
    }
    .item {
      &-buttons {
        position: absolute;
        top: 0;
        right: 0;
      }
      &-image {
        .padding-v(@v: 2rem);
        .padding-h(@v: 4rem);
        img {
          object-fit: contain;
          width: 100%;
        }
      }
      &-desc {
        .grid(@c: 1;@rg: 1rem);
        border-top: 1px solid @color-light-grey;
        .padding(@v: 2rem);
        &__list {
          .grid(@c: 2;@cg: 1rem);
          &_right {
            text-align: right;
          }
        }
        &__clone {
          margin-top: 1rem;
          .clone {
            &-items {
              display: grid;
              grid-template-columns: repeat(auto-fill, 34px);
              grid-column-gap: 0.25rem;
              grid-row-gap: 0.25rem;
              margin-top: 1rem;
            }
            &-title {
              font-size: 0.875rem;
              color: @color-dark-grey;
            }
            &-item {
              color: @color-white;
              background-color: @color-dark-grey;
              padding: 0.5rem;
              display: block;
              text-align: center;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
</style>
