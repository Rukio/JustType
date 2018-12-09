<template>
  <div class="page">
    <nuxt/>
  </div>
</template>

<style lang="scss">

@font-face {
  font-family: Manaspc;
  src: url('~assets/fonts/Manaspc.ttf');
}

body {
  color: #fff;
  font-size: 14px;
  background-image: url('~assets/img/bg.png');
  background-size: cover;
  min-height: 100vh;
}

body, input, a {
  font-family: Manaspc, sans-serif;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

</style>

