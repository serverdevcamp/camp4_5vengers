<template>
    <v-layout column wrap fixed>
        <!-- 맨 위에 채팅방 이름이랑 인원수 적혀 있는 곳 -->
        <v-flex md1 class="top-bar" fixed>
            <v-flex row wrap grid-list-md ml-1 p-3>
                    <v-avatar wrap p-2 m-2>
                        <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                    </v-avatar>

                    <!--아이콘 클릭시 친구목록 보여준다-->
                    <v-flex>
                        <v-flex wrap v-model="room_name" class="chat-name" v-bind:value="room_name" text-md-center mx-1 pb-1 md1>{{ room_name }}</v-flex>
                        <v-flex row grid-list-md ml-3 p-0>
                            <!-- <v-flex class="icon-num" text-md-left md1 pb-0> -->
                                <img src="../assets/user.png" class="icon-user"/>
                                <v-flex v-model="count" class="chat-mem-num">{{ count }}</v-flex>
                            <!-- </v-flex> -->
                            <!-- <v-flex class="chat-mem-num" text-md-left pb-0>4</v-flex> -->
                        </v-flex>
                    </v-flex>
                    <v-flex text-md-right>
                        <!--설정 아이콘-->
                        <v-avatar class="icon-settings">
                            <img src="../assets/settings.png" contain @click="settingsClicked=true"/>
                        </v-avatar>
                    </v-flex>
                </v-flex>
        </v-flex>

        <!-- 여기부터 채팅치는 구간-->
        <v-flex md9 class="middle-bar">
            <div class="row messages-body" v-cloak>
                <div class="col-sm-12">
                    <ul class="list-group" v-bind:value="readCount"  v-for="(message, index) in messages" :key="index" track-by="$index">
                        <!--타인-->
                        <li class="message-item" v-bind:value="readCount_idx" v-if="message.user_idx !== userIdx && message.room_idx === roomIdx" >
                            <img v-bind:src="message.front_img" class="rounded-circle float-middle mr-1 message-group"> {{ message.message }}
                            <small class="text-muted">{{ message.nick }} @ {{ formatMessageDate(message.regist_dt) }} {{ readCount[index] }}</small>
                            <!--읽은 메세지 수-->
                            <!--online_dt > offline_dt 이면 지금 접속 중이라는 것 -->
                        </li>
                        <!-- 자신-->
                        <li class="message-item-me" v-bind:value="readCount_idx" v-if="message.user_idx === userIdx && message.room_idx === roomIdx">
                            <!--읽은 메세지 수-->
                            <small class="text-muted">{{ readCount[index] }} {{ "나" }} @ {{ formatMessageDate(message.regist_dt) }}</small>
                            {{ message.message }} <img v-bind:src="message.front_img" class="rounded-circle float-middle mr-2 message-group">
                        </li>
                    </ul>
                </div>
            </div>
        </v-flex>
        <!-- 여기까지 채팅치는 구간 -->

        <v-flex md2 fixed>
            <v-flex class="bottom-bar-first" wrap fixed>
                <v-flex text-md-left p-2 m-0>
                    <img src="../assets/clip.png" class="icon-clip"/>
                </v-flex>
            </v-flex>
            <v-flex class="bottom-bar-second" wrap>
                <form @submit.prevent="send">
                    <v-flex row wrap>
                        <!-- 글자쓰는 곳 -->
                        <v-flex md11 text-md-right class="text-msg">
                            <v-textarea v-model ="message" v-on:keyup.enter="send" placeholder="메세지를 입력해주세요.." background-color = #ffffff auto-grow rounded></v-textarea>
                        </v-flex>
                        <v-flex md1 class="text-msg-button" text-md-right p-2 m-0>
                            <!-- 전송 버튼 -->
                            <v-btn type="submit" large>전송</v-btn>
                        </v-flex>
                    </v-flex>
                </form>
            </v-flex>
        </v-flex>

        <!-- 설정 클릭 -->
        <v-dialog v-model="settingsClicked" max-width="380">
            <v-card class="settingsCard">
                <v-flex wrap column grid-list-md align-center lt-sign>
                    <v-flex class="profileDetailText">채팅방 이름</v-flex>
                    <form  @submit.prevent="settingsMethod">
                        <v-text-field v-model="room_name" class="room_text" solo v-bind:placeholder="room" required></v-text-field>
                        <v-btn medium color="normal" class='btn-login' type="submit">수정</v-btn>
                    </form>
                </v-flex>
            </v-card>
        </v-dialog>
        <!-- 설정 클릭 -->

    </v-layout>
