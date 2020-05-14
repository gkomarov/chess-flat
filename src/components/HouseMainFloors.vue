<template>
  <HouseMain>
    <HouseFloorsList/>
  </HouseMain>
</template>

<script>
import HouseMain from './HouseMain'
import HouseFloorsList from './HouseFloorsList'

export default {
  name: 'HouseMainFloors',
  components: {
    HouseMain,
    HouseFloorsList
  }
}
</script>

<style scoped>

</style>
