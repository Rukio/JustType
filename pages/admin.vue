<template>
    <section class="admin">
        <form @submit.prevent="login" class="login-form">
            <div class="email">
                <input v-model="email"
                    type="text" placeholder="Email">
            </div>
            <div class="pass">
                <input v-model="password"
                    type="password" placeholder="Password">
            </div>
            <div class="submit">
                <button>Log in</button>
            </div>
        </form>
    </section>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import { mapState, mapMutations } from 'vuex'

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    console.log(user.user.uid)
                    this.$store.commit('setAuthed', true)
                    this.$store.commit('setUID', user.user.uid)
                },
                err => {
                    console.log('GTFO')
                })
        }
    },
    computed: {
        ...mapState([
            'admin/authed',
            'admin/uid'
        ])
    }
}
</script>

<style lang="scss" scoped>

.admin {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form {
    width: 300px;
    max-width: 300px;
    padding: 0 15px;
}

.email, .pass {
    height: 40px;
    width: 100%;
}

.pass, .submit {
    margin-top: 10px;
}

</style>
