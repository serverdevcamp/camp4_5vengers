<template>
    <v-container fluid grid-list-md con>
        <v-layout row wrap layout>

            <!-- 친구 목록  -->
            <v-flex md11>
                <!-- 맨 위 친구 수 & 알림icon & 친구추가icon -->
                <v-flex row grid-list-md>
                    <v-flex wrap md1 ml-2>
                        <span>친구</span>
                        <span>{{ friendList.length }}</span>
                    </v-flex>
                    <v-flex text-md-right>
                        <img src="../assets/bell.png" class="icon-alarm" @click="requestDialogClick()"/>
                        <img src="../assets/user.png" class="icon-friend" @click="sendDialogClick()"/>
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
                            <v-img :src="(userProfileFront)" class="img-user" contain @click="myProfileClicked=true"></v-img>
                        </v-avatar>

                        <v-flex>
                            <v-flex class="text-nick" text-md-left pb-0>{{ userNick }}</v-flex>
                            <v-flex class="text-intro" text-md-left pt-0>{{ userIntro }}</v-flex>
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
                    <v-flex v-for="(friend, index) in friendList" :key="index" row wrap grid-list-md ml-1 p-0>
                        <v-avatar wrap p-0 m-0>
                            <v-img :src="(friend.profile_front)" class="img-user" contain @click="friendProfileClicked=true"></v-img>
                        </v-avatar>

                        <v-flex>
                            <v-flex class="text-nick" text-md-left pb-0>{{ friend.user_nick }}</v-flex>
                            <v-flex class="text-intro" text-md-left pt-0>{{ friend.profile_message }}</v-flex>
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

             <!-- 요청 알림 다이얼로그 보기 -->
             <v-dialog v-model="requestDialogClicked" max-width="400">
                     <v-tabs requestDialogTab color="transparent" slider-color="black">
                        <v-tab v-on:click="sendRequestClick" style="color:#000000; width: 50%;">보낸 요청</v-tab>
                        <v-tab v-on:click="receiveRequestClick" style="color:#000000; width: 50%;">받은 요청</v-tab>
                    </v-tabs>

                    <!-- 보낸 요청 탭이 눌렸을 때 -->
                    <v-card class="profileCard" v-if="sendRequestClicked===1">
                        <v-flex v-if="this.sendRequestList.length>0">
                            <v-flex v-for="(request, index) in this.sendRequestList" :key="index" row style="margin-left: 2%;" md12>
                                <v-avatar contain p-0 m-0 wrap md2>
                                    <v-img :src="(request.receiver_profile)" class="img-user" contain></v-img>
                                </v-avatar>
                                <v-flex md9 wrap p-0 style="margin-left: 2%; margin-top: 3%;">{{ request.receiver_name }}님께 친구를 요청하였습니다.</v-flex>
                            </v-flex>
                        </v-flex>

                        <v-flex  v-else style="text-align: center;">
                            아직 보낸 요청이 없습니다.
                        </v-flex>
                    </v-card>

                    <!-- 받은 요청 탭이 눌렸을 때 -->
                    <v-card class="profileCard" v-if="receiveRequestClicked===1">
                        <v-flex v-if="this.receiveRequestList.length>0">
                            <v-flex v-for="(request, index) in this.receiveRequestList" :key="index" row style="margin-left: 2%;" md12>
                                <v-avatar contain p-0 m-0 wrap md2>
                                    <v-img :src="(request.sender_profile)" class="img-user" contain></v-img>
                                </v-avatar>
                                <v-flex md7 wrap p-0 style="margin-left: 2%; margin-top: 3%;">{{ request.sender_name }}님이 친구를 요청하였습니다.</v-flex>
                                <v-btn @click="clickRequestAccept(index)" md1 style="margin-top: 1.5%; margin-left: 2%;" outlined>수락</v-btn>
                            </v-flex>
                        </v-flex>

                        <v-flex  v-else style="text-align: center;">
                            아직 받은 요청이 없습니다.
                        </v-flex>
                    </v-card>
            </v-dialog>

             <!-- 친구 추가 다이얼로그 보기 -->
             <v-dialog v-model="sendDialogClicked" max-width="400">
                     <v-tabs sendDialogTab color="transparent" slider-color="black">
                        <v-tab v-on:click="emailSearchClick" style="color:#000000; width: 50%;">이메일로 친구 추가</v-tab>
                        <v-tab v-on:click="idSearchClick" style="color:#000000; width: 50%;">ID로 친구 추가</v-tab>
                    </v-tabs>

                    <!-- 이메일로 검색 탭이 눌렸을 때 -->
                    <v-flex style="background-color: #ffffff;" class="profileCard" v-if="emailSearchClicked===1">
                        <form @submit.prevent="emailSearch">
                            <v-flex row wrap style="margin-left: 0.1%;">
                                <!-- <input type="text" placeholder="이메일로 검색"> -->
                                <v-text-field v-model="emailInput" placeholder="이메일로 검색" single-line clearable dense hide-details="auto" color="black"></v-text-field>
                            </v-flex>
                        </form>

                        <!-- <v-flex v-if="emailInput===''" style="text-align: center; width: 100%; padding: 5%;">이메일로 친구를 추가할 수 있습니다.</v-flex> -->
                        <!-- <v-flex v-else> -->
                            <v-flex v-if="this.searchResultList.length>0">
                                <v-flex v-for="(result, index) in this.searchResultList" :key="index" row style="margin-top:2%; margin-left: 2%;" md12>
                                    <v-avatar contain p-0 m-0 wrap md2>
                                        <v-img :src="(result.profile_front)" class="img-user" contain></v-img>
                                    </v-avatar>
                                    <v-flex md9 wrap p-0 style="margin-left: 2%; margin-top: 3%;">{{ result.user_nick }}</v-flex>

                                    <v-flex v-if="result.status == 1">
                                        <v-btn md1 style="margin-bottom: 1.5%; margin-top: 1.5%; margin-left: 32.5%;" outlined disabled>이미 친구입니다.</v-btn>
                                    </v-flex>
                                    <v-flex v-else-if="result.status == 2">
                                        <v-btn md1 style="margin-bottom: 1.5%; margin-top: 1.5%; margin-left: 36%;" outlined>친구 요청</v-btn>
                                    </v-flex>
                                    <v-flex v-else>
                                        <v-btn md1 style="margin-bottom: 1.5%; margin-top: 1.5%; margin-left: 42%;" disabled outlined>나</v-btn>
                                    </v-flex>

                                </v-flex>
                            </v-flex>

                            <v-flex v-else style="text-align: center; width: 100%; padding: 5%;">검색 결과가 없습니다.</v-flex>

                        <!-- </v-flex> -->

                    </v-flex>

                    <!-- ID로 검색 탭이 눌렸을 때 -->
                    <v-flex style="background-color: #ffffff;" class="profileCard" v-if="idSearchClicked===1">
                        <form @submit.prevent="idSearch">
                            <v-flex row wrap style="margin-left: 0.1%;">
                                <!-- <input type="text" placeholder="이메일로 검색"> -->
                                <v-text-field v-model="idInput" placeholder="ID로 검색" single-line clearable dense hide-details="auto" color="black"></v-text-field>
                            </v-flex>
                        </form>

                        <!-- <v-flex v-if="emailInput===''" style="text-align: center; width: 100%; padding: 5%;">이메일로 친구를 추가할 수 있습니다.</v-flex> -->
                        <!-- <v-flex v-else> -->
                            <v-flex v-if="this.searchResultList.length>0">
                                <v-flex v-for="(result, index) in this.searchResultList" :key="index" row style="margin-left: 2%;" md12>
                                    <v-avatar contain p-0 m-0 wrap md2>
                                        <v-img :src="(result.profile_front)" class="img-user" contain></v-img>
                                    </v-avatar>
                                    <v-flex md9 wrap p-0 style="margin-left: 2%; margin-top: 3%;">{{ result.user_nick }}</v-flex>

                                    <v-flex v-if="result.status == 1">
                                        <v-btn md1 style="margin-bottom: 1.5%; margin-top: 1.5%; margin-left: 32.5%;" outlined disabled>이미 친구입니다.</v-btn>
                                    </v-flex>
                                    <v-flex v-else-if="result.status == 2">
                                        <v-btn md1 style="margin-bottom: 1.5%; margin-top: 1.5%; margin-left: 36%;" outlined>친구 요청</v-btn>
                                    </v-flex>
                                    <v-flex v-else>
                                        <v-btn md1 style="margin-bottom: 1.5%; margin-top: 1.5%; margin-left: 42%;" disabled outlined>나</v-btn>
                                    </v-flex>

                                </v-flex>
                            </v-flex>

                            <v-flex v-else style="text-align: center; width: 100%; padding: 5%;">검색 결과가 없습니다.</v-flex>

                        <!-- </v-flex> -->

                    </v-flex>
            </v-dialog>

        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
