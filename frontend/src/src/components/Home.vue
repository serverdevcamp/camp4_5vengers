<template>
    <v-container fluid grid-list-md con>
        <v-layout row wrap layout>

            <!-- 친구 목록  -->
            <v-flex md11>
                <!-- 맨 위 친구 수 & 알림icon & 친구추가icon -->
                <v-flex row grid-list-md>
                    <v-flex wrap md1 ml-2>
                        <span>친구</span>
                        <span>1</span>
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
                    <span class="profileDetailText" style="top:70%">상태메세지</span>

                    <div class="row" style="text-align:center;">
                        <div class="col-6" style="position: absolute; top: 76%; left: 15%; width: 50px;"><img src="../assets/speech-bubble.png" style="width: 50px;"/></div>
                        <div class="col-6" style="position: absolute; top: 76%; left: 64%; width: 50px; cursor: pointer;" @click="editProfileClicked=true; myProfileClicked=false;"><img src="../assets/profile-edit.png" style="width:50px;"/></div>
                    </div>

                    <div class="row" style="text-align:center;">
                        <div class="col-6" style="position: absolute; top: 85%; left:1%; color: #ffffff;"><span>나와의 채팅</span></div>
                        <div class="col-6" style="position: absolute; top: 85%; left:50%; color: #ffffff; cursor: pointer;" @click="editProfileClicked=true; myProfileClicked=false;"><span>프로필 관리</span></div>
                    </div>
                </v-card>
            </v-dialog>

            <!-- 내 프로필 수정  -->
            <v-dialog v-model="editProfileClicked" max-width="350">
                <v-card class="profileCard">
                    <span style="position: absolute; left: 5%; top: 3%; color: #ffffff; cursor: pointer;" @click="editProfileClicked=false; myProfileClicked=true;">취소</span>
                    <span style="position: absolute; right: 5%; top: 3%; color: #ffffff; cursor: pointer;" @click="editProfileClicked=false; myProfileClicked=true;">완료</span>

                    <!-- 배경 사진 -->
                    <img src="../assets/ming2.jpeg" class="profileDetailBack"/>
                    <img src="../assets/camera.png" style="width: 10%; cursor: pointer; position: absolute; left: 44.5%; top: 20%;"/>

                    <!-- 프로필 사진 -->
                    <img src="../assets/empty-profile.png"  class="profileDetailFront"/>
                    <img src="../assets/camera.png" style="width: 10%; cursor: pointer; position: absolute; left: 55%; top: 59%;"/>

                    <!-- 닉네임 & 상태메세지 수정 -->
                    <v-text-field class="editNickTF" dense v-bind:value="userNick" counter="20"></v-text-field>
                    <img src="../assets/profile-edit.png" style="position: absolute; top: 67.5%; left: 85%; width: 5%;"/>
                    <v-text-field class="editIntroTF" dense v-bind:value="userIntro" counter="20"></v-text-field>
                    <img src="../assets/profile-edit.png" style="position: absolute; top: 74.5%; left: 85%; width: 5%;"/>

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
                    <span class="profileDetailText" style="top:70%">상태메세지</span>

                    <img src="../assets/speech-bubble.png" style="position:absolute; top:77%; left:43%; width: 50px;"/>
                    <span style="position:absolute; top:85%; left:42%; color: #ffffff;">1:1 채팅</span>
                </v-card>
            </v-dialog>

        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import VueCookies from 'vue-cookies'

export default {
  data () {
    return {
      myProfileClicked: false,
      friendProfileClicked: false,
      editProfileClicked: false
    }
  },
  methods: {
    checkTokenCookie () {
      if (VueCookies.get('accessToken') != null) {
        const object = {
          accessToken: VueCookies.get('accessToken')
        }
        this.$store.dispatch('home', object)
      } else {
        location.href = '/signIn?result=SESSION_ERR'
      }
    }
  },
  computed: {
    ...mapGetters({
      userNick: 'nickInfo',
      userIntro: 'introInfo'
    })
  },
  created: function () {
    this.checkTokenCookie()
  }
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
    top: 66%;
    text-align: center;
    width: 100%;
    color: #ffffff;
}
.editNickTF >>> input, .editIntroTF >>> input {
 text-align: center;
}
.editNickTF {
  position: absolute;
  left: 10%;
  top: 66%;
  width: 80%;
}
.editIntroTF {
  position: absolute;
  left: 10%;
  top: 73%;
  width: 80%;
}
</style>
