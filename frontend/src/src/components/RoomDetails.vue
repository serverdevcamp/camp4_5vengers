<template>
        <v-layout column wrap>
            <!-- 맨 위에 채팅방 이름이랑 인원수 적혀 있는 곳 -->
            <v-flex md1 class="top-bar" fixed>
                <v-flex row wrap grid-list-md ml-1 p-3>
                        <v-avatar wrap p-2 m-2>
                            <v-img :src="('https://cdn.vuetifyjs.com/images/john.jpg')" class="img-user" contain></v-img>
                        </v-avatar>

                        <v-flex>
                            <v-flex wrap class="chat-name" text-md-center mx-1 pb-1 md1>패밀리</v-flex>
                            <!--여기에 사람 아이콘 첨부-->
                            <v-flex row grid-list-md ml-3 p-0>
                                <!-- <v-flex class="icon-num" text-md-left md1 pb-0> -->
                                    <img src="../assets/user.png" class="icon-user"/>
                                    <div class="chat-mem-num">4</div>
                                <!-- </v-flex> -->
                                <!-- <v-flex class="chat-mem-num" text-md-left pb-0>4</v-flex> -->
                            </v-flex>
                        </v-flex>
                        <v-flex text-md-right>
                            <!--여기에 아이콘 첨부-->
                            <img src="../assets/settings.png" class="icon-settings"/>
                        </v-flex>
                    </v-flex>
            </v-flex>

            <v-flex md9 class="middle-bar" fixed>
            </v-flex>

            <v-flex md2>
                <v-flex md12 class="bottom-bar-first" wrap fixed>
                </v-flex>
                <v-flex md12 class="bottom-bar-second" wrap fixed>
                </v-flex>
            </v-flex>
            
        </v-layout>
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
    height: 75%;
    background-color: #fffff;
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
    width: 30px;
}
.icon-user {
    width: 17px;
    height: 17px;

}
.icon-num {
    width: 10px;
}
</style>