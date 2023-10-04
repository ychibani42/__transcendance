<script setup lang="ts">
import { useStore } from 'vuex';
import { ref ,watch, onMounted ,onBeforeMount,onUpdated ,onBeforeUpdate} from 'vue';
import Axios from '../services';
import router from '../router';
import { useRoute } from 'vue-router';

const emit = defineEmits(['refrr'])

const ID  = ref();
const User = ref(GetUser())
const clicking = ref(false)
const click = ref(0)

const refresh = () => {
    GetUser()
}
defineExpose({refresh})

async function GetUser() {
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
  })
  await Axios.post('users',{id : ID.value}).then((res) => {
      User.value = res.data
  })
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

function cancel(){
  clicking.value = false
  click.value = 0
  emit("refrr")
}

async function addfriend(id : Number){
  await Axios.post('Friend/add',{id : ID.value ,addid : id }).then((res) => {
      emit("refrr")  
  })
  clicking.value = false
  click.value = 0
}

function GotoProfile(id : Number){
  router.push("/User/" + id)
}

function blockFriend(id : Number){
  Axios.post('friend/blocked',{id : ID.value , blockid : id}).then((res) => {
      emit("refrr")
  })
  clicking.value = false
  click.value = 0
} 

</script>

<template>
    <div class="User">
      <ul v-for="Users in User">
        <li>
          <div class="Userdisp">
            <button @click="clicked(Users.id)"> {{ Users.name }}</button>  
          </div>
        </li>
        <div class="modal" v-if="clicking == true && Users.id == click">
            <button class="modal-btn" @click="GotoProfile(Users.id)" >Profile</button>
            <button class="modal-btn" v-on:click="addfriend(Users.id)">Add friend</button>
            <button class="modal-btn" v-on:click="blockFriend(Users.id)">Block Friend</button>
            <button class="modal-btn" v-on:click="cancel">Cancel</button>
        </div>
      </ul>
    </div>
</template>

<style lang="scss" scoped>

.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: rgba(74, 72, 72, 0.7);
    display: flex;
    gap: 0.5rem;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;  ul {
     width: 100%;
  }
 
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    .modal-btn {
        background-color: #bfc7cb;
      color: #141d22;
      border: 1px solid #1b2023;
      border-radius: 8px;
      text-align: center;
      padding: 7px 22px;
      transition: 0.1s ease-in-out;

      &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
      }
    }
  }

  ul{
  display: flex;
  justify-content: center;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  align-items: center;
  
}
li {
  width: 80%;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    align-items: center;
}
.User {
  display: flex;
  flex-direction: column;
  align-items: center;
  // overflow-y: auto;
  height: 15rem;
}

.Userdisp{
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 100;
  button{
    background-color: #bfc7cb;
      color: #141d22;
      border: 1px solid #1a4258;
      border-radius: 8px;
      text-align: center;
      padding: 7px;
      width: 100%;
      transition: 0.2s ease-in-out;

      &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
      }
  }

}

ul{
  list-style: none;
  padding: 0;
  margin: 0.5rem;
}
</style>