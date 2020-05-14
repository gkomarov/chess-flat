<template>
  <div class="house-floors">
    <div>
      <div class="floors-title">Создайте типовые этажи:</div>
      <div class="floors">
        <div class="floors-create">
          <div class="floors-create__image">
            <img width="200" height="200" src="/static/img/blank_layout.svg"/>
          </div>
          <ButtonDefault
            color="green"
            name="Добавить типовой этаж"
            :actionForClick="activateSidebar"
          />
        </div>
        <HouseFloorsItem
          v-for="(floor, index) in floors"
          :key="floor.hash_id"
          :floorId="floor.hash_id"
          :storeIndex="index"
          :image="floor.image"
          :floorNumber="floor.number"
          :numberOfFlats="floor.number_of_flats"
          :markingEnable="floor.marking_enable"
          :cloneFloors="floor.clone_floors.split(',')"
          @activateSidebar="activateSidebar"
          @activateAlertConfirm="activateAlertConfirm"
          @emitMarkingFloor="markingFloor"
        />
      </div>
    </div>
    <HouseFloorsAdd
      v-if="sidebar.show"
      :houseId="houseId"
      :selectedFloor="sidebar.selectedFloor"
      :editMode="sidebar.editMode"
      :sidebarShow="sidebar.show"
      :freeFloors="freeFloors"
      :storeIndex="sidebar.storeIndex.toString()"
      @closeSidebar="closeSidebar"
      @refreshAfterChange="refreshAfterChange"
    />
    <HouseFloorsMarking
      v-if="floorMarking"
      :currentFloorId="selectedFloor.id"
      :numberOfFlats="selectedFloor.numberOfFlats"
      @closeMarking="closeMarking"
    />
    <AlertDefault
      v-if="alertMessage"
      :message="alertMessage"
      @alertDie="killAlert"
    />
    <AlertConfirm
      v-if="alertConfirm.isActive"
      :additionalMessage="alertConfirm.additionalMessage"
      @isAgree="removeFloor"
      @isDisagree="closeAlertConfirm"
    />
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import AlertConfirm from './AlertConfirm'
import AlertDefault from './AlertDefault'
import HouseContainer from './HouseContainer'
import HouseFloorsAdd from './HouseFloorsAdd'
import HouseFloorsItem from './HouseFloorsItem'
import HouseFloorsMarking from './HouseFloorsMarking'

