import firebase from '~/plugins/firebase.js'

export default {
    namespaced: true,
    state: {
        authed: null,
        authChecked: false,
        uid: null
    },
    mutations: {
        setAuthed(state, value) {
            state.authed = value
        },
        setUID(state, value) {
            state.uid = value
        },
        setAuthChecked(state, value) {
            state.authChecked = value
        }
    },
    actions: {
        async addQuote({ dispatch }, { source, relation, quote }) {
            await firebase.firestore().collection('quotes').add({
                quote: quote,
                relation: relation,
                source: source
            })
            .then(() => {
                console.log("Quote created")
                dispatch('refreshQuotes', null, { root: true })
                    .then(() => { console.log('refreshed')})
                    .catch(() => { console.log('refresh error')})
            })
            .catch(() => {
                console.log('Could not create quote')
            })
            return { quote, relation, source}
        },
        async editQuote({ dispatch }, { id, source, relation, quote }) {
            await firebase.firestore().collection("quotes").doc(id).set({
                id: id,
                quote: quote,
                relation: relation,
                source: source
            })
            .then(() => {
                console.log("Document successfully written!");
                dispatch('refreshQuotes', null, { root: true })
                    .then(() => { console.log('refreshed')})
                    .catch(() => { console.log('refresh error')})
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            return { id, quote, relation, source}
        },
        async deleteQuote({ dispatch }, { id }) {
            await firebase.firestore().collection("quotes").doc(id).delete().then(() => {
                console.log('Quote deleted')
            }).catch((error) => {
                console.log('Cannot delete the quote')
            })
            await dispatch('refreshQuotes', null, { root: true })
            return id
        },
        async checkAuth({ commit, getters }) {
            await firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    commit('setAuthed', true)
                    commit('setAuthChecked', true)
                    console.log('OK')
                } else {
                    commit('setAuthed', false)
                    commit('setAuthChecked', true)
                    console.log('NO')
                }
            })
            return getters.getAuthed
        },
        async logIn({ commit, getters, dispatch }, { email, password }) {
            await firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setAuthed', true)
                    commit('setUID', user.user.uid)
                },
                err => {

                })
                await dispatch('refreshQuotes', null, { root: true })
                    .then(() => { console.log('refreshed')})
            return email
        },
        logOut({ commit }) {
            firebase.auth().signOut()
                .then(() => {
                    commit('setAuthed', false)
                    commit('setUID', '')
                },
                error => {
                    
                });
        },
    },
    getters: {
        getAuthed(state) {
            return state.authed;
        },
        getUID(state) {
            return state.uid;
        },
        isAuthChecked(state) {
            return state.authChecked
        }
    }
}