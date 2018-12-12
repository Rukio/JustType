import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '~/plugins/firebase.js'
import admin from '~/store/admin.js'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    quoteList: [],
    quoteCurrent: {}
  },
  mutations: {
    setQuoteList(state, data) {
      state.quoteList = data
    },
    setQuoteCurrent(state, quote) {
      state.quoteCurrent = quote
    }
  },
  actions: {
    refreshQuotes({ commit }) {
      return new Promise((resolve, reject) => {
        firebase.firestore().collection('quotes').get().then(
          (querySnapshot) => {
            commit('setQuoteList', [])
            let newQuoteList = [];
            querySnapshot.forEach(doc => {
              let data = {
                'id': doc.id,
                'quote': doc.data().quote,
                'relation': doc.data().relation,
                'source': doc.data().source
              }
              newQuoteList.push(data)
            });
            commit('setQuoteList', newQuoteList)
            // console.log(newQuoteList)
            // console.log(state.quoteList)
            resolve()
          }
        )
      })
    }
  },
  getters: {
    getQuoteList(state) {
      return state.quoteList
    },
    getQuoteCurrent(state) {
      return state.quoteCurrent
    }
  },
  modules: {
    admin
  }
})

export default store