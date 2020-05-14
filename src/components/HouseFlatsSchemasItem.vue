<template>
  <div class="schemas-item"
     @mouseover="toggleEditButton"
     @mouseout="toggleEditButton"
  >
    <div class="item-buttons">
      <a href="#make-flats-schemas_container" uk-toggle>
        <ButtonDefault
          v-if="isVisibleButtons"
          name="Редактировать"
          color="green"
          class="button-small"
          :actionForClick="editFlatSchema"
        />
      </a>
      <ButtonDefault
        v-if="isVisibleButtons"
        name="Удалить"
        color="red"
        class="button-small"
        :actionForClick="removeFlatSchema"
      />
    </div>
    <div class="item-image">
      <img :src="image">
    </div>
    <div class="item-desc">
      <div class="item-desc__list">
        <div>Тип квартиры:</div>
        <div class="item-desc__list_right">{{ staticFlatsSchemasTypes[type].title }}</div>
      </div>
      <div class="item-desc__list">
        <div>Типовая площадь:</div>
        <div class="item-desc__list_right">{{ area }} м<sup>2</sup></div>
      </div>
      <div class="item-desc__list">
        <div>Комнат:</div>
        <div class="item-desc__list_right">{{ numberOfRooms }}</div>
      </div>
      <div class="item-desc__list">
        <div>Балконы:</div>
        <div class="item-desc__list_right">{{ numberOfBalcony }}</div>
      </div>
      <div class="item-desc__list">
        <div>Лоджии:</div>
        <div class="item-desc__list_right">{{ numberOfLoggia }}</div>
      </div>
      <div class="item-desc__list">
        <div>Цена:</div>
        <div class="item-desc__list_right">{{ price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import HouseFlatsSchemasAdd from './HouseFlatsSchemasAdd'

export default {
  name: 'HouseFlatsSchemasItem',
  data () {
    return {
      isVisibleButtons: false,
      sidebarShow: false,
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
      }
    }
  },
  props: {
    flatSchemaId: {
      type: String,
      require: true
    },
    image: {
      type: String,
      required: true
    },
    type: String,
    area: {
      type: String,
      required: true
    },
    numberOfBalcony: Number,
    numberOfLoggia: Number,
    numberOfRooms: Number,
    editFlatSchemaFunction: Function,
    storeIndex: Number,
    price: String
  },
  components: {
    ButtonDefault,
    HouseFlatsSchemasAdd
  },
  methods: {
    toggleEditButton () {
      this.isVisibleButtons = !this.isVisibleButtons
    },
    removeFlatSchema () {
      this.$emit('activateAlertConfirm', this.flatSchemaId)
    },
    editFlatSchema () {
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
  .schemas-item {
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
      }
    }
  }
</style>
