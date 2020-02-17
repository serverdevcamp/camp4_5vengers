<template>
    <v-container fluid grid-list-md con>
        <v-layout row wrap grid-list-md layout>

            <!-- 채팅 목록  -->
            <v-flex md11>
                <!-- 채팅방 추가 icon -->
                <v-flex row grid-list-md @click="getFriendList()">
                    <v-flex class = "chat" wrap md1 ml-4>
                        <span>채팅</span>
                    </v-flex>
                    <v-flex text-md-right>
                        <img src="../assets/speech-bubble.png" class="icon-friend"/>
                    </v-flex>
                </v-flex>
                <!-- 채팅방 검색 -->
                <v-flex p-0>
                    <v-text-field placeholder="이름으로 검색" filled rounded dense hide-details="auto"></v-text-field>
                </v-flex>
                <!-- 채팅방 목록 -->
                <router-link to="/roomDetails">
                    <v-flex v-for="(room, index) in this.roomList" :key="index" column grid-list-md v-on:click="goDetails(index)">
                        <!-- 2번 v-flex해서 공간 만들어주기 -->
                        <!-- <v-flex wrap text-md-left>
                        </v-flex> -->
                        <!-- <v-flex wrap text-md-left>
                        </v-flex> -->
                        <v-flex row wrap grid-list-md ml-1 p-0 m-0>
                             <v-avatar  v-if="room.mem_profile.length > 2" contain p-0 m-0 wrap> <!-- 멤버 수 3명이상일 때 -->
                                    <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                            </v-avatar>
                             <v-avatar v-else contain p-0 m-0 wrap> <!-- 멤버 수 2명일 때 -->
                                    <v-img :src="(room.mem_profile[index])" class="img-user" contain></v-img>
                            </v-avatar>

                            <v-flex>
                                <v-flex row grid-list-md ml-1 p-0>
                                    <v-flex wrap class="text-nick" text-md-left p-0>{{ room.room_name }}</v-flex>
                                    <v-flex wrap class="text-mem-num" text-md-left p-0>{{ room.mem_count }}</v-flex>
                                </v-flex>
                                <v-flex class="text-chat" text-md-left pt-0>{{ room.recent_msg }}</v-flex>
                            </v-flex>
                            <v-flex>
                                <v-flex class="text-time" text-md-right pb-0>{{ room.recent_msg_time }}</v-flex>
                                <v-flex v-if="room.not_read_messages !== 0" class="text-chat-num" text-md-right pt-0>{{ room.not_read_messages }}</v-flex>
                            </v-flex>
                        </v-flex>
                    </v-flex>
                </router-link>

            </v-flex>

            <!-- 채팅방 만들기  -->
            <v-dialog v-model="createRoomClicked" width="400">
                <v-card class="createRoomCard" row>
                    <div style="text-align:center; "> 아래 친구목록에서 대화 상대를 선택해주세요 </div>
                    <hr style="margin: 0%">
                    <div style="color: gray; margin-left: 4%">
                        <img src="../assets/search.png" style="width: 5%"/>
                        이름으로 검색
                    </div>
                    <hr style="margin: 0%">
                    <form @submit.prevent="createRoom">

                        <v-flex v-for="(friend, index) in friends" :key="index" row style="margin-left: 2%; margin-top: 2%" md12>
                            <v-avatar contain p-0 m-0 wrap md2>
                                <v-img :src="(friend.user_profile)" class="img-user" contain></v-img>
                            </v-avatar>
                            <v-flex md9 wrap class="room-user-nick" text-md-left p-0>{{ friend.user_nick }}</v-flex>
                            <input md1 type="checkbox" style="margin-top: 3%" :key="index" v-bind:value="friend.user_idx" v-model="checkedIdx">

                        </v-flex>

                        <v-btn medium color="normal" class='btn-cancel' @click="createRoomClicked=false">취소</v-btn>
                        <v-btn medium color="normal" class='btn-create' type="submit">초대하기</v-btn>

                    </form>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      preUrl: '',
      createRoomClicked: false,
      checkedIdx: [],
      rooms: []
    }
  },
  methods: {
    goDetails (index) {
      const object = {
        roomIdx: this.roomList[index].room_idx,
        userIdx: this.userIdx
      }
      this.$store.dispatch('goRoomDetails', object)
      this.$router.push('/roomDetails')
    },
    getFriendList () {
      this.createRoomClicked = true
      const object = {
        accessToken: this.userToken
      }
      this.$store.dispatch('getFriendList', object)
      console.log('DATA:: ', this.friends)
    //   this.createRoomClicked = false
    },
    getRoomList () {
      const object = {
        accessToken: this.userToken
      }
      this.$store.dispatch('getRoomList', object)
    //   this.rooms = this.$store.$state.roomList
    },
    createRoom () {
      if (this.checkedIdx.length === 0) alert('친구를 한명 이상 추가해주세요.')
      else {
        let tempObject = {}
        tempObject.members = this.checkedIdx
        console.log('object:: ', tempObject)
        let tempCheckedIdx = JSON.stringify(tempObject)
        const object = {
          accessToken: this.userToken,
          members: tempCheckedIdx
        }
        this.$store.dispatch('createRoom', object)
        this.createRoomClicked = false
        this.$store.dispatch('getRoomList', object)
        location.reload('/')

        // this.getRoomList()
      }
    }
  },
  computed: {
    ...mapGetters({
      userToken: 'tokenInfo',
      roomList: 'roomList',
      userIdx: 'idxInfo',
      inRoomDetails: 'inRoomDetails',
      friends: 'friendList'
    })
  },
  created: function () {
    this.getRoomList()
  },
  mounted: function () {
    console.log('inRoomDetails : ', this.inRoomDetails)
    const object = {
      roomIdx: this.roomIdx,
      userIdx: this.userIdx,
      inRoomDetails: this.inRoomDetails // mapGetters에서 가져오기
    }
    this.$store.dispatch('changeRoomIdx', object)
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
    font-weight : bold;
    color : black;
}
.text-chat {
    font-size: 0.7em;
    color : #767676;
    font-weight : bold;
}
.text-mem-num {
    font-size: 0.9em;
    color : #9f9f9f;
    font-weight : bold;
}
.text-time {
    font-size: 0.8em;
    color : #9f9f9f;
    font-weight : bold;
}
.text-chat-num {
    font-size: 0.9em;
    color : #c22e1d;
    font-weight : bold;
}
.divider {
    margin: 0%;
}
.chat {
    font-size: 1em;
    font-weight : bold;
}
.createRoomCard {
    position: relative;
}
.room-user-nick {
    margin-left: 3%;
    margin-top: 3%;
    margin-bottom: 3%;
}
.btn-create {
    width: 20%;
    margin-right: 30%;
}
.btn-cancel {
    width: 10%;
    margin-left: 30%;
}
</style>
