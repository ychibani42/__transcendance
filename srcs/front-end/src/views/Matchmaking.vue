
<script setup lang="ts">
import { io , Socket} from 'socket.io-client';
import {onMounted, Ref, ref} from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const socket: Ref<Socket | undefined> = ref()
const socket2: Ref<Socket | undefined> = ref()
const store = useStore()
const router = useRouter()
const User = store.getters.getuser
const option = ref(false)
const theme = ref(false)
const speed = ref('')

socket.value = store.state.gamesock


inviteorNormal()

function inviteorNormal()
{
    if(store.state.gamename == "")
        debut()
    else
        invitedgame()
}

function invitedgame(){
    console.log("invited")
    option.value = true
    store.dispatch("Inviteon")
    if(store.state.gamesock == null)
        store.commit('setGamesocket',io('http://localhost:3000/game'))
    socket.value = store.state.gamesock
    if(!socket.value)
        return
    socket.value.connect();
    socket.value.on("playerdef", (arg1 : number , arg2 : string) => {
        if(arg1 == 1)
            store.commit('setGameplay',false)
        else
            store.commit('setGameplay',true)
        store.commit('setGamename',arg2)
    })
    socket.value.on('OnRoom', () =>
    {
        router.push("/game")
        socket2.value = store.state.state
        socket2.value?.emit('game')
    })
}

function debut(){
    console.log("Debut")
    if(store.state.gamesock == null)
        store.commit('setGamesocket',io('http://localhost:3000/game'))
    socket.value = store.state.gamesock
    if(!socket.value)
        return
    socket.value.connect();
    socket.value.on('onQueue', () =>
    {
        console.log("ON QUEUE")
    })
    socket.value.on("playerdef", (arg1 : number , arg2 : string) => {
        if(arg1 == 1)
            store.commit('setGameplay',false)
        else
            store.commit('setGameplay',true)
        store.commit('setGamename',arg2)
    })
    socket.value.on('OnRoom', () =>
    {
        router.push("/game")
        socket2.value = store.state.state
        socket2.value?.emit('game')
    })
    socket.value.on('config', () =>
    {
        option.value = true
    })
}

function joinQueue(){
    socket.value?.emit("JoinQueue",store.state.user.id)
}

function ConfigGame(){
    console.log(theme.value)
    console.log(speed.value)
    if(speed.value == 'true')
        socket.value?.emit("Config",true,store.state.gamename)
    else
        socket.value?.emit("Config",false,store.state.gamename)
    store.commit('setTheme',theme.value)
}

</script>

<template>
    <div class="Queue" v-if="option == false">
        <div class="matchmaking">
        <h4>Click to join Queue</h4>
        </div>
        <div class="button">
            <button class="button" @click="joinQueue()">Join Queue</button>
        </div>
    </div>
    <div class="Option" v-else>
        <h2>Choose Your option</h2>
        <div class="Option">
            <form @submit.prevent="ConfigGame()">
                <div v-if="store.state.gameplay === true">
                    <input type="checkbox"  v-model="speed" true-value="true" false-value="fasle">
                    <label for="speed">Acceleration speedball</label>
                </div>
                <div>
                    <input type="radio" id="theme" name="theme" value="true"  v-model="theme" required/>
                    <label for="theme">Classic</label>
                </div>
                <div>
                    <input type="radio" id="theme" name="theme" value="false" v-model="theme" required/>
                    <label for="theme">Color</label>
                </div>
                <input type="submit" value="Validate">
            </form>
        </div>
    </div>
    <p>Your ID is {{ User.id }}</p>
  </template>
  
  <style lang="scss" scoped>

  </style>
  