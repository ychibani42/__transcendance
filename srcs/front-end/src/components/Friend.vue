<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted,onBeforeMount } from 'vue';
import Axios from '../services';

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
  console.log(id)
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

</script>

<template>
    <div class="friend">
      <ul v-for="friends in friend">
        <li> 
          <div class="Userdisp">
            <button @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
          </div>
        </li>
        <div class="modal" v-if="clicking == true && friends.user.id == click">
            <button v-on:click="GotoProfile" >Profile</button>
            <button v-on:click="GAME(friends.user.id)">Invite Game</button>
            <button v-on:click="cancel">Cancel</button>
        </div>
      </ul>
    </div>
</template>

<style scoped>

ul{
  list-style: none;
  padding: 0;
  margin: 0.5rem;
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
}
</style>