<template>
    <div class="all">
      <span> {{ store.state.gamename }} Invite you for a Game</span>
      <div class="Butt">
        <button @click="Accept">yes</button>
        <button @click="Refuse">no</button>
      </div>
    </div>
</template>

<script setup lang="ts">
import store from '../store';
import {onUnmounted , ref} from "vue"
import { toast } from 'vue3-toastify';
import { io } from 'socket.io-client';

const r = ref(true)

function Accept(){
 
  store.commit('setGameplay',false)
  store.commit('setGamesocket',io('http://localhost:3000/game'))
  store.state.gamesock?.emit('Join',{id : store.state.user.id,name : store.state.gamename})
  store.state.state?.emit('Accepted',store.state.gameInviteID)
  toast.clearAll()
  r.value = false
}


function Refuse(){
  toast.clearAll()
  store.state.state?.emit('Refused',store.state.gameInviteID)
  store.dispatch("Inviteon")
  r.value = false
}

onUnmounted(() => {
  if(r.value == true)
  {
    store.state.state?.emit('Refused',store.state.gameInviteID)
    store.dispatch("Inviteon")
  }
})
</script>

<style scoped>

.Butt{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
}
.all{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>