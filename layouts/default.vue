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
  min-height: 100vh;
}

body, input, a {
  font-family: Cabin, sans-serif;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

</style>

