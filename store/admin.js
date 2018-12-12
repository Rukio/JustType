import firebase from '~/plugins/firebase.js'

export default {
    state: {
        authed: null,
        uid: null
    },
    mutations: {
        setAuthed(state, value) {
            state.authed = value
        },
        setUID(state, value) {
            state.uid = value
        }
    },
    actions: {
        async editQuote({ dispatch }, { id, source, relation, quote }) {
            await firebase.firestore().collection("quotes").doc(id).set({
                id: id,
                quote: quote,
                relation: relation,
                source: source
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            dispatch('refreshQuotes')
                .then(() => { console.log('refreshed')})
                .catch(() => { console.log('refresh error')})
        },
        async deleteQuote({ dispatch }, { id }) {
            await firebase.firestore().collection("quotes").doc(id).delete().then(() => {
                console.log("Document successfully deleted!")
            }).catch((error) => {
                console.error("Error removing document: ", error)
            })
            dispatch('refreshQuotes')
                .then(() => { console.log('refreshed')})
                .catch(() => { console.log('refresh error')})
        },
        checkAuth({ commit, getters }) {
            return new Promise((resolve, reject) => {
                firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    commit('setAuthed', true)
                    console.log('User is authed ' + getters.getAuthed)
                    resolve()
                } else {
                    commit('setAuthed', false)
                    console.log('User is not authed ' + getters.getAuthed)
                    reject()
                }
                });
            })
        },
        logIn({ commit, getters, dispatch }, { email, password }) {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setAuthed', true)
                    commit('setUID', user.user.uid)
                    dispatch('refreshQuotes')
                        .then(() => { console.log('refreshed')})
                    console.log(getters.getAuthed)
                    console.log(getters.getUID)
                },
                err => {
                    console.log('GTFO '+ err)
                })
        },
        logOut({ commit }) {
            firebase.auth().signOut()
                .then(() => {
                    commit('setAuthed', false)
                    commit('setUID', '')
                },
                error => {
                    console.log(`Can't log out`)
                });
        },
    },
    getters: {
        getAuthed(state) {
            return state.authed;
        },
        getUID(state) {
            return state.uid;
        }
    }
}