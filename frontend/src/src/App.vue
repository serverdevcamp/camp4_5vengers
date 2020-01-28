<template>
  <div id="app">
    <v-app>
    <!-- <img src="./assets/logo.png"> -->
      <router-view/>
    </v-app>
  </div>

</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px; */
}
</style>
