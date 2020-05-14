<template>
  <div class="house-container">
    <div class="house-header">
      <div class="header-top">
        <div class="header-title">
          <router-link class="header-title__link" :to="{ name: 'BuildingMain' }">ЖК "Millennium Falcon"</router-link>
        </div>
      </div>
      <ul class="header-nav">
        <li class="nav-item">
          <router-link step="1" class="nav-link" :to="{ name: 'HouseProperties' }">
            <span class="nav-link__step">1.</span>
            <span class="nav-link__title">Характеристики дома</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link step="2" class="nav-link" :to="{ name: 'HouseFlatsSchemas' }">
            <span class="nav-link__step">2.</span>
            <span class="nav-link__title">Типовые планровки</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link step="3" class="nav-link" :to="{ name: 'HouseFloors' }">
            <span class="nav-link__step">3.</span>
            <span class="nav-link__title">Типовые этажи</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link step="4" class="nav-link" :to="{ name: 'HouseChess' }">
            <span class="nav-link__step">4.</span>
            <span class="nav-link__title">Шахматка</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link step="5" class="nav-link" :to="{ name: 'HousePrices' }">
            <span class="nav-link__step">5.</span>
            <span class="nav-link__title">Цены</span>
          </router-link>
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'

export default {
  name: 'HouseContainer',
  components: {
    ButtonDefault
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/button.less";
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";
  .house-container {
    .house {
      &-header {
        margin-bottom: 3rem;
        .header {
          &-title {
            .font(@s: 2rem);
            &__link {
              color: @color-dark-black;
              text-decoration: none;
            }
          }
          &-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 3rem;
          }
          &-nav {
              display: flex;
              align-items: center;
              justify-content: space-between;
              list-style-type: none;
            .nav {
              &-item {

              }
              &-link {
                color: @color-dark-grey;
                .font(@w: 700);
                text-decoration: none;
                &:hover {
                  color: darken(@color-dark-grey, 50%);
                }
                &.router-link-active {
                  color: @color-light-green;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
