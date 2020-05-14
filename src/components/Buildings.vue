<template>
  <div class="buildings">
    <AlertDefault
      v-if="alertMessage"
      :message="alertMessage"
      @alertDie="alertMessage = ''"
    />
    <div class="buildings-create">
      <div class="create">
        <div class="create-title">Новый объект</div>
        <div class="create-button">
          <ButtonDefault
            name="Добавить объект"
            color="grey"
            class="create-button__add button-expand"
            :actionForClick = "redirectToCreate"
          ></ButtonDefault>
          <ButtonDefault
            name="Создадим за вас"
            color="green"
            class="button-expand"
          ></ButtonDefault>
        </div>
        <div class="create-desc">Доверьте создание объекта персональному <span>менеджеру</span>.</div>
      </div>
      <img class="create-image" src="/static/img/PersonalManager.jpg" alt="">
    </div>
    <AlertConfirm
      v-if="alertConfirm.isActive"
      :additionalMessage="alertConfirm.additionalMessage"
      @isAgree="removeBuilding"
      @isDisagree="closeAlertConfirm"
    />
    <BuildingsItem
      v-for="(item, index) of buildings"
      :key="item.building.id"
      :storeIndex="index"
      :buildingId="item.building.hash_id"
      :title="item.building.name"
      :imageSource="item.building.images"
      :city="item.building.city"
      :address="item.building.address"
      :country="item.building.country"
      :district="item.building.district"
      :region="item.building.region"
      :flats="item.flats_by_type"
      @activateAlertConfirm="activateAlertConfirm"
    />
  </div>
</template>

<script>
import ButtonDefault from './ButtonDefault'
import BuildingsItem from './BuildingsItem'
import AlertDefault from './AlertDefault'
import AlertConfirm from './AlertConfirm'

