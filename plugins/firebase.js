import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import Vue from 'vue';

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
        apiKey: "AIzaSyCOmCs28DIAr5Y8rRcc_oDo4wfj7vWx8es",
        authDomain: "just-type-7eb7c.firebaseapp.com",
        databaseURL: "https://just-type-7eb7c.firebaseio.com",
        projectId: "just-type-7eb7c",
        storageBucket: "just-type-7eb7c.appspot.com",
        messagingSenderId: "1082640784369"
    }
  )
}

const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);
Vue.use(firebase)

export default firebase