export default {
  name: 'HouseFloorsList',
  data () {
    return {
      houseId: '',
      selectedFloor: {
        id: '',
        numberOfFlats: null
      },
      floorMarking: false,
      freeFloors: [],
      alertConfirm: {
        isActive: false,
        additionalMessage: 'Если вы удалите этот объект, то все данные будут отображаться не корректно'
      },
      alertMessage: '',
      floors: [],
      sidebar: {
        show: false,
        editMode: false,
        storeIndex: '',
        selectedFloor: {}
      }
    }
  },
  components: {
    ButtonDefault,
    AlertConfirm,
    AlertDefault,
    HouseContainer,
    HouseFloorsAdd,
    HouseFloorsItem,
    HouseFloorsMarking
  },
  created () {
    this.houseId = this.$store.state.currentHouseId
    if (this.houseId !== undefined) {
      this.getFloors()
    }
  },
  methods: {
    closeSidebar () {
      /** Возвращает все элементы объекта sidebar в data в первоначальное состояние */
      Object.assign(this.$data.sidebar, this.$options.data().sidebar)
    },
    killAlert () {
      this.alertMessage = ''
    },
    closeMarking () {
      this.floorMarking = false
      this.getFloors()
    },
    getBack () {
      this.$router.push({ name: 'HouseFlatsSchemas' })
    },
    getFloors () {
      this.$store.dispatch('retrieveItem', {
        url: '/houses/' + this.houseId + '/floor-types',
        storageName: 'houseFloors'
      })
        .then(houseFloors => {
          this.$store.dispatch('setItemToStore', {
            storageName: 'houseFloors',
            fields: JSON.stringify(houseFloors.data)
          })
            .then(() => {
              this.floors = houseFloors.data
            })
            .catch(error => {
              this.alertMessage = 'Не могу получить список этажей. Обратитесь к администратору'
              console.info('Не могу получить список этажей. Вот почему: ', error.response.data)
            })
        })
    },
    markingFloor (floorParams) {
      this.floorMarking = floorParams.markingEnable
      this.selectedFloor.id = floorParams.id
      this.selectedFloor.numberOfFlats = floorParams.numberOfFlats
      if (!this.floorMarking) {
        this.alertMessage = 'Сначала Вы должны разметить предыдущий этаж'
      }
    },
    activateSidebar (floorStoreIndex) {
      if (floorStoreIndex !== undefined) {
        this.sidebar.storeIndex = floorStoreIndex
        this.sidebar.selectedFloor = this.floors[floorStoreIndex]
        this.sidebar.editMode = true
        this.sidebar.show = true
      } else {
        this.freeFloors = this.getFreeFloors()
        if (this.freeFloors.firstValidFloor) {
          this.sidebar.show = true
        }
      }
    },
    getFreeFloors () {
      let livingFloorsArr = JSON.parse(this.$store.state.properties).living_floors.split(',')
      let cloneFloorsList = livingFloorsArr.map(floor => { return Number(floor) })
      let lastLivingFloor = cloneFloorsList[1]
      let firstValidFloor = null
      /** Прибавляется 1 к первому жилому этажу, чтобы номер первого этажа не оказался клонируемым */
      cloneFloorsList[0]++
      /** Получаем список всех жилых этажей */
      let typeFloors = JSON.parse(this.$store.state.houseFloors)
      if (typeFloors.length) {
        let lastFloor = typeFloors.reverse()[0]
        let lastClonedFloorsStr = lastFloor.clone_floors
        let lastBusyFloor = lastFloor.number
        let lastClonedFloor = Number(lastClonedFloorsStr.split(',').reverse()[0]) || null
        // console.info('lastClonedFloor', lastClonedFloor, 'lastLivingFloor', lastLivingFloor, 'lastBusyFloor', lastBusyFloor)
        if (lastClonedFloor !== null && lastClonedFloor < lastLivingFloor) {
          /** Следующий после последнего клонируемого, будет в поле ввода.
           *  тогда первый клонируемый будет (последний клонируемый + 2) */
          firstValidFloor = lastClonedFloor + 1
          cloneFloorsList[0] = lastClonedFloor + 2
        } else if (lastBusyFloor < lastLivingFloor && lastClonedFloor == null) {
          firstValidFloor = lastBusyFloor + 1
          cloneFloorsList[0] = lastBusyFloor + 2
        } else {
          this.alertMessage = 'Больше нет свободных этажей'
          cloneFloorsList = []
        }
      }
      return { firstValidFloor, cloneFloorsList }
    },
    removeFloor () {
      this.$store.dispatch('removeItem', {
        url: '/floor-types/' + this.selectedFloor.id
      })
        .then(() => {
          this.alertMessage = 'Этаж успешно удалён'
          this.getFloors()
        })
        .catch(error => {
          this.alertMessage = 'Не удалось удалить этаж'
          console.info('Не удалось удалить этаж. Вот почему: ', error.response.data)
        })
      this.closeAlertConfirm()
    },
    activateAlertConfirm (floorId) {
      this.selectedFloor.id = floorId
      this.alertConfirm.isActive = true
    },
    closeAlertConfirm () {
      this.alertConfirm.isActive = false
    },
    refreshAfterChange () {
      this.getFloors()
      this.closeSidebar()
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
  .house-floors {
    .floors {
      &-title {
        .font(@s: 1.75rem; @w: 100);
        margin-bottom: 2rem;
      }
      .grid(@c: 5);
      @media @xdesktop {
        .grid(@c: 4);
      }
      @media @desktop {
        .grid(@c: 3);
      }
      @media @tablet {
        .grid(@c: 2);
      }
      @media @mobile {
        .grid(@c: 1);
      }
      &-create {
        background-color: @color-white;
        .padding(@v: 2rem);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        &:hover {
          box-shadow: 0 28px 50px rgba(22, 0, 27, 0.14);
        }
        &__image {
          margin-bottom: 2rem;
        }
      }
    }
  }
</style>
