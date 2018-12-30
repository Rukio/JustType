import firebase from '~/plugins/firebase.js'

export default {
    namespaced: true,
    state: {
        userAuthed: false,
        userAuthChecked: false,
        userId: '',
        userEmail: 'Not defined still',
        userName: '',
        userTypeRecordCPM: '',
        noRecordMsg: 'No activity yet',
        speedFormat: 'WPM',
    },
    mutations: {
        setUserAuthed(state, value) {
            state.userAuthed = value
        },
        setUserAuthChecked(state, value) {
            state.userAuthChecked = value
        },
        setUserId(state, value) {
            state.userId = value
        },
        setUserEmail(state, value) {
            state.userEmail = value
        },
        setUserName(state, value) {
            state.userName = value
        },
        setUserTypeRecordCPM(state, value) {
            state.userTypeRecordCPM = value
        },
        setSpeedFormat(state, value) {
            state.speedFormat = value
        }
    },
    actions: {
        loginUser({ state, commit }, { email, password }) {
            return new Promise((resolve, reject) => {
                if (state.userAuthed) reject('User is already logged in')
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(() => {
                        commit('setUserAuthed', true)
                        commit('setUserAuthChecked', true)
                        resolve('Logged in successfully')
                    })
                    .catch(error => {
                        commit('setUserAuthed', false)
                        commit('setUserAuthChecked', true)
                        reject(error)
                    })
            })
        },
        logoutUser({ state, commit }) {
            if (!state.userAuthed) {
                reject('LOL, you are not logged in to be able to logout')
            }
            return new Promise((resolve, reject) => {
                firebase.auth().signOut()
                    .then(() => {
                        commit('setUserAuthed', false)
                        resolve('User has logged out')
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        registerUser({ commit, dispatch, state }, { email, password, nameDisplayed }) {
            return new Promise((resolve, reject) => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    commit('setUserAuthed', true)
                    commit('setUserAuthChecked', true)
                    resolve('Registered successfully')
                })
                .then(() => {
                    dispatch('addUserProperties', {
                        email: email,
                        nameShowed: nameDisplayed,
                        typeRecordCPM: '0'
                    }).then((result) => {
                        console.log(result)
                    }).catch((error) => { console.log(error)})
                })
                .catch((error) => {
                    reject(error)
                });
            })
        },
        addUserProperties({ commit }, { email, nameShowed, typeRecordCPM }) {
            return new Promise((resolve, reject) => {
                firebase.firestore().collection('user_props').doc(email).set({
                    nameShowed: nameShowed,
                    typeRecord: typeRecordCPM
                })
                .then(() => {
                    commit('setUserName', nameShowed)
                    commit('setUserTypeRecordCPM', typeRecordCPM)
                    console.log(email + ' ' + nameShowed + ' ' + typeRecordCPM)
                    resolve('User props added')
                })
                .catch((error) => {
                    reject('Error adding user props ' + error)
                })
            })
        },
        refreshUserProperties({ commit }, { email }) {
            return new Promise((resolve, reject) => {
                console.log('The email is ' + email)
                firebase.firestore().collection('user_props').doc(email).get()
                    .then(prop => {
                        if (prop.exists) {
                            commit('setUserName', prop.data().nameShowed)
                            commit('setUserTypeRecordCPM', prop.data().typeRecord)
                            resolve(prop.data())
                        } else {
                            reject('No properties for this user')
                        }
                    })
                    .catch(error => {
                        console.log()
                        reject("Can't get props " + error)
                    })
            })
        },
        checkUserAuth({ commit, dispatch }) {
            return new Promise((resolve, reject) => {
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        commit('setUserAuthed', true)
                        commit('setUserAuthChecked', true)
                        commit('setUserEmail', user.email)
                        dispatch('refreshUserProperties', {
                            email: user.email
                        })
                        resolve('User is logged')
                        console.log(user)
                    } else {
                        commit('setUserAuthed', false)
                        commit('setUserAuthChecked', true)
                        reject('User is not logged')
                    }
                })
            })
        },
        writeSpeedRecord({ state, commit }, { value }) {
            return new Promise((resolve, reject) => {
                let oldRecord
                firebase.firestore().collection('user_props').doc(state.userEmail)
                    .get()
                    .then((result) => {
                        if (result.exists) {
                            oldRecord = result.data().typeRecord
                            console.log('Getting old record')
                        } else {
                            console.log('No prop')
                        }
                    })
                    .then(() => {
                        if (value > oldRecord) {
                            console.log('Writing new record, congrats.')
                            firebase.firestore().collection('user_props').doc(state.userEmail).set({
                                typeRecord: value
                            }, { merge: true })
                            commit('setUserTypeRecordCPM', value)
                            resolve('Speed record has been wrote')
                        } else {
                            console.log('Value ' + value + ' is less than the current record')
                        }
                    })
                    .catch(error => {
                        reject("Can't write a record - " + error)
                    })
            })
        }
    },
    getters: {
        getUserTypeRecord: state => {
            if (state.userTypeRecordCPM != 0) {
                if (state.speedFormat == 'CPM') {
                    return state.userTypeRecordCPM
                } else if (state.speedFormat == 'WPM') {
                    return state.userTypeRecordCPM / 5
                }
            } else {
                return state.noRecordMsg
            }
        }
    }
}