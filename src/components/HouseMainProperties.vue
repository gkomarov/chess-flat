<template>
  <HouseMain>
    <div class="house-mainproperties">
        <div class="properties-info">
          <AlertDefault
            v-if="singleErrorMessage"
            :message="singleErrorMessage"
            @alertDie="singleErrorMessage = ''"
          />
          <div class="info-header">
            <div class="header-title">Характеристики дома</div>
            <div class="header-edit"></div>
          </div>
          <div class="info-list">
            <div class="info-list__column">
              <div class="list-item">
                <span class="list-item__title">Всего<br>этажей:</span>
                <span class="list-item__value">{{ numberOfFloors }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Жилых<br>этажей:</span>
                <span class="list-item__value">{{ livingFloors }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Количество<br>подъездов:</span>
                <span class="list-item__value">{{ numberOfEntrance }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Количество<br>квартир:</span>
                <span class="list-item__value">{{ numberOfFlats }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Номер<br>дома:</span>
                <span class="list-item__value">{{ number }}</span>
              </div>
            </div>
            <div class="info-list__column">
              <div class="list-item">
                <span class="list-item__title">Стадия<br>строительства:</span>
                <span class="list-item__value">{{ stageDevelopment }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Начало<br>строительства:</span>
                <span class="list-item__value">{{ startDevelopment }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Окончание<br>строительства:</span>
                <span class="list-item__value">{{ endDevelopment }}</span>
              </div>
              <div class="list-item">
                <span class="list-item__title">Улица:</span>
                <span class="list-item__value">{{ streetName }}</span>
              </div>
            </div>
          </div>
          <div class="info-materials">
            <div>
              <div>Отделка квартир:
                <span
                  v-for="(item, index) in finishing"
                  :key="index"
                >
                  {{ item }}
                </span>
              </div>
            </div>
            <div>
              <div>Материалы:
                <span
                  v-for="(material, index) in materials"
                  :key="index"
                >
                  {{ material }}
                </span>
              </div>
            </div>
          </div>
        </div>
      <div class="properties-media">
        <div class="info-development">
          <div>
            <div>Отделка квартир: {{ finishing }}</div>
          </div>
          <div class="materials">
            <div>Материалы:</div>
            <div class="materials-list">
              <div
              class="materials-item"
              v-for="(material, index) in materials"
              :key="index">
                {{ material }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HouseMain>
</template>

<script>
import HouseMain from './HouseMain'
import AlertDefault from './AlertDefault'

export default {
  name: 'HouseMainProperties',
  data () {
    return {
      houseId: '',
      buildingId: '',
      materials: [],
      numberOfFloors: null,
      livingFloors: '',
      numberOfEntrance: null,
      numberOfFlats: null,
      streetName: '',
      number: '',
      finishing: '',
      stageDevelopment: '',
      startDevelopment: '',
      singleErrorMessage: '',
      endDevelopment: '',
      editMode: false
    }
  },
  components: {
    AlertDefault,
    HouseMain
  },
  created () {
    this.$store.dispatch('retrieveItem', {
      url: '/houses/' + this.$store.state.currentHouseId,
      storageName: 'properties'
    })
      .then(response => {
        this.fillHouseProperties(response.data)
        this.$store.dispatch('setItemToStore', {
          storageName: 'properties',
          fields: JSON.stringify(response.data)
        })
      })
      .catch(error => {
        this.singleErrorMessage = 'Не удалось получить характеристики дома.'
        console.info(error.response.data)
      })
  },
  methods: {
    fillHouseProperties (house) {
      this.houseId = house.hash_id
      this.buildingId = house.building_hash_id
      this.materials = house.materials.split(',')
      this.numberOfFloors = house.number_of_floors
      this.livingFloors = house.living_floors
      this.numberOfEntrance = house.number_of_entrance
      this.numberOfFlats = house.number_of_flat
      this.streetName = house.street_name
      this.number = house.number
      this.finishing = house.finishing.split(',')
      this.stageDevelopment = house.stage_development
      this.startDevelopment = house.start_development
      this.endDevelopment = house.end_development
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";
  .house-mainproperties {
    display: grid;
    grid-template-columns: 3fr 480px;
    grid-column-gap: 2rem;
    .properties {
      &-info {
        background-color: @color-white;
        .padding-c(@t: 1.5rem; @b: 3rem; @l: 3rem; @r: 3rem;);
        .info {
          &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 1rem;
            margin-bottom: 0rem;
            border-bottom: 1px solid #f2f4f6;
            .header {
              &-title {
                .font(@s: 2rem; @w: 100);
              }
            }
          }
          &-list {
            .grid(@c: 2);
            .padding-v(@v: 2rem;);
            margin-bottom: 2rem;
            border-bottom: 1px solid #f2f4f6;
            &__column {
              .grid(@c: 1; @cg: 0; @rg: 2rem);
              align-items: flex-start;
              .list {
                &-item {
                  display: grid;
                  grid-template-columns: 120px 1fr;
                  grid-column-gap: 1rem;
                  align-items: center;
                  &__title {
                    font-size: 0.875rem;
                    color: @color-dark-grey;
                  }
                }
              }
            }
          }
          &-development {
            .grid(@c: 2);
            .materials {
              display: flex;
              &-list {
                margin-left: 0.5rem;
                margin-top: -3px;
              }
              &-item {
                border-radius: 2px;
                color: @color-white;
                background-color: @color-dark-grey;
                .padding(@v: 0.25rem);
                margin-bottom: 3px;
                margin-right: 3px;
                display: inline-block;
                font-size: 0.875rem;
              }
            }
          }
        }
      }
      &-media {
        background-color: @color-white;
        .padding(@v: 3rem;);
      }
    }
  }
</style>
