<template>
    <section class="admin">
        <form v-if="!isAuthed" @submit.prevent="logIn" class="login-form">
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
        <section v-else class="quote-editor">
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
        <modal-quote v-if="isEditing" :quote="quoteList[editingQuoteN]"
        @close="isEditing = false"/>
    </section>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import { mapState, mapMutations, mapGetters } from 'vuex'
import ModalQuote from '~/components/ModalQuote.vue'

export default {
    data() {
        return {
            email: '',
            password: '',
            quoteList: [],
            editingQuoteN: -1,
            isEditing: false
        }
    },
    methods: {
        logIn() {
            this.$store.dispatch('logIn', { email: this.email, password: this.password })
        },
        logOut() {
            this.$store.dispatch('logOut')
        },
        quoteEdit(quoteN) {
            this.isEditing = true
            this.editingQuoteN = quoteN
        },
        quoteDelete(quoteN) {
            this.$store.dispatch('deleteQuote', {
                id: this.quoteList[quoteN].id
            })
        },
        quoteAdd() {

        },
        async checkAuthHere() {
           await this.$store.dispatch('checkAuth')
                .then(() => {
                    console.log('auth ok')
                })
                .catch((error) => {
                    console.log('auth error')
                })
            if (this.$store.getters.getAuthed) {
                await this.$store.dispatch('refreshQuotes')
                    .then(() => { console.log('refresh ok')})
                    .catch(() => { console.log('refresh error')})
                this.quoteList = this.$store.getters.getQuoteList    
            }
        }
    },
    created() {
        this.checkAuthHere()
    },
    computed: {
        isAuthed() { return this.$store.getters.getAuthed },
        ...mapState([
            'admin/authed',
            'admin/uid'
        ]),
        ...mapGetters([
            'admin/getAuthed',
            'admin/getUID'
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