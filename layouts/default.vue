<template>
  <div class="page">
    <nuxt/>
  </div>
</template>

<style lang="scss">

@font-face {
  font-family: Cabin;
  src: url('~assets/fonts/Cabin-Regular.ttf');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: DancingScript;
  src: url('~assets/fonts/DancingScript-Regular.ttf');
  font-weight: 400;
  font-style: normal;
}

body {
  color: #fff;
  font-size: 14px;
  background-image: url('~assets/img/bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}

body, input, button, a {
  font-family: Cabin, sans-serif;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

input, textarea {
  width: 100%;
  height: 100%;
  font-size: 25px;
  padding: 10px 10px 10px 20px;
  border-radius: 100vh;
  background: linear-gradient(to bottom, #97c5da 0%,#4883c3 100%);
  border: none;
  outline: none;

  &::placeholder {
    color: #fff;
  }
}

textarea {
  height: 200px;
  border-radius: 5px;
  resize: none;
}

button {
  border: 2px solid #4883c3;
  background-color: transparent;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
  color: #fff;
  min-height: 40px;
  padding: 0 20px;
  background-color: transparent;
  transition: .3s;

  &:hover {
    background-color: #4883c3;
  }
}

// Transitions

.popup-enter-active {
  transition: all .2s;
}

.popup-leave-active {
  transition: all .2s;
}
.popup-enter, .popup-leave-to {
  transform: scaleY(0);
}

</style>