</template>

<script>
import io from 'socket.io-client'
import moment from 'moment'
// import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      settingsClicked: false,
      room_name: this.room,
      mem_count: '',
      message: '',
      messages: [], // 내가 아닌 타인이 보낸 메세지
      //   members: {},
      socket: null,
      redis_idx: '',
      readCount: [],
      readCount_idx: -1,
      check_temp: 0
    }
  },
  methods: {
    send: function () {
      if (this.message !== '\n') {
        var info = ({
          message: this.message,
          userIdx: this.userIdx, // 일단 임시로 userIdx 3인 유저로 test
          room_idx: this.roomIdx,
          mem_count: this.count// 채팅방의 인원수를 가져오기
        })
        this.socket.emit('send', info)
        this.message = ''
      }
    },
    settingsMethod: function () {
      console.log('ggggggggggggggggggggg')
      const object = {
        roomName: this.room_name,
        roomIdx: this.roomIdx
      }
      this.$store.dispatch('settings', object)
    },
    formatMemberDate: function (date) {
      return moment(date).format('h:mm:ss a')
    },
    formatMessageDate: function (date) {
      return moment(date).format('h:mm:ss a')
    },
    socketConnect () {
      // 소켓 연결
      this.socket.on('messages', function (message) {
        this.messages.push(message)
      }.bind(this))

      this.socket.on('message_history', function (messages) {
        console.log(messages)
        var temp = []
        var i = 0
        for (i = 0; i < messages.length; i++) {
          if (messages[i].room_idx === this.roomIdx) { // 같은 방 번호이고
            temp.push(messages[i])
          }
        }
        this.messages = temp
      }.bind(this))

      var temp = []
      this.socket.on('readCount', function (readCount) {
        this.readCount = readCount
        temp = this.readCount
      }.bind(this))

      this.socket.on('readSend', function (readSend) {
        temp.push(readSend)
        this.readCount = temp
      }.bind(this))
    }
  },
  mounted: function () {
    this.socket = io.connect('http://localhost:3002', { transports: ['websocket'] })// 여기에 room_idx를 전달해주기
    // 일단 들어오면, db online_dt update 하기 && 읽은 메세지 수 update하기(만약 이 유저가 이미 읽은 메세지가 있으면 그대로 두고 안 읽은 메세지가 있으면 읽은 메세지 수 감소)
    // 채팅방 이름, 채팅방 인원수 불러오기
    // this.$store.room_idx = this.roomIdx
    this.readCount_idx = -1
    this.$store.dispatch('inRoomDetails')
    // 들어올 때마다 last이후의 메세지들의 reader에 자기 자신 idx추가하고 regist_count-- 하기!
    var info = ({
      userIdx: this.userIdx, // 일단 임시로 userIdx 8인 유저로 test
      roomIdx: this.roomIdx
    })
    // this.$store.dispatch('readCount', info)
    this.socket.emit('read', info)
    const object = {
      roomIdx: this.roomIdx,
      userIdx: this.userIdx
    }
    this.$store.dispatch('changeOnlineIdx', object)
    var roomInfo = ({
      room_idx: this.roomIdx
    })
    this.$store.dispatch('getRoomInfo', roomInfo)
    this.socketConnect()
    this.room_name = this.room
  },

  computed: {
    ...mapGetters({
      room: 'roomName',
      count: 'memCount',
      userIdx: 'idxInfo',
      roomIdx: 'roomIdx'
      //   inRoomDetails: 'inRoomDetails'
      //   readCount: 'readCount'
    })
  }
}
</script>

