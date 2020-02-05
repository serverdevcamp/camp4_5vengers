<template>
    <v-layout column wrap>
        <!-- 맨 위에 채팅방 이름이랑 인원수 적혀 있는 곳 -->
        <v-flex md1 class="top-bar" fixed>
            <v-flex row wrap grid-list-md ml-1 p-3>
                    <v-avatar wrap p-2 m-2>
                        <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                    </v-avatar>

                    <v-flex>
                        <v-flex wrap v-model="room_name" class="chat-name" v-bind:value="room_name" text-md-center mx-1 pb-1 md1>패밀리</v-flex>
                        <v-flex row grid-list-md ml-3 p-0>
                            <!-- <v-flex class="icon-num" text-md-left md1 pb-0> -->
                                <img src="../assets/user.png" class="icon-user"/>
                                <div class="chat-mem-num">4</div>
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

        <!-- 여기부터 채팅치는 구간 -->
        <v-flex md9 class="middle-bar" fixed>
            <div class="row messages-body">
                <div class="col-sm-12">
                    <ul class="list-group message-group">
                        <li v-for="(message, index) in messages" :key="index" track-by="$index">
                            <img v-bind:src="message.front_img" class="rounded-circle float-left mr-2"> {{ message.message }}
                            <!-- <hr> -->
                            <small class="text-muted">{{ message.username }} @ {{ formatMessageDate(message.date) }}</small>
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
        <form @submit.prevent="settingsMethod">
            <v-dialog @close.prevent="settingsMethod" v-model="settingsClicked" max-width="380">
                <v-card class="settingsCard">
                    <v-flex wrap column grid-list-md align-center lt-sign>
                        <div class="profileDetailText">채팅방 이름</div>
                        <v-text-field class="room_text" solo v-bind:placeholder="room_name" v-model="room_name" required></v-text-field>
                        <v-btn medium color="normal" class='btn-login' type="submit">수정</v-btn>
                    </v-flex>
                </v-card>
            </v-dialog>
        </form>
        <!-- 설정 클릭 -->

    </v-layout>
</template>


<script>
import io from 'socket.io-client'; 
import moment from 'moment'
var socket;

export default {
  data () {
    return {
        settingsClicked: false,
        room_name: '패밀리',
        message: '',
        messages: [],
        members: {},

    }
  },
  methods: {
    socketCreate() {
      socket = io.connect('http://localhost:3000', { transports: ['websocket'] });
    },
    send: function() {
      if(this.message != '\n') socket.emit('send', this.message);
      this.message = '';
    },
    formatMemberDate: function(date) {
      return moment(date).format("h:mm:ss a");
    },
    formatMessageDate: function(date) {
      return moment(date).format("h:mm:ss a");
    },
    socketDefault() {
      socket.on('messages', function(message) {
        this.messages.push(message);
      }.bind(this));

      socket.on('member_add', function(member) {
        Vue.set(this.members, member.socket, member);
      }.bind(this));

      socket.on('member_delete', function(socket_id) {
        Vue.delete(this.members, socket_id);
      }.bind(this));

      socket.on('message_history', function(messages) {
        this.messages = messages;
      }.bind(this));

      socket.on('member_history', function(members) {
        this.members = members;
      }.bind(this));
    }
  },
  mounted: function() {
    this.socketCreate()
    this.socketDefault()
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

.meessage-avatar {
    float: left;
    margin: 0px 15px 15px 0px;
}

.members-group {
    width: 100%;
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

}
.list-group-item:first-child {
    border-top: none;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}

ul{
   list-style: none;
}

</style>
