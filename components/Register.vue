<template>
<transition name="popup">
    <div v-on-click-outside="hide" class="login-wrap">
        <form @submit.prevent="register" class="register-form">
            <div class="email">
                <input v-model="email"
                    type="text" placeholder="E-mail">
            </div>
            <div class="name-showed">
                <input v-model="nameDisplayed"
                    type="text" placeholder="Name displayed">
            </div>
            <div class="password">
                <input v-model="password"
                    type="password" placeholder="Password">
            </div>
            <div class="password-repeat">
                <input v-model="passwordRepeat"
                    type="password" placeholder="Repeat password">
            </div>
            <div class="submit">
                <button class="log-in">Register</button>
            </div>
        </form>
    </div>
</transition>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('auth')

export default {
    mixins: [onClickOutside],
    data() {
        return {
            email: '',
            nameDisplayed: '',
            password: '',
            passwordRepeat: ''
        }
    },
    methods: {
        register() {
            this.registerUser({
                email: this.email,
                password: this.password,
                nameDisplayed: this.nameDisplayed
            })
            .then(response => {
                console.log(response)
            },
            error => {
                console.log('Registration error ' + error)
            })
        },
        hide() {
            this.$emit('hide')
        },
        ...mapActions([
            'registerUser',
        ]),
    },
    computed: {
        
    },
}
</script>

<style lang="scss" scoped>
    .login-wrap {
        position: absolute;
        width: 179px;
        top: calc(100% + 10px);
        left: 0;
        z-index: 1;
        transform-origin: 50% 0;
    }

    .register-form {
        border: 2px solid #4883c3;
        border-radius: 5px;
        padding: 10px;
    }

    .email,
    .name-showed,
    .password,
    .password-repeat {
        height: 20px;

        &:not(:first-child) {
            margin-top: 10px;
        }

        input {
            font-size: 12px;
            padding: 0 0 0 15px;
        }
    }

    .submit {
        margin-top: 10px;
        button {
            min-height: 20px;
        }
    }
</style>
