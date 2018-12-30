<template>
  <section class="main">
    <div class="header">
      <div v-if="!userAuthed && userAuthChecked" class="auth not-logged">
        <button @click.stop="authPopupToggle('login')"
          class="log-in">Log in</button>
        <button @click.stop="authPopupToggle('register')"
          class="sign-in">Sign in</button>
        <login @hide="authPopup(false, 'login')" v-show="loginWindowPopup"/>
        <register @hide="authPopup(false, 'register')" v-show="registerWindowPopup"/>
      </div>
      <div v-if="userAuthed && userAuthChecked" class="auth logged">
        <div class="user-quick-info">
          <p class="user-name">{{ userName }}</p>
          <p class="user-email">{{ userEmail }}</p>
          <p class="user-record"><!--
          --><span class="record-label">Top speed achieved: </span><!--
          --><span class="record-value">{{ getUserTypeRecord }}</span><!--
      --></p>
        </div>
        <button @click.stop="logoutUser"
          class="logout">Logout</button>
      </div>
    </div>
    <div class="text">
      <div class="speed">
        <span class="current" v-if="!speedResultCPM"><span class="label">CPM: </span><span class="value" :style="{ color: valueColor }">{{ speedCPM }}</span></span>
        <span class="current" v-if="!speedResultWPM"><span class="label">WPM: </span><span class="value" :style="{ color: valueColor }">{{ speedWPM }}</span></span>
        <span class="result" v-if="speedResultCPM"><span class="label">CPM: </span><span class="value" :style="{ color: valueColor }">{{ speedResultCPM }}</span></span>
        <span class="result" v-if="speedResultWPM"><span class="label">WPM: </span><span class="value" :style="{ color: valueColor }">{{ speedResultWPM }}</span></span>
      </div>
      <div class="countdown">
        <transition name="cd-numbers">
          <span v-if="countdown == 4" class="number" key="1">3</span>
          <span v-if="countdown == 3" class="number" key="2">2</span>
          <span v-if="countdown == 2" class="number" key="3">1</span>
        </transition>
        <transition name="cd-go" mode="out-in">
          <span v-if="countdown == 1" class="go">GO!</span>
        </transition>
      </div>
      <div class="middle">
        <div class="text-container">
          <div class="text-wrap">
            <span v-if="textTyped.length"
              v-for="(word, index) in textTyped"
              :key="index"
              :class="{ 'finished' : typeFinished }"
              class="typed">{{ word }}</span>
            <span class="typing"
              :class="{
                'error' : typingError,
                'active' : counterActive }">{{ textTyping }}</span><!--
        --><span v-if="targetWord.length"
              class="target-word">{{ targetWord }}</span><!--
        --><transition name="quoteAppearance" @enter="descShow = true"><!--
          --><span class="rest" v-if="textRest.length">{{ textRest }}</span><!--
        --></transition>
          </div>
          <transition name="quoteAppearance" @enter="fieldShow = true">
            <div class="text-desc" v-if="descShow">
              <p class="relation">{{ quoteCurrent.relation }}</p>
              <p class="source">{{ quoteCurrent.source }}</p>
            </div>
          </transition>
        </div>
        <nav class="action-menu">
          <action-menu @start="startRace" @reset="initText"/>
        </nav>
      </div>
    </div>
    <transition name="quoteAppearance">
      <div class="type-field" v-if="fieldShow">
        <input v-model="fieldTyping"
          ref="typeField"
          @cut="prevent($event)"
          @copy="prevent($event)"
          @paste="prevent($event)"
          @keydown="onType($event)"
          :class="{ 'error-field' : typingError }"
          :disabled="!counterActive"
          type="text" :placeholder="typePlaceholder" autocomplete="off" autofocus>
      </div>
    </transition>
  </section>
</template>

<script>
import ActionMenu from '~/components/ActionMenu.vue'
import Login from '~/components/Login.vue'
import Register from '~/components/Register.vue'
import db from '~/plugins/firebase.js'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions, mapGetters } = createNamespacedHelpers('auth')