<style scoped>
.top-bar {
    /* justify-content: center; */
    width: 100%;
    height: 8%;
    background-color: #fafafa;
    align-content: center;
}
.middle-bar {
    /* justify-content: center; */
    width: 100%;
    height: 9%;
    background-color: #bdd2dc;
    align-content: center;
}
.bottom-bar-first {
    /* justify-content: center; */
    width: 100%;
    height: 25%;
    background-color: #fafafa;
    align-content: center;
    border-style: solid;
    border-width: 1px;
    border-color: #e5e8e8;
}
.bottom-bar-second {
    /* justify-content: center; */
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    align-content: center;
}
.layout {
    height: 100vh;
    padding: 0%;
    margin: 0%;
}
.con {
    width: 100%;
    height: 100%;
    padding: 0%;
    margin: 0%;
}
.icon-nav {
    width: 1%;
    margin-left: 0%;
    margin-top: 0%;
}
.chat-name {
    font-size: 1em;
    font-weight : bold;
}
.chat-mem-num {
    font-size: 0.9em;
    color : #767676;
    font-weight : bold;
    margin-left: 1%;
}
.icon-settings {
    width: 20px;
}
.icon-clip {
    width:25px;
}
.icon-user {
    width: 17px;
    height: 17px;

}
.icon-num {
    width: 10px;
}
.text-msg {
    width: 100%;
    height: 15px;
    margin: 0;
    padding: 0;

}
.settingsCard {
    /* justify-items: center; */
    position: relative;
    width: 100%;
    height: 20vh;
    background-color: #fafafa;
}
.profileDetailText {
    padding: 4%;
    height: 25%;
    font-size : 1.3em;
    font-weight: bold;
    color: black;
    text-align: center;
}
.btn-login {
    width: 20%;
    padding: 0%;
}
.room_text {
    padding-top: 5%;
    padding-left: 10%;
    align-content: center;
    width : 90%;
    height: 10vh;
}
.lt-sign {
    height: 100%;
    align-content: center;
    text-align: center;
}
.navbar {
    background-color: #f8981d;
}

.members {
    position: fixed;
    top: 54px;
    bottom: 0;
    left: 0;
    /*z-index: 1000;*/
    z-index: -1;
    /*padding: 20px;*/
    /*overflow-x: hidden;*/
    overflow: auto;
    /* Scrollable contents if viewport is shorter than content. */
    border-right: 1px solid #eee;
}

.members-header {
    background-color: #F5EDCD;
    color: #545456;
    font-size: 1.25rem;
    padding-top: .25rem;
    padding-bottom: .25rem;
}

.message-avatar {
    float: left;
    margin: 0px 15px 15px 0px;
}

.members-group {
    width: 100%;
}

.message-group {
    width: 5vh;
}

.messages-header {
    background-color: #EAF0E8;
    color: #545456;
    font-size: 1.25rem;
    padding-top: .25rem;
    padding-bottom: .25rem;
}

.messages-main {
    height: 90vh;
}

.messages-body-me {
    padding-top: 1rem;
    overflow: auto;
    height: 75vh;
    padding-left: 70%;
}

.messages-body {
    padding-top: 1rem;
    overflow: auto;
    height: 75vh;
}

.messages-footer {
    padding-top: 1rem;
    padding-left: .25rem;
    padding-right: .25rem;
}

.list-group-item {
    border: none;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    width : 100%;
    height: 10vh;
}
.list-group-item:first-child {
    border-top: none;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    width : 100%;
    height: 10%;
}

.message-item {
    /* margin-left:0%; */
    text-align: left;
}

.message-item-me {
    padding-left: 70%;
    text-align: right;
}

ul{
   list-style: none;
}

</style>
