<template>
    <v-container fluid grid-list-md con>
        <v-layout row wrap grid-list-md layout>

            <!-- 채팅 목록  -->
            <v-flex md11>
                <!-- 채팅방 추가 icon -->
                <v-flex row grid-list-md>
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
                <!-- <router-link to="/roomDetails"> -->
                <router-link to="/roomDetails">
                    <v-flex column grid-list-md>
                        <!-- 2번 v-flex해서 공간 만들어주기 -->
                        <v-flex wrap text-md-left>
                        </v-flex>
                        <v-flex wrap text-md-left>
                        </v-flex>
                        <v-flex row wrap grid-list-md ml-1 p-0>
                            <v-avatar wrap p-0 m-0>
                                <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                            </v-avatar>

                            <v-flex>
                                <v-flex row grid-list-md ml-1 p-0>
                                    <v-flex wrap class="text-nick" text-md-left pb-0 md1>패밀리</v-flex>
                                    <v-flex wrap class="text-mem-num" text-md-left pb-0>4</v-flex>
                                </v-flex>
                                <v-flex class="text-chat" text-md-left pt-0>안녕</v-flex>
                            </v-flex>
                            <v-flex>
                                <v-flex class="text-time" text-md-right pb-0>오후 7:07</v-flex>
                                <v-flex class="text-chat-num" text-md-right pt-0>60</v-flex>
                            </v-flex>
                        </v-flex>
                    </v-flex>
                </router-link>
                <!-- </router-link> -->
                <!--채팅방 목록--->
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      preUrl: ''
    }
  },
  methods: {
    goDetails () {
      this.$router.push('/roomDetails')
    }
  },
  computed: {
    ...mapGetters({
      inRoomDetails: 'inRoomDetails'
      // mapGetters정의하고 그 inRoomDetails값을 가져와서 dispatch해주기
    })
  },
  mounted: function () {
    console.log('inRoomDetails : ', this.inRoomDetails)
    const object = {
      roomIdx: this.$store.room_idx,
      userIdx: 8,
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
</style>
