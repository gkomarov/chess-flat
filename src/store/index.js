import Vue from 'vue'
import Vuex from 'vuex'
import * as axios from 'axios'

Vue.use(Vuex)
Vue.prototype.$rootUrl = 'http://172.100.114.2:8000'
// Vue.prototype.$rootUrl = 'http://127.0.0.1:8000'
const ROOT_URL = Vue.prototype.$rootUrl

const store = new Vuex.Store({
  state: {
    apiKey: localStorage.getItem('apiKey') || null,
    companyHashId: localStorage.getItem('companyHashId') || null,
    userName: localStorage.getItem('userName') || null,
    email: localStorage.getItem('email') || null,
    buildings: localStorage.getItem('buildings') || null,
    currentHouseId: localStorage.getItem('currentHouseId') || null,
    houseFloors: localStorage.getItem('houseFloors') || null,
    fullHouse: localStorage.getItem('fullHouse') || null,
    properties: localStorage.getItem('properties') || null,
    flatsSchemas: localStorage.getItem('flatsSchemas') || null,
    currentBuildingStoreIndex: localStorage.getItem('currentBuildingStoreIndex') || null,
    currentHouseStoreIndex: localStorage.getItem('currentHouseStoreIndex') || null
  },
  getters: {
    loggedIn (state) {
      return state.apiKey != null
    }
  },
  mutations: {
    set (state, { type, items }) {
      state[type] = items
    },
    storeItem (state, data) {
      let name = data.name
      state[name] = data.fields
    },
    destroyItem (state, name) {
      state[name] = null
    },
    retrieveAuthData (state, data) {
      state.apiKey = data['apiKey']
      state.companyHashId = data['companyHashId']
    },
    destroyAuthData (state) {
      state.apiKey = null
      state.companyHashId = null
    }
  },
  actions: {
    setItemToStore (context, data) {
      localStorage.setItem(data.storageName, data.fields)
      context.commit('storeItem', {
        name: data.storageName,
        fields: data.fields
      })
    },
    destroyItemFromStore (context, name) {
      localStorage.removeItem(name)
      context.commit('destroyItem', name)
    },
    writeItem (context, data) {
      return new Promise((resolve, reject) => {
        data.fields['api_key'] = context.state.apiKey
        axios({
          url: ROOT_URL + data.url,
          method: 'POST',
          data: data.fields,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateItem (context, data) {
      return new Promise((resolve, reject) => {
        data.fields['api_key'] = context.state.apiKey
        axios({
          url: ROOT_URL + data.url,
          method: 'PUT',
          data: data.fields,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    removeItem (context, data) {
      return new Promise((resolve, reject) => {
        // data.fields['api_key'] = context.state.apiKey
        // console.info(data.url, data.fields)
        axios({
          url: ROOT_URL + data.url,
          method: 'DELETE',
          data: data.fields,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    retrieveItem (context, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: ROOT_URL + data.url,
          method: 'GET',
          params: {
            api_key: context.state.apiKey
          },
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    storeLoginData (context, loginData) {
      for (let i in loginData) {
        localStorage.setItem(i, loginData[i])
      }
      context.commit('retrieveAuthData', loginData)
    },
    retrieveAuthData (context, credentials) {
      return new Promise((resolve, reject) => {
        let loginData = JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
        axios.post(ROOT_URL + '/login', loginData)
          .then(response => {
            store.dispatch('storeLoginData', {
              apiKey: response.data.api_key,
              companyHashId: response.data.company_hash_id,
              userName: response.data.last_name + ' ' + response.data.first_name + ' ' + response.data.middle_name,
              email: response.data.email
            })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    destroyApiKey (context) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          let data = JSON.stringify({
            api_key: this.state.apiKey,
            company_hash_id: this.state.companyHashId
          })
          axios.post(ROOT_URL + '/logout', data)
            .then(response => {
              context.commit('destroyAuthData')
              localStorage.clear()
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
        })
      }
    },
    registerUser (context, data) {
      return new Promise((resolve, reject) => {
        axios.post(ROOT_URL + '/register', data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
})

export default store
