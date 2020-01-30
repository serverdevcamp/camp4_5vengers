<template>
    <v-container fluid grid-list-md con>
        <v-layout row wrap layout>

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
                            <v-img :src="require('../assets/ming.jpeg')" class="img-user" contain @click="myProfileClicked=true"></v-img>
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
                            <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain @click="friendProfileClicked=true"></v-img>
                        </v-avatar>

                        <v-flex>
                            <v-flex class="text-nick" text-md-left pb-0>홍길동</v-flex>
                            <v-flex class="text-intro" text-md-left pt-0>상태메세지</v-flex>
                        </v-flex>
                    </v-flex>
                </v-flex>
            </v-flex>

            <!-- 내 프로필 상세보기  -->
            <v-dialog v-model="myProfileClicked" max-width="350">
                <v-card class="profileCard">
                    <!-- 배경 사진 -->
                    <img src="../assets/ming.jpeg" class="profileDetailBack"/>
                    <!-- 프로필 사진 -->
                    <img src="../assets/empty-profile.png"  class="profileDetailFront"/>

                    <span class="profileDetailText">홍길동</span>
                    <span class="profileDetailText" style="top:69%">상태메세지</span>

                    <div class="row" style="text-align:center;">
                        <div class="col-6" style="position:absolute; top: 76%; left:15%; width:50px;"><img src="../assets/speech-bubble.png" style="width:50px;"/></div>
                        <div class="col-6" style="position:absolute; top: 76%; left:64%; width:50px"><img src="../assets/profile-edit.png" style="width:50px;"/></div>
                    </div>

                    <div class="row" style="text-align:center;">
                        <div class="col-6" style="position:absolute; top: 85%; left:1%; color: #ffffff;"><span>나와의 채팅</span></div>
                        <div class="col-6" style="position:absolute; top: 85%; left:50%; color: #ffffff;"><span>프로필 관리</span></div>
                    </div>
                </v-card>
            </v-dialog>

            <!-- 친구 프로필 상세보기 -->
            <v-dialog v-model="friendProfileClicked" max-width="350">
                <v-card class="profileCard">
                    <!-- 배경 사진 -->
                    <img src="../assets/ming.jpeg" class="profileDetailBack"/>
                    <!-- 프로필 사진 -->
                    <img src="../assets/empty-profile.png"  class="profileDetailFront"/>

                    <span class="profileDetailText">홍길동</span>
                    <span class="profileDetailText" style="top:69%">상태메세지</span>

                    <img src="../assets/speech-bubble.png" style="position:absolute; top:77%; left:43%; width: 50px;"/>
                    <span style="position:absolute; top:85%; left:39.5%; color: #ffffff;">나와의 채팅</span>
                </v-card>
            </v-dialog>

        </v-layout>
    </v-container>
</template>

<script>

export default {
  data () {
    return {
      myProfileClicked: false,
      friendProfileClicked: false
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
.profileCard {
    /* justify-items: center; */
    position: relative;
}
.profileDetailBack {
    width: 350px;
    height: 80vh;
    object-fit: fill;
}
.profileDetailFront {
    position: absolute;
    width: 100px;
    left: 36%;
    top: 49%;
}
.profileDetailText {
    position: absolute;
    left: 0%;
    top: 65%;
    text-align: center;
    width: 100%;
    color: #ffffff;
}
.profileIconDiv {
    text-align: center;
}
</style>
