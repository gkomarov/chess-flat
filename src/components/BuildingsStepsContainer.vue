<template>
  <div>
    <div>
      <div class="uk-flex uk-flex-between">
        <h1>ЖК "Millennium Falcon" (шаг №1 из 6)</h1>
        <ButtonDefault
          name="Удалить объект"
          color="red"
        />
      </div>
      <ul class="uk-width-1-1 uk-navbar-nav">
        <li>1. О жилом комплексе</li>
        <li>2. Характеристики дома</li>
        <li>3. Типовые планровки</li>
        <li>4. Типовые этажи</li>
        <li>5. Пронумеровать</li>
        <li>6. Цены</li>
      </ul>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BuildingsCreateInfo from './BuildingProperties'
import ButtonDefault from './ButtonDefault'

export default {
  name: 'BuildingsStepsContainer',
  components: {
    BuildingsCreateInfo,
    ButtonDefault
  }
}
</script>

<style scoped>

</style>
