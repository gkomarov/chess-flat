<template>
  <div class="house-chessbase">
    <AlertDefault
      v-if="singleErrorMessage"
      :message="singleErrorMessage"
      @alertDie="singleErrorMessage = ''"
    />
    <div class="chessbase-info">
      <div class="info-title">Проверьте правильность нумерации квартир и приступите к последнему шагу</div>
      <div class="info-desc">При необходимости вернитесь на предыдущий шаг для внесения правок</div>
      <div class="info-list">
        <div class="list-flat" v-for="(flatType, index) in flatTypes"
        :key="index">
          <div class="list-flat__type">{{ staticFlatsSchemasTypes[flatType.type].alias }}</div>
          <div class="list-flat__desc">{{ staticFlatsSchemasTypes[flatType.type].title }}</div>
          <div class="list-flat__amount">{{ flatType.number_of }}</div>
        </div>
      </div>
    </div>
    <div class="chessbase-masonry">
      <div class="masonry-header">
        <div class="header-title">Шахматка</div>
        <div class="header-filter">
          <input
            v-model="roomsView"
            type="checkbox"
            class="toggle"
            id="rooms"
            value="rooms"
          />
          <label for="rooms">Номера квартир</label>
        </div>
      </div>
      <div class="masonry-chess">
        <div class="chess-header">
          <div>Этажи</div>
          <div>Подъезды </div>
          <div>Этажи</div>
        </div>
        <div
          class="chess-floor"
          v-for="(flat, index) in flats.slice().reverse()"
          :key=index
          :floor="flat[0].floor"
        >
          <div class="floor-num">
            {{ flat[0].floor }}
          </div>
          <div class="floor-flats">
            <div
              v-for="(properties, index) in flat"
              class="floor-flat"
              :key="index"
            >
              <div class="floor-flat__numb" v-if="roomsView">{{ properties.number }}</div>
              <div class="floor-flat__numb" v-else>{{ properties.number_of_rooms }}</div>
            </div>
          </div>
          <div class="floor-num">
            {{ flat[0].floor }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlertDefault from './AlertDefault'

export default {
  name: 'HouseChessBase',
  data () {
    return {
      roomsView: true,
      singleErrorMessage: '',
      flats: {},
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
      flatTypes: {}
    }
  },
  components: {
    AlertDefault
  },
  created () {
    this.houseId = this.$store.state.currentHouseId
    this.$store.dispatch('retrieveItem', {
      url: '/houses/' + this.houseId + '/flats'
    })
      .then(response => {
        this.flats = response.data.flats
        this.flatTypes = response.data.number_of_flats_by_type
      })
      .catch(error => {
        this.singleErrorMessage = 'Не могу получить список квартир. Обратитесь к администратору.'
        console.info('Не получил список квартир. Вот почему: ', error.response.data)
      })
  },
  methods: {
    getFlatsSchemas () {
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
              this.flatsSchemas = JSON.parse(flatsSchemas.data)
            })
            .catch(error => {
              console.info('Не удалось получить планировки. Вот почему: ', error.response.data)
            })
        })
    }
  },
  computed: {
    numberOfFloors () {
      let floors = 0
      Array.from(this.flats).map(() => {
        floors++
      })
      return floors
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/button.less";
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/form.less";
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";
  .house-chessbase {
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    .chessbase {
      &-info {
        color:@color-white;
        background-color: @color-light-green;
        .padding(@v: 3rem);
        .info {
          &-title {
            .font(@s: 2rem; @w: 100);
            margin-bottom: 2rem;
          }
          &-desc {
            .font(@s: 1.15rem; @w: 100);
            margin-bottom: 3rem;
          }
          &-list {
            .list {
              &-flat {
                display: grid;
                grid-template-columns: auto 1fr auto;
                grid-column-gap: 1rem;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                margin-bottom: 0rem;
                padding-top: 0.75rem;
                padding-bottom: 0.75rem;
                &__type {
                  border: 1px solid;
                  border-radius: 50%;
                  width: 2.5rem;
                  height: 2.5rem;
                  display: -webkit-box;
                  display: -ms-flexbox;
                  display: flex;
                  -webkit-box-align: center;
                  -ms-flex-align: center;
                  align-items: center;
                  -webkit-box-pack: center;
                  -ms-flex-pack: center;
                  justify-content: center;
                }
                &__amount {
                  font-size: 1.25rem;
                  font-weight: 100;
                  letter-spacing: 0px;
                }
              }
            }
          }
        }
      }
      &-masonry {
        background-color: @color-white;
        .padding(@v: 3rem);
        .masonry {
          &-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #f2f4f6;
            .header {
              &-title {
                .font(@s: 2rem; @w: 100);
              }
            }
          }
          &-chess {
            .chess {
              &-header {
                display: flex;
                justify-content: space-between;
                .font(@s: 1rem; @w: 100);
                margin-bottom: 1rem;
              }
              &-floor {
                display: grid;
                align-items: center;
                grid-template-columns: auto 1fr auto;
                grid-column-gap: 1rem;
                grid-row-gap: 1rem;
                padding-top: 0.2rem;
                padding-bottom: 0.2rem;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                .padding-h(@v: 1rem;);
                &:hover {
                  border-top: 1px solid @color-light-grey;
                  border-bottom: 1px solid @color-light-grey;
                  .floor-num {
                    color: @color-light-green;
                  }
                }
                .floor {
                  &-flats {
                    display: grid;
                    grid-template-columns: repeat(25, 1fr);
                    grid-column-gap: 0.25rem;
                    grid-row-gap: 0.25rem;
                  }
                  &-flat {
                    color: @color-white;
                    background-color: @color-light-green;
                    text-align: center;
                    border-radius: 3px;
                    &__numb {
                      padding: 7px;
                      font-size: 0.875rem;
                      display: inline-block;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
