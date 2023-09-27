<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted,onBeforeMount } from 'vue';
import Axios from '../services';
import store from '../store';

const ID = ref()
const friend = ref([])
const clicking = ref(false)
const click = ref(0)

async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
      
  })
  Axios.post('friend',{id : ID.value}).then((res) => {
        friend.value = res.data
  })
}

onMounted(() => {
  getFriend()
});

function GotoProfile(){
  console.log("EASy")
}

function cancel(){
  clicking.value = false
  click.value = 0
}

function GAME(id : Number){
  console.log("Invite",id)
  store.state.state?.emit("Invite",id)
  store.dispatch("Inviteoff")
  store.dispatch("SocketGame")
  store.commit('setGameplay',true)
  store.commit("setGamename",store.state.user.username)
  clicking.value = !clicking.value
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

function connected(user : any){
  if(user.user.state == 'Online' || user.user.state == 'OnGame')
  {
    return true
  }
  return false
}

</script>

<template>
    <div class="friend">
      <ul v-for="friends in friend">
        <li class="lis" v-if="connected(friends)"> 
          <div class="Userdisp">
            <button class="Ubtn" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
          </div>
        </li>
        <div class="modal" v-if="clicking == true && friends.user.id == click">
            <button class="modal-btn" v-on:click="GotoProfile" >Profile</button>
            <button class="modal-btn" v-on:click="GAME(friends.user.id)">Invite for Game</button>
            <button class="modal-btn" v-on:click="cancel">Cancel</button>
        </div>
      </ul>
    </div>
</template>

<style scoped>

ul{
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  .lis{
    width: 100%;
    display: flex;
    justify-content: center;
  }
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


.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 15rem;
}

.Userdisp{
  
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
  .Ubtn{
    width: 100%;
  }
}
</style>