import Vue from 'vue'
import Vuex from 'vuex'
import db from '~/plugins/firebase.js'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    quoteList: [],
    quoteCurrent: ''
  },
  mutations: {
    setQuoteList(state, data) {
      state.quoteList.push(data)
    },
    setQuoteCurrent(state, quote) {
      state.quoteCurrent = quote
    }
  },
  actions: {
    refreshQuotes() {
      db.collection('quotes').get().then(
        (querySnapshot) => {
          commit('setQuoteList', null)
          querySnapshot.forEach(doc => {
            let data = {
              'id': doc.id,
              'quote': doc.data().quote,
              'relation': doc.data().relation,
              'source': doc.data().source
            }
            commit('setQuoteList', data)
          });
        }
      )
    }
  }
})

export default store