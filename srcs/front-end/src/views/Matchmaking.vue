
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

onMounted(() =>{
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
})

function joinQueue(){

    socket.value?.emit("JoinQueue",store.state.user.id)
}
</script>

<template>
    <div class="matchmaking">
      <h4>Please wait till a player wants to play</h4>
    </div>
    <div class="button">
        <button class="button" @click="joinQueue()">Join Queue</button>
    </div>
    <p>Your ID is {{ User.id }}</p>
  </template>
  
  <style lang="scss" scoped>

  </style>
  