// import VueCookies from 'vue-cookies'

export default {
  data () {
    return {
      myProfileClicked: false,
      friendProfileClicked: false,
      editProfileClicked: false,
      requestDialogClicked: false,
      sendRequestClicked: 1,
      receiveRequestClicked: 0,
      sendDialogClicked: false,
      emailSearchClicked: 1,
      idSearchClicked: 0,
      acceptClicked: [],
      emailInput: '',
      idInput: ''
    }
  },
  methods: {
    emailSearchClick () {
      this.$store.dispatch('resetSearchResult')
      this.idInput = ''

      this.emailSearchClicked = 1
      this.idSearchClicked = 0
    },
    idSearchClick () {
      this.$store.dispatch('resetSearchResult')
      this.emailInput = ''

      this.emailSearchClicked = 0
      this.idSearchClicked = 1
    },
    sendRequestClick () {
      this.sendRequestClicked = 1
      this.receiveRequestClicked = 0
    },
    receiveRequestClick () {
      this.sendRequestClicked = 0
      this.receiveRequestClicked = 1
    },
    clickRequestAccept (index) {
      const object = {
        accessToken: this.userToken,
        from: this.receiveRequestList[index].sender
      }
      this.$store.dispatch('acceptRequest', object)
    },
    requestDialogClick () {
      this.requestDialogClicked = true
      this.$store.dispatch('getReceiveRequestList', { accessToken: this.userToken })
      this.$store.dispatch('getSendRequestList', { accessToken: this.userToken })
    },
    sendDialogClick () {
      this.sendDialogClicked = true
    },
    emailSearch () {
      const object = {
        accessToken: this.userToken,
        input: this.emailInput
      }
      this.$store.dispatch('getEmailSearchResult', object)
    },
    idSearch () {
      const object = {
        accessToken: this.userToken,
        input: this.idInput
      }
      this.$store.dispatch('getIdSearchResult', object)
    }
  },
  computed: {
    ...mapGetters({
      userNick: 'nickInfo',
      userIntro: 'introInfo',
      userToken: 'tokenInfo',
      sendRequestList: 'sendRequestList',
      receiveRequestList: 'receiveRequestList',
      userProfileFront: 'profileFrontInfo',
      userProfileBack: 'profileBackInfo',
      friendList: 'homeList',
      searchResultList: 'searchResultList'
    })
  },
  created: function () {
    const object = {
      accessToken: this.userToken
    }
    this.$store.dispatch('getSendRequestList', object)
    this.$store.dispatch('getReceiveRequestList', object)
    this.$store.dispatch('getHomeList', object)

    this.$store.dispatch('resetSearchResult')
  }
}
</script>

<style scoped>
input[type=text] {
  width: 100%;
  height: 40px;
  margin-left: 5%;
  margin-top: 1%;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
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
.requestDialogTab {
    text-align: center;
}
.sendDialogTab {
    text-align: center;
}
</style>
