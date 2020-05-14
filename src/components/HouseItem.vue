<template>
  <div class="buildings-item"
       @mouseover="toggleEditButton"
       @mouseout="toggleEditButton"
  >
    <div>
      <div class="item-image" @click="redirectToCurrentHouseMain">
        <img alt="" src="https://spbhomes.ru/files/building/71/0/images/%D0%97%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5_20Bak27_View01.1482496934.jpg.1920x1080r.jpg"><!--:src="image"-->
      </div>
      <div class="item-desc" @click="redirectToCurrentHouseMain">
        <div>
          <div class="desc-title">{{ streetName }},{{ number }}</div>
          <div class="desc-type">
            <span class="desc-type__badge">Жилой комплекс</span>
          </div>
          <div class="desc-address">{{ streetName }},{{ number }}</div>
        </div>
        <div class="desc-amount">
          <div class="desc-amount__title">Осталось<br>квартир</div>
          <div class="desc-amount__count">{{ flatsBalance }}</div>
        </div>
      </div>
      <div class="item-list">
        <div
          v-for="(flat, key) in flats"
          :key="key"
          class="list-flat"
        >
          <div class="list-flat__type">{{ staticFlatsSchemasTypes[flat.type].alias }}</div>
          <div class="list-flat__desc">
            <div>{{ staticFlatsSchemasTypes[flat.type].title }}</div>
            <div class="list-flat__desc_price">от 1,25 млн.руб.</div>
          </div>
          <div class="list-flat__amount">{{ flat.number_of }}</div>
        </div>
        <div class="item-buttons" v-if="isVisibleButtons">
          <ButtonDefault
            v-if="isVisibleButtons"
            name="Редактировать"
            color="green"
            class="button-expand"
            :actionForClick="redirectToEditHouse"
          />
          <ButtonDefault
            v-if="isVisibleButtons"
            name="Удалить"
            color="red"
            class="button-expand"
            :actionForClick="removeHouse"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'

export default {
  components: { ButtonDefault },
  props: {

    houseId: {
      type: String
    },
    storeIndex: Number,
    numberOfFloors: Number,
    livingFloors: String,
    numberOfEntrance: Number,
    numberOfFlat: Number,
    streetName: String,
    number: String,
    title: String,
    finishing: String,
    flats: Array,
    stageDevelopment: String,
    startDevelopment: String,
    endDevelopment: String
  },
  data () {
    return {
      imageSource: '/static/img/MilleniumFalcon.jpg',
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
      isVisibleButtons: false
    }
  },
  methods: {
    setHouseId () {
      this.$store.dispatch('setItemToStore', {
        fields: this.houseId,
        storageName: 'currentHouseId'
      })
    },
    toggleEditButton () {
      this.isVisibleButtons = !this.isVisibleButtons
    },
    getFullHouse () {
      this.$store.dispatch('retrieveItem', {
        url: '/houses/' + this.houseId,
        storageName: 'properties'
      })
        .then(response => {
          this.$store.dispatch('setItemToStore', {
            storageName: 'properties',
            fields: JSON.stringify(response.data)
          })
        })
        .catch(error => {
          console.info('Не могу получить характеристики дома. Вот почему: ', error.response.data)
        })
    },
    redirectToEditHouse () {
      this.getFullHouse()
      this.setHouseId()
      this.$router.push({
        name: 'HouseProperties',
        params: {
          houseStoreIndex: this.storeIndex,
          editMode: true
        }
      })
    },
    redirectToCurrentHouseMain () {
      this.getFullHouse()
      this.setHouseId()
      this.$router.push({
        name: 'HouseMainProperties',
        params: {
          houseStoreIndex: this.storeIndex
        }
      })
    },
    removeHouse () {
      console.info(this.houseId)
      this.$emit('activateAlertConfirm', this.houseId)
    }
  },
  computed: {
    flatsBalance () {
      let allFlats = 0
      this.flats.map(flat => {
        allFlats += Number(flat.number_of)
      })
      return allFlats
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";

  .buildings {
    &-item {
      background-color: @color-white;
      cursor: pointer;
      &:hover {
        box-shadow: 0 28px 50px rgba(22, 0, 27, 0.14);
      }
      .item {
        &-image {
          img {
            display: block;
            width: 100%;
            max-height: 300px;
            object-fit: cover;
          }
        }
        &-desc {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-column-gap: 1rem;
          align-items: flex-start;
          .padding(@v: 2rem);
          .desc {
            &-title {
              .font(@s: 2rem; @l: -1px; @w: 100);
              word-wrap: break-word;
              word-break: break-all;
            }
            &-type {
              margin: 0.25rem 0rem 1rem;
              &__badge {
                color:@color-white;
                background-color: @color-light-green;
                padding: 0.25rem 0.5rem;
                border-radius: 3px;
                display: inline-block;
                .font(@s: 0.75rem);
              }
            }
            &-address {
              color: @color-dark-grey;
              .font(@s: 0.75rem);
            }
            &-amount {
              .padding(@v: 1rem);
              border: 1px solid @color-light-grey;
              border-radius: 5px;
              color: @color-light-green;
              text-align: center;
              &__title {
                font-size: 0.75rem;
                font-weight: 500;
                line-height: 1.4;
                margin-bottom: 0.5rem;
              }
              &__count {
                font-size: 2rem;
                font-weight: 100;
              }
            }
          }
        }
        &-list {
          position: relative;
          border-top: 1px solid #f2f4f6;
          min-height: 11rem;
          .padding-v(@v: 1rem);
          .list {
            &-flat {
              color: @color-dark-grey;
              display: grid;
              grid-template-columns: auto 1fr auto;
              grid-column-gap: 1rem;
              align-items: center;
              margin-bottom: 0rem;
              .padding-c(@t: 0.75rem; @b: 0.75rem; @l: 2rem; @r: 2rem);
              &:last-child {
                margin-bottom: 0;
              }
              &__type {
                border: 1px solid;
                border-radius: 50%;
                width: 2.5rem;
                height: 2.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              &__desc {
                &_price {
                  color: lighten(@color-dark-grey, 20%);
                  margin-top: 0.35rem;
                  .font(@s: 0.75rem);
                }
              }
              &__amount {
                .font(@s: 1.25rem; @w: 100);
              }
            }
          }
        }
        &-buttons {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(254,254,254,0.5);
          .padding(@v:2rem);
          display: flex;
          flex-direction: column;
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          button {
            margin-bottom: 1rem;
            &:last-child {
                margin-bottom: 0;
            }
          }
        }
      }
    }
  }
</style>
