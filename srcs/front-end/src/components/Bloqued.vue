<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted, onBeforeMount } from 'vue';
import Axios from '../services';

const ID = ref()
const Bloqued = ref([])
const clicking = ref(false)
const click = ref(0)

async function getBloqued(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
  })
  Axios.post('friend/blocklist',{id : ID.value}).then((res) => {
    console.log(res.data)
        Bloqued.value = res.data;
  })
  console.log(Bloqued.value)
}

onMounted(() => {
  getBloqued()
  console.log(Bloqued.value)
});

function cancel(){
  clicking.value = false
  click.value = 0
}

function clicked(nbr : number){
    
    if(click.value == nbr)
    {
      clicking.value = !clicking.value
      click.value = 0
    }
    else
    {
      clicking.value = true
      click.value = nbr
    }
}

function unblockFriend() {
  Axios.post('friend/unblock',{id: ID.value, blockid: click.value}).then((res) => {
    console.log(res.data)
    getBloqued()
  })
}

</script>

<template>
    <div class="Bloqued">
      <ul v-for="Bloqueds in Bloqued">
        <li class="lis">
        <button class="Ubtn" @click="clicked(Bloqueds.user.id)"> {{ Bloqueds.user.name }}</button>  
        </li>
        <div class="modal" v-if="clicking == true && Bloqueds.user.id == click">
          <button class="modal-btn" v-on:click="GotoProfile(Bloqueds.user.id)" >Profile</button>
          <button class="modal-btn" v-on:click="GAME(Bloqueds.user.id)">Invite for Game</button>
          <button class="modal-btn" v-on:click="unblockFriend(Bloqueds.user.id)">unblock Friend</button>
          <button class="modal-btn" v-on:click="cancel">Cancel</button>
        </div>
      </ul>
    </div>
</template>

<style scoped>

div {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 15rem;
}

ul {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  .lis {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

  .blocked {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    height: 15rem;
  }
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  .modal-btn {
    width: 15rem;
    height: 3rem;
    margin: 0.2rem;
  }
}

</style>