export default {
  name: 'Buildings',
  data () {
    return {
      buildings: [],
      alertMessage: '',
      selectedBuildingId: '',
      alertConfirm: {
        isActive: false,
        additionalMessage: 'Если вы удалите этот объект, то все данные будут отображаться не корректно'
      }
    }
  },
  components: {
    AlertDefault,
    AlertConfirm,
    BuildingsItem,
    ButtonDefault
  },
  created () {
    // На главной странице удаляем индекс текущего дома из store.
    this.getBuildings()
  },
  methods: {
    getBuildings () {
      let companyHashId = this.$store.state.companyHashId
      this.$store.dispatch('retrieveItem', {
        url: '/company/' + companyHashId + '/buildings',
        storageName: 'buildings'
      })
        .then(response => {
          this.$store.dispatch('setItemToStore', {
            storageName: 'buildings',
            fields: JSON.stringify(response.data)
          })
          this.buildings = response.data
        })
        .catch(error => {
          this.alertMessage = 'Не могу получить список домов. Обратитесь к администратору.'
          console.info(error.response)
        })
    },
    redirectToCreate () {
      this.$store.dispatch('destroyItemFromStore', 'currentBuildingStoreIndex')
      this.$router.push({ name: 'BuildingProperties' })
    },
    removeBuilding () {
      this.$store.dispatch('removeItem', {
        url: '/buildings/' + this.selectedBuildingId
      })
        .then(() => {
          this.alertMessage = 'Объект успешно удалён'
          this.getBuildings()
        })
        .catch(error => {
          this.alertMessage = 'Не удалось удалить объект'
          console.info('Не удалось удалить объект. Вот почему: ', error.response.data)
        })
      this.closeAlertConfirm()
    },
    activateAlertConfirm (buildingId) {
      this.selectedBuildingId = buildingId
      this.alertConfirm.isActive = true
    },
    closeAlertConfirm () {
      this.alertConfirm.isActive = false
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
    .grid();
    @media @desktop {
      .grid(@c: 2);
    }
    @media @tablet{
      .grid(@c: 1);
    }
    @media @mobile {
      grid-row-gap: 1rem;
    }
    &-create {
      background-color: @color-white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &:hover {
        box-shadow: 0 28px 50px rgba(22, 0, 27, 0.14);
      }
      .create {
        .padding(@v: 2rem);
        &-title {
          font-size: 2rem;
          font-weight: 100;
        }
        &-button {
          .padding-v(@v: 2rem);
          .grid(@c: 2);
          @media @xdesktop {
            .grid(@c: 1;@rg: 1rem);
          }
          @media @desktop {
            .grid(@c: 2;@rg: 1rem);
          }
          @media @mobile {
            .grid(@c: 1;@rg: 1rem);
          }
        }
        &-desc {
          color: @color-light-black;
          .font(@s:1.5rem;@w: 100);
          .padding-c(@t: 2rem; @b: 1rem; @l: 0rem; @r: 5rem;);
          text-align: right;
          position: relative;
          &:before {
            content: '';
            display: block;
            width: 48px;
            height: 48px;
            background-size: cover;
            background-repeat: no-repeat;
            background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjRweCIgdmVyc2lvbj0iMS4xIiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiPgogIDxnPgogICAgPHBhdGggZmlsbD0iIzYzNmU3MiIgZD0ibTYzLjM4NiwxNi4xOTNsLjAwMi0uMDAyYzAuMDAyLTAuMDAzIDAuMDA0LTAuMDA2IDAuMDA2LTAuMDEgMC4xNzItMC4xOTUgMC4yOTgtMC40MyAwLjM5OS0wLjY3OCAwLjAzMi0wLjA3NiAwLjA1My0wLjE0OCAwLjA3Ni0wLjIyNSAwLjA1OC0wLjE5MSAwLjA5NC0wLjM4OSAwLjEwNi0wLjU5NiAwLjAwNi0wLjA3NiAwLjAxOC0wLjE0OCAwLjAxNi0wLjIyNiAwLTAuMDQgMC4wMS0wLjA3NiAwLjAwOC0wLjExNS0wLjAxNC0wLjIzOS0wLjA2Mi0wLjQ3LTAuMTM2LTAuNjg3LTAuMDA2LTAuMDIzLTAuMDIyLTAuMDQxLTAuMDMtMC4wNjQtMC4wODgtMC4yMzktMC4yMTQtMC40NTEtMC4zNjMtMC42NDUtMC4wMjEtMC4wMjctMC4wMjgtMC4wNjMtMC4wNS0wLjA5bC0xMC4zMTEtMTIuMTQ2Yy0wLjc4OS0wLjkzLTIuMDg0LTAuOTQ4LTIuODk0LTAuMDM3LTAuODA4LDAuOTEtMC44MjMsMi40MDItMC4wMzIsMy4zMzRsNS41NTgsNi41NDljLTguMTIxLTEuMDc2LTE2LjEwNCwwLjYzMy0xNi40ODEsMC43MTctMjQuNjQ2LDQuNDY3LTQyLjA4NywyNy4yMjctMzguODgsNTAuNzM2IDAuMTU5LDEuMTY0IDEuMDI4LDEuOTkyIDIuMDE5LDEuOTkyIDAuMTA2LDAgMC4yMTItMC4wMDkgMC4zMi0wLjAyNyAxLjExNi0wLjIwMyAxLjg3OC0xLjQwOSAxLjcwNC0yLjY5Ni0yLjg1Ny0yMC45NCAxMy4wNTYtNDEuMjgyIDM1LjUzNy00NS4zNTggMC4xMDMtMC4wMjQgOC4zNTEtMS43OTQgMTYuMTE3LTAuNTc0bC04LjU3Nyw1LjA5M2MtMS4wMDUsMC41OTgtMS4zOTgsMi4wMi0wLjg4MSwzLjE3NyAwLjUxNiwxLjE1OSAxLjc0OCwxLjYwOCAyLjc1NiwxLjAxN2wxMy41Mi04LjAyOGMwLjE4My0wLjExMSAwLjM0Ny0wLjI1IDAuNDkxLTAuNDExeiIvPgogIDwvZz4KPC9zdmc+Cg==);
            transform: scale(-1, 1) rotate(-60deg);
            position: absolute;
            right: 20px;
            top: 0;
          }
          @media @xdesktop {
            .padding-c(@t: 2rem; @b: 1rem; @l: 5rem; @r: 0rem;);
            text-align: left;
            &:before {
              right: inherit;
              left: 20px;
              transform: scale(1, 1) rotate(-60deg);
            }
          }
          @media @desktop {
            .padding-c(@t: 2rem; @b: 1rem; @l: 0rem; @r: 5rem;);
            text-align: right;
            &:before {
              right: 20px;
              left: inherit;
              transform: scale(-1, 1) rotate(-60deg);
            }
          }
          @media @mobile {
            .padding-c(@t: 2rem; @b: 1rem; @l: 5rem; @r: 0rem;);
            text-align: left;
            &:before {
              width: 36px;
              height: 36px;
              right: inherit;
              left: 10px;
              transform: scale(1, 1) rotate(-60deg);
            }
          }
        }
        &-image {
          display: block;
          width: 100%;
          object-fit: cover;
        }
      }
    }
  }
</style>
