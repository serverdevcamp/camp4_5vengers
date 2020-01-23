<template>
    <v-container fluid back>
        <v-layout wrap column align-center lt-sign>
            <v-flex>
                <form @submit.prevent="signInMethod">
                    <v-flex>
                        <v-text-field solo placeholder="아이디" v-model="userId" required></v-text-field>
                        <v-text-field solo placeholder="비밀번호" type="password" v-model="userPwd" required></v-text-field>
                        <v-btn small color="normal" class="btn-login" type="submit">로그인</v-btn>
                    </v-flex>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      userId: '',
      userPwd: ''
    }
  },
  methods: {
    signInMethod () {
      const object = {
        id: this.userId,
        pwd: this.userPwd
      }
      this.$store.dispatch('signIn', object) // actions에 있는 메서드 호출
    }
  },
  computed: {}
}
</script>

<style scoped>
.lt-sign {
    margin-top: 20%;
    align-content: center;
}

.back {
    width: 100%;
    height: 100%;
    background-color: #F7E600;
}

.btn-login {
    width: 30%;
    padding: 0;
}

</style>
