<template>
  <div>
    <HouseContainer>
      <AlertDefault
        v-if="singleErrorMessage"
        :message="singleErrorMessage"
        @alertDie="singleErrorMessage = ''"
      />
      <div class="house-prices">
        <div class="prices-header">
          <div class="header-title">Введите цену и площадь квартир</div>
          <div class="header-filter">
            <input
              v-model="expandFloors"
              type="checkbox"
              class="toggle"
              id="expandFloorToggle"
            />
            <label for="expandFloorToggle">Развернуть все этажи</label>
          </div>
          <input @change="processFile" name="price" type="file"/>
          <ButtonDefault
            name="Импорт данных"
            color="green"
            :actionForClick="dataImport"
          />
        </div>
        <div class="flats_list">
          <template
            v-for="(floor, index) in fullHouse"
          >
            <HousePricesFloor
              :floor="floor"
              :floorIndex="index"
              :key="index"
              :expandFloors="expandFloors"
              :editableFloorIndex="editableFloorIndex"
              @editFloor="editFloor"
              @updateFlatsList="getFullHouse"
            />
          </template>
        </div>
      </div>
    </HouseContainer>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import AlertDefault from './AlertDefault'
import HouseContainer from './HouseContainer'
import HousePricesFloor from './HousePricesFloor'

export default {
  name: 'HousePrices',
  data () {
    return {
      fullHouse: [],
      editableFloorIndex: null,
      singleErrorMessage: '',
      pricesFile: '',
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
      expandFloors: false
    }
  },
  components: {
    ButtonDefault,
    AlertDefault,
    HouseContainer,
    HousePricesFloor
  },
  created () {
    let fullHouse = this.$store.state.fullHouse
    if (fullHouse === null) {
      this.getFullHouse()
    } else {
      this.fullHouse = JSON.parse(fullHouse)
    }
  },
  methods: {
    getFullHouse () {
      let houseId = this.$store.state.currentHouseId
      this.$store.dispatch('retrieveItem', {
        url: '/houses/' + houseId + '/flats',
        storageName: 'fullHouse'
      })
        .then(response => {
          this.fullHouse = response.data.flats
        })
        .catch(error => {
          this.singleErrorMessage = 'Не могу получить информацию о доме.'
          console.info(this.singleErrorMessage + 'Вот почему: ', error.response.data)
        })
    },
    dataImport () {
      let prices = new FormData()
      prices.append('prices', this.pricesFile)
      return this.$store.dispatch('writeItem', {
        fields: prices,
        url: '/prices/upload',
        storageName: 'prices'
      })
        .then(response => {
          console.info('Response', response)
        })
        .catch(error => {
          console.info('Error: ', error.response.data)
        })
    },
    editFloor (floorIndex) {
      this.editableFloorIndex = floorIndex
    },
    processFile (event) {
      this.pricesFile = event.target.files[0]
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
  .house-prices {
    background-color: @color-white;
    .padding-c(@t: 2rem; @b: 3rem; @l: 3rem; @r: 3rem;);
    .prices {
      &-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 2rem;
        border-bottom: 1px solid @color-light-grey;
        .header {
          &-title {
            .font(@s: 2rem; @w: 100);
          }
        }
      }
    }
  }

</style>
