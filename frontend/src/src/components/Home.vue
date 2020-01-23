<template>
    <v-container fluid grid-list-md con>
        <v-layout column-wrap layout>
            <!-- nav 바 -->
            <v-flex md1>
                <img src="../assets/user.png" class="icon-user"/>
                <img src="../assets/speech-bubble.png" class="icon-chat"/>
                <img src="../assets/etc.png" class="icon-etc"/>
            </v-flex>

            <!-- 친구 목록  -->
            <v-flex md11>
                <img src="../assets/user.png"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {}
}
</script>

<style scoped>
.con {
    width: 100%;
    height: 100%;
}
.layout {
    height: 100%;
}
.icon-user {
    width: 50px;
}
.icon-chat {
    width: 48px;
    margin-top: 15%;
}
.icon-etc {
    width: 40px;
    margin-top: 10%
}

</style>
