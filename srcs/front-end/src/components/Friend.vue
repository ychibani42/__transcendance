<script  setup lang="ts">
import { ref , onMounted} from 'vue';
import Axios from '../services';
import store from '../store';
// import router from '../router';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
const router = useRouter()

const ID = ref()
const friend = ref([])
const clicking = ref(false)
const click = ref(0)



async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if (res.status == 200)
        ID.value = res.data.id
      
  })
  Axios.post('friend',{id : ID.value}).then((res) => {
      friend.value = res.data
  })
}

onMounted(() => {
  getFriend()
});

function GotoProfile(id: number){
  router.push("/User/" + id)
}

function cancel(){
  clicking.value = false
  click.value = 0
}

function GAME(id : Number){
  console.log("Invite",id)
  if(store.state.gamename != "")
    return
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
    return true
  return false
}

function GotoDM(friend: any) {
  store.commit('setFriendDM', friend)
  store.commit('setDM', true)
  // console.log(store.getters.getFriend)
  router.push("/chat")
}

function blockFriend(id : Number){
  Axios.post('friend/blocked', { id:  ID.value,  blockid:  id }).then((res) => {
      console.log(res.status)   
  })
  clicking.value = false
  click.value = 0
} 

</script>

<template>
    <div class="friend">
      <ul>
        <li class="lis" v-for="friends in friend"> 
          <div v-if="friends.user.state == 'Online'" class="UserdispON">
            <button class="Ubtn" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
          </div>
           <div v-else-if="friends.user.state == 'OnGame'" class="UserdispGame">
              <button class="UbtnG" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
            </div>
            <div v-else class="UserdispDis">
                <button class="UbtnDis" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
            </div>
            <div class="modal" v-if="clicking == true && friends.user.id == click">
            <button class="modal-btn" v-on:click="GotoProfile(friends.user.id)" >Profile</button>
            <button class="modal-btn" v-on:click="GotoDM(friends.user)">Send DM </button>
            <button class="modal-btn" v-on:click="GAME(friends.user.id)">Invite for Game</button>
            <button class="modal-btn" v-on:click="blockFriend(friends.user.id)">Block Friend</button>
            <button class="modal-btn" v-on:click="cancel">Cancel</button>
            </div>
        </li>
      </ul>
    </div>
</template>

<style lang="scss" scoped>

ul {
  display: flex;
  justify-content: center;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  .lis {
    width: 100%;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: center;
}

.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: rgba(74, 72, 72, 0.3);
    display: flex;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  button .modal-btn {
  
    background-color: #bfc7cb;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 15px 32px;
    transition: 0.1s ease-in-out;

    &:hover {
      border: 2px solid #131719;
      background-color: #4ade80;;
    }

    }
  
}

.UserdispDis{
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
}

.UbtnDis{
    background-color: #bfc7cb;
    width: 100%;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 7px 0;
    width: 100%;
    transition: 0.1s ease-in-out;
    &:hover {
      border: 2px solid #131719;
      background-color: rgb(232, 29, 29);
    }
  }


.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 15rem;
}

.UserdispGame{
  
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
  
}
.UbtnG{
    background-color: #bfc7cb;
    width: 100%;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 7px 0;
    width: 100%;
    transition: 0.1s ease-in-out;
    &:hover {
      border: 2px solid #131719;
      background-color: rgb(233, 180, 47);
    }
  }
.UserdispON{
  
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
 
} 
.Ubtn{
    background-color: #bfc7cb;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 7px 0;
    width: 100%;
    transition: 0.1s ease-in-out;
    &:hover {
      border: 2px solid #131719;
      background-color: #4ade80;;
    }
  }
}

</style>