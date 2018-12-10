import firebase from '~/plugins/firebase.js'

export default {
    state: {
        authed: false,
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