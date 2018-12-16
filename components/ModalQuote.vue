<template>
    <div @click.self="$emit('close')" class="modal-backplate">
        <form class="modal-quote">
            <div class="fields">
                <div class="source">
                    <input v-model="quoteTemp.source"
                        placeholder="Source" type="text">
                </div>
                <div class="relation">
                    <input v-model="quoteTemp.relation"
                        placeholder="Relation" type="text">
                </div>
                <div class="quote">
                    <textarea v-model="quoteTemp.quote"
                        placeholder="Quote" type="text"/>
                </div>
            </div>
            <div class="buttons">
                <button @click.prevent="accept(acceptType)" class="accept">Accept</button>
                <button @click.prevent="cancel" class="cancel">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
    data() {
        return {
            quoteTemp: {},
            quoteTempOld: {}
        }
    },
    props: {
        quote: {
            type: Object,
            required: true
        },
        acceptType: {
            type: String,
            required: true
        }
    },
    methods: {
        accept(acceptType) {
            if (acceptType == 'edit') {
                this.$store.dispatch('admin/editQuote', {
                    id: this.quoteTemp.id,
                    source: this.quoteTemp.source,
                    relation: this.quoteTemp.relation,
                    quote: this.quoteTemp.quote
                })
            } else if (acceptType == 'create') {
                this.$store.dispatch('admin/addQuote', {
                    source: this.quoteTemp.source,
                    relation: this.quoteTemp.relation,
                    quote: this.quoteTemp.quote
                })
            }
            this.$emit('close')
        },
        cancel() {
            this.quoteTemp = this.quoteTempOld
            this.$emit('close')
        }
    },
    created() {
        this.quoteTemp = this.quote
        this.quoteTempOld = this.quote
    },
    computed: {
        ...mapState([
            'admin/authed',
            'admin/uid'
        ]),
        ...mapGetters([
            'admin/getAuthed',
            'admin/getUID'
        ])
    },
}
</script>

<style lang="scss" scoped>

    .modal-backplate {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
    }

    .modal-quote {
        width: 500px;
        background-color: rgba(0, 0, 0, .5);
        border: 2px solid #4883c3;
        border-radius: 5px;
        padding: 20px;
    }

    .fields > div {

        &:not(:last-child) {
            margin-bottom: 10px;
        }

        & > input, textarea {
            width: 100%;
        }
    }

    textarea, input {
        font-size: 18px;
    }

    .buttons {
        margin-top: 6px;
    }

</style>
