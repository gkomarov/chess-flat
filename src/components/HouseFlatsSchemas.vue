<template>
  <div>
    <HouseContainer>
      <HouseFlatsSchemasList/>
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
      <AlertDefault
        v-if="alertMessage"
        :message="alertMessage"
      />
    </div>
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import HouseContainer from './HouseContainer'
import AlertDefault from './AlertDefault'
import HouseFlatsSchemasList from './HouseFlatsSchemasList'

export default {
  name: 'HouseFlatsSchemas',
  data () {
    return {
      alertMessage: ''
    }
  },
  components: {
    AlertDefault,
    ButtonDefault,
    HouseContainer,
    HouseFlatsSchemasList
  },
  methods: {
    getBack () {
      this.$router.push({
        name: 'HouseProperties',
        params: {
          houseStoreIndex: this.storeIndex
        }
      })
    },
    redirectToNextStep () {
      if (this.$store.state.flatsSchemas) {
        this.$router.push({
          name: 'HouseFloors',
          params: {
            houseStoreIndex: this.storeIndex
          }
        })
      } else {
        this.alertMessage = 'Вы не создали ни одной планировки'
      }
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
