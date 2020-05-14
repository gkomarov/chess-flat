<template>
  <div>
    <HouseContainer>
      <HouseFloorsList/>
    </HouseContainer>
    <div class="house-buttons">
      <ButtonDefault
        name="Предыдущий шаг"
        color="grey"
        :actionForClick="getBack"
      />
      <ButtonDefault
        name="Следующий шаг"
        color="green"
        :actionForClick="redirectToNextStep"
      />
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import HouseFloorsList from './HouseFloorsList'
import HouseContainer from './HouseContainer'

export default {
  name: 'HouseFloors',
  components: {
    HouseFloorsList,
    HouseContainer,
    ButtonDefault
  },
  methods: {
    getBack () {
      this.$router.push({ name: 'HouseFlatsSchemas' })
    },
    redirectToNextStep () {
      this.$router.push({ name: 'HouseChess' })
    }
  }
}
</script>

<style lang="less" scoped>
  @import (less) "../../static/less/color.less";
  .house-buttons {
    border-top: 1px solid @color-light-grey;
    padding-top: 2rem;
    margin-top: 4rem;
    display: flex;
    justify-content: space-between;
  }
</style>
