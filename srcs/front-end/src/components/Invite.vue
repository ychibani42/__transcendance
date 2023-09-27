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


console.log("BTN")

function Accept(){
  console.log("Accepted")
  store.state.state?.emit('Accepted',store.state.gameInviteID)
  toast.clearAll()
}


function Refuse(){
  console.log("Refuse")
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