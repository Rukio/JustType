<template>
<transition name="popup">
    <div v-on-click-outside="hide" class="login-wrap">
        <form @submit.prevent="login" class="login-form">
            <div class="email">
                <input v-model="email"
                    :class="{ 'error-field' : errors.email }"
                    type="text" placeholder="E-mail">
            </div>
            <div class="password">
                <input v-model="password"
                    type="password" placeholder="Password">
            </div>
            <div class="submit">
                <button class="log-in">Log in</button>
            </div>
        </form>
    </div>
</transition>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('auth')

export default {
    mixins: [onClickOutside],

    data() {
        return {
            email: '',
            password: '',
            errors: {
                email: false,
                password: false
            }
        }
    },

    methods: {
        login() {
            if (this.validateForm())
            this.loginUser({
                email: this.email,
                password: this.password
            })
            .then(response => {
                console.log(response)
            },
            error => {
                console.log(error)
            })
        },
        validateForm() {
            if (!this.email && !this.password) {
                this.errors.email = true
                this.errors.password = true
                console.log('Fill up the fields')
            } else if (!this.email) {
                this.errors.email = true
                console.log('Fill up the email field')
            } else if (!this.password) {
                this.errors.password = true
            } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                .test(String(this.email).toLowerCase())) {
                    this.errors.email = true
                    console.log('Invalid email format')
                }
            else if (this.password.length < 6) {
                this.errors.password = true
                console.log('Password must be at least 6 characters long')
            } else {
                this.errors.email = false
                this.errors.password = false
                return true
            }
            return false
        },
        hide() {
            this.$emit('hide')
        },
        ...mapActions([
            'loginUser'
        ])
    }
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

    .login-form {
        border: 2px solid #4883c3;
        border-radius: 5px;
        padding: 10px;
    }

    .email, .password {
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
