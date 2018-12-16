<template>
    <section class="admin">
        <form v-if="!authed && authChecked" @submit.prevent="logIn" class="login-form">
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
        <section v-if="authed && authChecked" class="quote-editor">
            <div class="top-controls">
                <div class="add-quote">
                    <button @click="quoteAdd">Add quote</button>
                </div>
                <div class="logout">
                    <button @click="logOut">Log out</button>
                </div>
            </div>
            <div class="quote-list">
                <div v-if="quote.quote" v-for="(quote, index) in quoteList" :key="index" class="quote">
                    <div class="quote-info">
                        <p class="quote-text">{{ quote.quote }}</p>
                        <p class="relation">{{ quote.relation }}</p>
                        <p class="source">{{ quote.source }}</p>
                    </div>
                    <div class="controls">
                        <div class="edit">
                            <button @click="quoteEdit(index)">Edit quote</button>
                        </div>
                        <div class="delete">
                            <button @click="quoteDelete(index)">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <modal-quote v-if="isEditing"
        :quote="currentQuote"
        :acceptType="editType"
        @close="isEditing = false"/>
    </section>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import ModalQuote from '~/components/ModalQuote.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('admin')

export default {
    data() {
        return {
            email: '',
            password: '',
            quoteList: [],
            editingQuoteN: -1,
            currentQuote: {},
            isEditing: false,
            editType: ''
        }
    },
    methods: {
        logIn() {
            this.$store.dispatch('admin/logIn', { email: this.email, password: this.password })
        },
        logOut() {
            this.$store.dispatch('admin/logOut')
        },
        quoteEdit(quoteN) {
            this.editType = 'edit'
            this.isEditing = true
            this.editingQuoteN = quoteN
            this.currentQuote = this.quoteList[this.editingQuoteN]
        },
        quoteDelete(quoteN) {
            this.$store.dispatch('admin/deleteQuote', {
                id: this.quoteList[quoteN].id
            })
        },
        quoteAdd() {
            this.editType = 'create'
            this.isEditing = true
            this.currentQuote = {}
        },
        checkAuthHere() {
            this.$store.dispatch('admin/checkAuth')
                .then(() => {
                    this.$store.dispatch('refreshQuotes', null, { root: true })
                        .then(() => {
                            this.quoteList = this.$store.getters.getQuoteList
                        })
                        .catch(() => {
                            console.log('refresh error')
                        })
                })
                .catch(() => {
                    console.log('cannot check auth')
                })
        }
    },
    mounted() {
        this.checkAuthHere()
    },
    computed: {
        isAuthed() { return this.$store.getters.getAuthed },
        ...mapState([
            'authed',
            'uid',
            'authChecked'
        ]),
        ...mapMutations([
            'setAuthChecked'
        ]),
        ...mapGetters([
            'getAuthed',
            'getUID'
        ]),
        ...mapActions([
            'checkAuth'
        ])
    },
    components: {
        ModalQuote
    }
}
</script>

<style lang="scss" scoped>

.admin {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10vw;
}

.login-form {
    width: 300px;
    max-width: 300px;
    padding: 0 15px;
}

.logout {
    text-align: right;
    margin-bottom: 10px;
}

.email, .pass {
    height: 40px;
    width: 100%;
}

.pass, .submit {
    margin-top: 10px;
}

.quote-editor {
    margin-top: 50px;
}

.quote:not(:last-child) {
    margin-bottom: 20px
}

.controls {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.delete {
    margin-left: 10px;
}

.quote-info {
    .relation {
        margin-top: 5px;
    }
}

.top-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;

    & > div:not(:first-child) {
        margin-left: 10px;
    }
}
</style>