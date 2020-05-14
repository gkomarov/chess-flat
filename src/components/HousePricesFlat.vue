<template>
  <div class="table-item">
    <div class="table-item__title">Квартира <span>№{{ number }}</span></div>
    <span>{{ staticFlatsSchemasTypes[flatSchema].title }}</span>
    <input
      name="area"
      id="area"
      v-model="newArea"
      @blur="updateFlat"
    />
    <input
      name="price"
      id="price"
      v-model="newPrice"
      @blur="updateFlat"
    />
    <span>{{ entrance }}</span>
    <select
      @blur="updateFlat"
      v-model="newStatus"
    >
      <option
        v-for="(status, index) in statusList"
        :key="index"
        :value="index"
      >{{ status }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'HousePricesFlat',
  data () {
    return {
      statusList: {
        0: 'Забронирована',
        1: 'Свободна'
      },
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
      newArea: this.area,
      newPrice: this.price,
      newStatus: this.status,
      editableValue: null
    }
  },
  props: {
    number: {
      type: Number,
      required: true
    },
    flatId: {
      type: String,
      required: true
    },
    flatSchema: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    entrance: {
      type: Number,
      required: true
    },
    status: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateFlat () {
      if (this.oldValuesWasChanged) {
        let newData = {
          status: this.newStatus,
          price: this.newPrice,
          area: this.newArea
        }
        this.$store.dispatch('updateItem', {
          url: '/flats/' + this.flatId,
          fields: newData
        })
        newData['flatId'] = this.flatId
        this.$emit('updateFlatsList', newData)
      }
    }
  },
  computed: {
    oldValuesWasChanged () {
      if (this.area !== this.newArea || this.price !== this.newPrice || this.status !== this.newStatus) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/padding.less";
  @import (less) "../../static/less/color.less";
  .table-item {
    .padding-v(@v: 0.35rem;);
    &__title {
      font-size: 0.875rem;
      span {
        font-size: 1rem;
        color: @color-light-green;
        font-weight: 500;
      }
    }
    input {
      width: 100%;
      border: none;
      border-bottom: 2px solid darken(@color-light-grey, 10%);
      &:focus {
        border-bottom: 2px solid @color-light-green;
      }
    }
  }
</style>
