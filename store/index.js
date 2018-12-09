import Vue from 'vue'
import Vuex from 'vuex'
import db from '~/plugins/firebase.js'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    quoteList: [],
    quoteCurrent: {}
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
    refreshQuotes({commit}) {
      return new Promise((resolve, reject) => {
        db.collection('quotes').get().then(
          (querySnapshot) => {
            console.log('ok')
            commit('setQuoteList', [])
            querySnapshot.forEach(doc => {
              let data = {
                'id': doc.id,
                'quote': doc.data().quote,
                'relation': doc.data().relation,
                'source': doc.data().source
              }
              console.log(data)
              commit('setQuoteList', data)
              resolve()
            });
          }
        )
      })
    }
  }
})

export default store