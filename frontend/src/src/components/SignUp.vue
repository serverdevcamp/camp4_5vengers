<template>
<v-app>
  <v-container fill-height fluid back>
  <v-col justify = "center" align = "center">
  <form @submit.prevent="onSignUp">
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "id" single-line solo background-color = #ffffff placeholder = "아이디"></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row rap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "name" solo background-color = #ffffff placeholder = "이름"></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "email" solo background-color = #ffffff placeholder = "이메일"></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "pwd" solo background-color = #ffffff placeholder = "비밀번호" type = password></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "nick" solo background-color = #ffffff placeholder = "닉네임"></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
        <v-btn type="submit" small>회원가입</v-btn>
      </v-flex>
  </v-row>
  </form>
  </v-col>
  </v-container>
</v-app>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      id: '',
      name: '',
      email: '',
      pwd: '',
      nick: ''
    }
  },
  methods: {
    onSignUp () {
      const object = {
        id: this.id,
        name: this.name,
        email: this.email,
        pwd: this.pwd,
        nick: this.nick
      }
      console.log(object)
      this.$store.dispatch('signUp', object)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.back {
  background-color : #ffeb33;
  height: 100%;
}

</style>
