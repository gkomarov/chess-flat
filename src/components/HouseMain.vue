<template>
  <div>
    <div class="house-main">
      <router-link class="main-title" :to="{ name: 'BuildingMain'  }">Жилой комплекс</router-link>
      <div class="main-nav">
        <router-link class="nav-item" :to="{ name: 'HouseMainProperties' }">Характеристики<br>дома</router-link>
        <router-link class="nav-item" :to="{ name: 'HouseMainChess' }">Шахматка</router-link>
        <router-link class="nav-item" :to="{ name: 'HouseMainFlatsSchemas' }">Типовые<br>планровки</router-link>
        <router-link class="nav-item" :to="{ name: 'HouseMainFloors' }">Типовые<br>этажи</router-link>
        <router-link class="nav-item" :to="{ name: 'HouseMainFacades' }">Фасады</router-link>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HouseMain'
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/font.less";
  @import (less) "../../static/less/color.less";
  @import (less) "../../static/less/grid.less";
  @import (less) "../../static/less/media.less";
  @import (less) "../../static/less/padding.less";
  .house-main {
    margin-bottom: 2rem;
    .main {
      &-title {
        .font(@s: 2rem;@w: 400);
        text-decoration: none;
        color: #343434;
      }
      &-nav {
        margin-top: 2rem;
        .grid(@c: 5;@cg: 0);
        .nav {
          &-item {
            .font(@s: 1.25rem;@w: 400);
            color: @color-light-green;
            box-shadow: 0 0 0 1px @color-dark-grey;
            .padding-c(@t: 1.5rem; @b: 1.5rem; @l: 1rem; @r: 1rem;);
            text-decoration: none;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            &:hover {
              background-color: @color-dark-grey;
              color: @color-white;
              box-shadow: 0 0 0 1px @color-dark-grey;
              z-index: 1;
            }
            &.router-link-exact-active {
              background-color: @color-light-green;
              color: @color-white;
              box-shadow: 0 0 0 1px #1abc9c;
              z-index: 1;
            }
          }
        }
      }
    }
  }
</style>
