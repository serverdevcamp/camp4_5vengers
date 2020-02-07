<template>
    <v-container fluid back>
        <v-layout wrap column align-center lt-sign>
            <v-flex>
                <form @submit.prevent="authMethod">
                    <v-flex>
                        <v-text-field solo placeholder="이메일" v-model="userEmail" required></v-text-field>
                        <v-text-field solo placeholder="인증코드" v-model="userCode" required></v-text-field>
                        <v-btn small color="normal" class="btn-go" type="submit">확인</v-btn>
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
      userEmail: '',
      userCode: ''
    }
  },
  methods: {
    authMethod () {
      const object = {
        email: this.userEmail,
        code: this.userCode
      }
      this.$store.dispatch('auth', object)
    },
    checkAuthResult () {
      if (this.$route.query.result === '336') {
        alert('존재하는 회원이 아닙니다.')
        location.href = '/auth'
      } else if (this.$route.query.result === '333') {
        alert('인증코드가 일치하지 않습니다.')
        location.href = '/auth'
      }
    }
  },
  mounted: function () {
    this.checkAuthResult()
  }
}
</script>

<style scoped>
.lt-sign {
    margin-top: 20%;
    align-content: center;
}

.back {
    width: 100%;
    height: 100vh;
    background-color: #F7E600;
}

.btn-go {
    width: 30%;
    padding: 0;
    margin-left: 35%;
}

</style>
