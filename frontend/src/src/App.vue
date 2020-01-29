<template>
  <div id="app">
    <v-app>
      <nav v-if="['/home','/room'].indexOf($route.path) > -1">

        <v-layout>
          <v-flex column wrap iconsLayout fixed>
            <router-link to="/home">
              <v-img :src="require('./assets/user.png')" class="userIcon"/>
            </router-link>
            <router-link to="/room">
              <v-img :src="require('./assets/speech-bubble.png')" class="roomIcon"/>
            </router-link>
          </v-flex>
        </v-layout>

        <v-layout class="routerLayout" p-0>
          <router-view></router-view>
        </v-layout>
      </nav>

      <nav v-else>
        <router-view></router-view>
      </nav>
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px; */
}
.iconsLayout {
    /* justify-content: center; */
    position: fixed;
    width: 8vw;
    height: 100%;
    background-color: #423630;
    align-content: center;
}
.userIcon, .roomIcon {
    width: 4vw;
    /* height: 100%; */
    /* justify-items: center; */
    margin-left: 1.8vw;
    margin-top: 2vh;
}
.routerLayout {
  width: 100%;
  margin-left: 8.3vw;
}
</style>