export default {
  data() {
    return {
      fieldTyping: '',
      quoteCurrent: {},
      textTyped: [],
      textTyping: '',
      textRest: '',
      typingError: false,
      firstWordTrigger: true,
      targetWord: '',
      targetWordConst: '',
      textLength: 0,
      currWordN: 0,
      typeTimeout: null,
      fieldFocusTimeout: null,
      typeFinished: false,
      countdown: 0,
      countdownInterval: null,
      descShow: false,
      fieldShow: false,
      loginWindowPopup: false,
      registerWindowPopup: false,

      iLastTime: 0, // Type speed variables
      iTime: 0,
      iTotal: 0,
      iKeys: 0,
      speedCPM: 0,
      speedWPM: 0,
      counterActive: false,
      refreshInterval: null,
      speedResultCPM: 0,
      speedResultWPM: 0
    }
  },
  created() {
    this.$store.dispatch('refreshQuotes', null, { root: true })
    .then(() => {
      console.log(this.$store.state.quoteList)
      this.pickRandomQuote()
    })
    .catch(() => {
      console.log('refresh error')
    })
  },
  mounted() {
    this.popupItem = this.$el
    this.checkUserAuth()
      .then(response => {
          console.log(response)
      },
      error => {
          console.log(error)
      })
  },
  methods: {
    pickRandomQuote() {
      let quoteIndex = this.getRandomInt(1, this.$store.state.quoteList.length);
      console.log(this.$store.state.quoteList.length + ' length')
      console.log('Index ' + quoteIndex)
      this.$store.commit('setQuoteCurrent', this.$store.state.quoteList[quoteIndex])
      this.quoteCurrent = this.$store.state.quoteCurrent
      this.textRest = this.quoteCurrent.quote;
      this.loadText();
      console.log(quoteIndex)
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    startCountdown() {
      this.countdown = 4;
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--;
        }
        if (this.countdown == 1) {
          this.startCounter()
        }
      }, 1000)
    },
    onType(event) {
      if (this.counterActive) this.checkInput(event)
    },
    checkSpeed() {
      if (this.counterActive == true && this.iLastTime != 0) {
          this.iKeys++;
      }
    },
    startCounter() {
      this.fieldFocusTimeout = setTimeout(() => {
        this.$refs.typeField.focus()
      }, 10);
      this.counterActive = true
      if (!this.refreshInterval)
      this.refreshInterval = setInterval(() => { // Refresh counter every N seconds
        this.iTime = new Date().getTime();
        if (this.iLastTime != 0) {
          this.iTotal += this.iTime - this.iLastTime
        }
        this.iLastTime = this.iTime
        this.speedCPM = Math.round(this.iKeys / this.iTotal * 60000, 2)
        this.speedWPM = this.speedCPM / 5
        if (!this.speedCPM) this.speedCPM = 0
        if (!this.speedWPM) this.speedWPM = 0
      }, 500)
    },
    destroyCounter() {
      clearInterval(this.countdownInterval)
      this.counterActive = false
      this.iTime = 0
      this.iKeys = 0
      this.iTotal = 0
      this.iLastTime = 0
      this.speedCPM = 0
      this.speedWPM = 0
    },
    checkInput(event) {
      clearTimeout(this.typeTimeout)
      this.typeTimeout = setTimeout(() => {
        
        if (event.key != 'Shift')
        if (this.firstWordTrigger) {
          this.currWordN++
          this.targetWord = this.textRest.split(' ')[0]

          this.targetWordConst = this.textRest.split(' ')[0]
          if (this.currWordN == this.textLength) {
            this.textRest = ''
          } else {
            this.textRest = this.textRest.substr(this.textRest.indexOf(' '))
          }
          this.firstWordTrigger = false
        }
        if (event.key != 'Backspace' && event.key != 'Delete') {
          this.onTypeChar(event)
        } else {
          this.onDeleteChar(event)
        }
        if (this.targetWord == '' && this.textRest == '') {
          this.finishTyping();
        }
      }, 5)
    },
    onDeleteChar(event) {
      if (this.targetWordConst.startsWith(this.fieldTyping)) {
          this.typingError = false
          this.textTyping = this.fieldTyping
          this.targetWord = this.targetWordConst.slice(this.fieldTyping.length)
        } else {
          this.typingError = true
        }
    },
    onTypeChar(event) {
      if (event.key == ' ') {
        if (this.fieldTyping == this.targetWordConst + ' ') { // check the word validity before venturing further
          this.checkSpeed()
          event.preventDefault()
          this.textTyped.push(this.textTyping + ' ')
          this.fieldTyping = ''
          this.textTyping = ''
          this.targetWord = ''
          this.textRest = this.textRest.slice(1);
          this.firstWordTrigger = true
        } else {
          this.typingError = true;
        }
      } else {
        if (this.isKeyValid(event.key)) {
          if (this.targetWordConst.startsWith(this.fieldTyping)) { // check if the target word contains a substring in the input field
          console.log('ok')
            this.checkSpeed()
            this.typingError = false
            this.textTyping = this.fieldTyping
            this.targetWord = this.targetWord.slice(1)
          } else {
            this.typingError = true
            this.textTyping = this.textTyping
          }
        }
      }
    },
    finishTyping() {
      console.log('Typing done!')
      this.speedResultCPM = this.speedCPM;
      this.speedResultWPM = this.speedWPM;
      this.writeSpeedRecord({ value: this.speedResultCPM })
      this.typeFinished = true;
      this.destroyCounter()
      this.textTyped.push(this.textTyping)
      this.fieldTyping = ''
      this.textTyping = ''
    },
    startRace() {
      this.initText()
      this.startCountdown()
    },
    prevent(event) {
      event.preventDefault()
    },
    loadText() {
      this.textLength = this.textRest.split(' ').length
      console.log(this.textLength)
    },
    test(event) {
      console.log(event)
    },
    isKeyValid(string) {
      if (string.length == 1) {
        return true
      }
    },
    initText() {
      this.fieldTyping = ''
      this.textTyping = ''
      this.targetWord = ''
      this.targetWordConst = ''
      this.typingError = false
      this.textTyped = []
      this.speedResultCPM = 0
      this.speedResultWPM = 0
      this.textRest = this.quoteCurrent.quote
      this.firstWordTrigger = true
      this.currWordN = 0
      this.typeFinished = false
      this.countdown = 0;
      clearInterval(this.countdownInterval)
      clearTimeout(this.typeTimeout)
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
      this.loadText()
      this.destroyCounter()
    },
    authPopup(flag, type) {
      if (type == 'login') {
        this.loginWindowPopup = flag
        if (this.loginWindowPopup) this.registerWindowPopup = false
      } else if (type == 'register') {
        this.registerWindowPopup = flag
        if (this.registerWindowPopup) this.loginWindowPopup = false
      }
    },
    authPopupToggle(type) {
      if (type == 'login') {
        this.loginWindowPopup = !this.loginWindowPopup
        if (this.loginWindowPopup) this.registerWindowPopup = false
      } else if (type == 'register') {
        this.registerWindowPopup = !this.registerWindowPopup
        if (this.registerWindowPopup) this.loginWindowPopup = false
      }
    },
    ...mapActions([
      'logoutUser',
      'checkUserAuth',
      'writeSpeedRecord'
    ])
  },
  computed: {
    typePlaceholder() {
      if (this.counterActive)
        return 'Type here...'
        else return 'Press START button'
    },
    valueColor() {
      let red, green, blue
      red = this.speedWPM * 2
      green = 255 - red
      blue = 255 - red
      return 'rgba(' + red + ', ' + green + ', ' + blue +')'
    },
    ...mapState([
      'quoteList',
      'userAuthed',
      'userAuthChecked',
      'userId',
      'userEmail',
      'userName',
      'userTypeRecordCPM',
      'userTypeRecordWPM'
    ]),
    ...mapGetters([
      'getUserTypeRecord'
    ])
  },
  components: {
    ActionMenu,
    Login,
    Register
  }
}
</script>

