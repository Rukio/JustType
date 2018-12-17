<template>
<transition name="popup">
    <div v-on-click-outside="hide" class="login-wrap">
        <form class="login-form">
            <div class="email">
                <input type="text" placeholder="E-mail">
            </div>
            <div class="password">
                <input type="password" placeholder="Password">
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
export default {
  mixins: [onClickOutside],
  methods: {
      hide() {
          this.$emit('hide')
      }
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
