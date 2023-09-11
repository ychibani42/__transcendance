
<script setup lang="ts">
import { io } from 'socket.io-client';
import {onMounted,onBeforeMount, Ref, ref , onUnmounted, computed} from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const socket: Ref<Socket> = ref()
const store = useStore()
const router = useRouter()
const User = store.getters.getuser

onMounted(() =>{
    store.commit('setGamesocket',io('http://localhost:3000/game'))
    socket.value = store.state.gamesock
    socket.value.connect();
    socket.value.on('onQueue', () =>
    {
        console.log("ON QUEUE")
    })
    socket.value.on('onRoom', () =>
    {
        console.log("ON ROOM")
    })
})

onUnmounted(() =>{
  socket.value.disconnect()
})

function joinQueue(){
    socket.value.emit("JoinQueue",store.state.user.id)
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
  