<style lang="scss" scoped>

.main {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
}

.middle {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 100%;
  justify-content: center;
}

.action-menu {
  margin-left: 80px;
  margin-top: -2px;

  @media screen and (max-width: 920px) {
    width: 100%;
    margin-top: 30px;
  }
}

.header {
  width: 100%;
}

.auth {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;

  button:not(:first-child) {
    margin-left: 10px;
  }
}

.auth.logged {
  p {
    line-height: 20px;
  }
  .logout {
    margin-left: auto;
  }
}

.user-name {
  font-size: 16px;
}

.speed {
  font-size: 50px;
  width: 300px;

  .current .label {
    color: #bbf;
  }

  .result .label {
    color: #fff;
  }

  .current, .result {
    display: block;
  }

  span {
    transition: color .3s;
  }
}

.countdown {
  position: absolute;
  right: 40%;
  top: 0;

  span {
    backface-visibility: hidden;
    transform-origin: 50% 10%;
  }
  .number {
    display: block;
    transform: scale(3, 3)
  }

  .go {
    display: block;
    transform: scale(4, 4);
    opacity: 0;
  }
}

.text {
  position: relative;
  font-size: 25px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  &-wrap {
    width: 700px;
    line-height: 35px;
  }
}

.text-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.text-desc {
  font-family: DancingScript, sans-serif;
  font-size: 12px;
  align-self: flex-end;
  font-size: 22px;
  margin-top: 20px;
}

.type-field {
  max-width: 700px
}

.target-word, .typing {
  text-decoration: underline;
}

.typing {
  color: blue;
  position: relative;

  &.active {
    &::after {
      visibility: visible;
    }
  }

  &::after {
    content: '';
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: #fff;
    opacity: 0;
    animation: caret-simple 1s infinite;
  }
}

.rest {
  opacity: 1;
}

.quoteAppearance-enter-active {
    transition: opacity 1s;
}

.quoteAppearance-leave-active {
    transition: opacity .5s;
}
.quoteAppearance-enter, .quoteAppearance-leave-to {
    opacity: 0;
}

.cd-numbers-enter-active {
  animation: cd-numbers .5s;
}

.cd-go-enter-active {
  animation: cd-go 3s;
}

@keyframes cd-numbers {
  0% {
    transform: scale(1, 1);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  70% {
    transform: scale(5, 5);
  }
  100% {
    transform: scale(3, 3);
  }
}

@keyframes cd-go {
  0% {
    transform: scale(1, 1);
    opacity: 0;
  }
  15% {
    transform: scale(4, 4);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: scale(3, 3);
    opacity: 0;
  }
}

@keyframes caret-simple {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes caret {
  0% {
    top: 0;
    height: 0;
  }
  25% {
    top: 0;
    height: 50%;
  }
  50% {
    top: 50%;
    height: 0;
  }
  75% {
    top: 50%;
    height: 50%;
  }
  100% {
    top: 100%;
    height: 0;
  }
}

.typed {
  color: #e4ac00;

  &.finished {
    color: #ffe03f
  }
}

.type-field {
  margin-top: 39px;
  height: 40px;
}

</style>

