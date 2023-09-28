<template>
    <div>
      <span>Invited by </span>
      <div class="Butt">
        <button @click="Accept">yes</button>
        <button @click="Refuse">no</button>
      </div>
    </div>
</template>

<script setup lang="ts">
import store from '../store';
import { toast } from 'vue3-toastify';
import { io ,Socket} from 'socket.io-client';


function Accept(){
  store.state.state?.emit('Accepted',store.state.gameInviteID)
  store.commit('setGameplay',false)
  if(store.state.gamesock == null)
  {
      store.commit('setGamesocket',io('http://localhost:3000/game'))
  }
  store.state.gamesock?.emit('Join',{id : store.state.user.id,name : store.state.gamename})
  toast.clearAll()
}


function Refuse(){
  store.state.state?.emit('Refused',store.state.gameInviteID)
  store.dispatch("Inviteon")
  toast.clearAll()
}

</script>

<style scoped>

.Butt{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>