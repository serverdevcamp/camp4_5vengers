<template>
<v-app>
  <v-container fill-height fluid back>
  <v-col justify = "center" align = "center">
  <form @submit.prevent="onSignUp">
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "userId" single-line solo placeholder="아이디" required></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row rap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "userName" solo placeholder="이름" required></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "userEmail" solo placeholder="이메일" required></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "userPwd" solo placeholder="비밀번호" type = password required></v-text-field>
      </v-flex>
    </v-layout>
  </v-row>
  <v-row justify = "center" align = "center">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm4 md4 lg3 class="box sample1">
          <v-text-field v-model = "userNick" solo placeholder="닉네임" required></v-text-field>
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
      userId: '',
      userName: '',
      userEmail: '',
      userPwd: '',
      userNick: ''
    }
  },
  methods: {
    onSignUp: function () {
      const object = {
        id: this.userId,
        name: this.userName,
        email: this.userEmail,
        pwd: this.userPwd,
        nick: this.userNick
      }
      this.$store.dispatch('signUp', object)
    },
    checkSignUpResult: function () {
      if (this.$route.query.result === '330') {
        alert('중복된 회원입니다.')
        location.href = '/signUp'
      }
    }
  },
  mounted: function () {
    this.checkSignUpResult()
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
