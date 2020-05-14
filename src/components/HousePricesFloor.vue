<template>
  <div
    class="house-pricesfloor"
    :class="floorIndex"
    @click="editFloor"
  >
    <div class="pricesfloor-info">
      <div class="info-title">Этаж {{ floorNumber }}</div>
      <div class="info-num" v-if="editMode || expandFloors">{{ floorNumber }}</div>
    </div>
    <transition>
      <div class="pricesfloor-table" v-if="editMode || expandFloors">
        <div class="table-header">
          <div>Номер квартиры</div>
          <div>Планировка</div>
          <div>Площадь</div>
          <div>Цена</div>
          <div>Подъезд</div>
          <div>Статус</div>
        </div>
        <template
          v-for="(flat, index) in floor"
        >
          <HousePricesFlat
            :number="flat.number"
            :flatId="flat.hash_id"
            :flatSchema="flat.flat_schema"
            :area="flat.area"
            :key="index"
            :price="Number(flat.price)"
            :entrance="flat.entrance"
            :status="flat.status"
            @updateFlatsList="updateFlatsList"
          />
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import HousePricesFlat from './HousePricesFlat'
import ButtonDefault from './ButtonDefault'
import AlertConfirm from './AlertConfirm'

export default {
  name: 'HousePricesFloor',
  data () {
    return {
      alertShow: false,
      selectedFloor: [],
      floorNumber: ''
    }
  },
  props: {
    floor: {
      type: Array,
      required: true
    },
    expandFloors: Boolean,
    floorIndex: Number,
    editableFloorIndex: Number
  },
  components: {
    AlertConfirm,
    ButtonDefault,
    HousePricesFlat
  },
  created () {
    this.floorNumber = this.floor[0].floor
  },
  methods: {
    alertConfirm () {
      this.alertShow = true
    },
    editFloor () {
      if (!this.editMode) {
        this.$emit('editFloor', this.floorIndex)
      } else {
        this.$emit('editFloor', '')
      }
    },
    updateFlatsList (editableFlatData) {
      this.$emit('updateFlatsList', editableFlatData)
    }
  },
  computed: {
    editMode () {
      return this.editableFloorIndex === this.floorIndex
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
  .house-pricesfloor {
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-column-gap: 1rem;
    .padding-v(@v: 1rem);
    border-bottom: 1px solid @color-light-grey;
    &:last-child {
      border-bottom: 1px solid transparent;
    }
    .pricesfloor {
      &-info {
        position: relative;
        .info {
          &-num {
            color: @color-light-grey;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            font-size: 10rem;
          }
        }
      }
      &-table {
        .table {
          &-header {
            color: @color-dark-grey;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-column-gap: 1rem;
            margin-bottom: 0.875rem;
            font-size: 0.875rem;
          }
          &-item {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-column-gap: 1rem;
          }
        }
      }
    }
  }
</style>
