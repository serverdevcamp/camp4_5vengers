<template>
    <v-container fluid grid-list-md con>
        <v-layout row wrap grid-list-md layout>
            <!-- nav 바 -->
            <v-flex md1 class="bar-nav" fixed>
                <v-img :src="require('../assets/user.png')" class="icon-nav"></v-img>
                <v-img :src="require('../assets/speech-bubble.png')" class="icon-nav"></v-img>
                <v-img :src="require('../assets/etc.png')" class="icon-nav"></v-img>
            </v-flex>

            <!-- 친구 목록  -->
            <v-flex md11>
                <!-- 맨 위 친구 수 & 알림icon & 친구추가icon -->
                <v-flex row grid-list-md>
                    <v-flex wrap md1 ml-2>
                        <span>친구</span>
                        <span>512</span>
                    </v-flex>
                    <v-flex text-md-right>
                        <img src="../assets/bell.png" class="icon-alarm"/>
                        <img src="../assets/user.png" class="icon-friend"/>
                    </v-flex>
                </v-flex>
                <!-- 친구 검색 -->
                <v-flex p-0>
                    <v-text-field placeholder="이름으로 검색" filled rounded dense hide-details="auto"></v-text-field>
                </v-flex>
                <!-- 내 프로필 -->
                <v-flex column grid-list-md>
                    <v-flex wrap text-md-left>
                        <span>내 프로필</span>
                    </v-flex>
                    <v-flex row wrap grid-list-md ml-1 p-0>
                        <v-avatar wrap p-0 m-0>
                            <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                        </v-avatar>

                        <v-flex>
                            <v-flex class="text-nick" text-md-left pb-0>홍길동</v-flex>
                            <v-flex class="text-intro" text-md-left pt-0>상태메세지</v-flex>
                        </v-flex>
                    </v-flex>
                </v-flex>
                <!-- border -->
                <v-divider class="divider"></v-divider>
                <!-- 친구 목록 -->
                 <v-flex column grid-list-md>
                    <v-flex wrap text-md-left>
                        <span>친구</span>
                    </v-flex>
                    <v-flex row wrap grid-list-md ml-1 p-0>
                        <v-avatar wrap p-0 m-0>
                            <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                        </v-avatar>

                        <v-flex>
                            <v-flex class="text-nick" text-md-left pb-0>홍길동</v-flex>
                            <v-flex class="text-intro" text-md-left pt-0>상태메세지</v-flex>
                        </v-flex>
                    </v-flex>
                </v-flex>
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
    padding: 0%;
    margin: 0%;
}
.layout {
    height: 100vh;
    padding: 0%;
    margin: 0%;
}
.bar-nav {
    /* justify-content: center; */
    width: 100%;
    height: 100%;
    background-color: #423630;
    align-content: center;
}
.icon-nav {
    width: 50%;
    margin-left: 25%;
    margin-top: 20%;
}

.icon-alarm, .icon-friend {
    width: 30px;
}

.text-nick {
    font-size: 0.9em;
}

.text-intro {
    font-size: 0.7em;
}
.divider {
    margin: 0%;
}
</style>
