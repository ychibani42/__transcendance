<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted,onBeforeMount } from 'vue';
import Axios from '../services';

const store = useStore()
const props = defineProps({'emit': String, 'header': String})
const event = ref(props.emit)
const chandisp = store.getters.getChandisp
const onChan = ref(false)
const ID = ref()
const friend = ref([])
const socket = store.getters.getChansocket;
const User = store.getters.getuser;
const messageText = ref('');
const emit = defineEmits(['open', 'all', 'joined'])
const DM = ref({
	messages : [],
	id : 0,
    dm1: 0,
    dm2: 0,
    name: 0,
    user1: {},
    blocked: false,

})
const clicking = ref(false)
const amigo = store.getters.getFriend
const rooms = ref([])
async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
      
  })
}

onBeforeMount(() => {
  getFriend()
  
    if (store.getters.getDM == true)
        createDM(amigo)
    socket.on('messageDM',(arg1 : string) => {
        DM.value.messages.push(arg1);
    })
    socket.on('createDM', (arg1: any) => {
        if (arg1 && arg1.user1.name != User.username && arg1.user2.name != User.username)
            return
        else if (arg1 && arg1.user1.name != User.username)
            friend.value.push(arg1.user1)
        else if (arg1 && arg1.user2.name != User.username)
            friend.value.push(arg1.user2)
    })
    displayDM()
});

function enterdm(friend: any) {
    let user1Id: number = User.id
    let user2Id: number = friend.id
    let user: any = User
    let oldRoomId: number = DM.value.id
    DM.value.user1 = friend
    amigo.value = friend
    socket.emit('joinDM', { user1Id, user2Id, user, oldRoomId }, response => {
        DM.value.id = response.id
        DM.value.blocked = response.blocked
        DM.value.dm1 = response.dm1
        DM.value.dm2 = response.dm2
        DM.value.name = response.name
        DM.value.messages = response.messages
    })
    onChan.value = true
    
}

function displayChats () {
  emit('all')
}

function displayDM () {
    let userid: number = User.id
    let name: string = User.name
    socket.emit('findAllDM', { userid, name }, (response) => {
		    friend.value = response
            console.log(response)
	    });
}

function createMessage() {
  onChan.value = true
  socket.emit('createMessageDM', { id: DM.value.id, name: DM.value.name, text: messageText.value , user: User.id, to: 1},
      response => {
          messageText.value = ""
  });

}


function createDM (friend: any) {
  let user1Id: number = User.id
  let user2Id: number = friend.id
	socket.emit('createDM', { user1Id, user2Id }, response => {
        // DM.value.id = response.id
    })
    
}

function cancel(){
  clicking.value = false
}

function GAME(id : Number){
  console.log("Invite",id)
  store.state.state?.emit("Invite",id)
  store.dispatch("Inviteoff")
  store.dispatch("SocketGame")
  store.commit('setGameplay',true)
  store.commit("setGamename",store.state.user.username)
  clicking.value = !clicking.value
}

</script>

<template>
   <div class="dm-page">

    <div class="dm-list">
            <div class="chats">
                <button @click="displayChats">Channels</button>
            </div> 
        
            <ol>
				<li v-for="friends in friend">
                    <button @click="enterdm(friends)"> 
                        {{ friends.name }}
                    </button>
				</li>
			</ol>
        </div>
        <div class="dm-display">
          <div class="dm-header">
              <div class="dm-name" v-if="onChan == true">
                {{ amigo.value.name }}
              </div>
             
          </div>
          <div class="dm-messages" >
            <ol v-for="name in DM.messages" v-if="onChan === true">
                  <div class="message" v-if="name.userId === User.id" >
                      <p>
                          {{ name.text }} {{name.userId }}
                      </p>  
                  </div>
                        <div class="Autre" v-else>
                                <button @click="clicking = true" v-if="User.id != name.userId"> 
                                        {{ amigo.value.name }}:         
                                </button>
                                <div class="modal" v-if="clicking == true">
                                    <button class="modal-btn" >Profile</button>
                                    <button class="modal-btn" @click="GAME(amigo.value.id)">Invite for Game</button>
                                    <button class="modal-btn" @click="cancel">Cancel</button>
                                </div>
                            <p>
                                {{ name.text }}
                            </p>
                        </div>
			        </ol>
          </div>
          <div class="typing-messages" v-if="onChan == true">
            <form @submit.prevent="createMessage">
              <input class="text" type="text" placeholder="type your message" v-model="messageText" required>
              <button><span class="material-icons">send</span></button>   
            </form> 
          </div>

        </div>
   </div>
</template>

<style lang="scss" scoped>
.dm-page {
    height: 100%;
    width: 100%;
    display: flex;
    background-color: aliceblue;

.chats {
    display: flex;
    flex-direction: row;
    padding: 0;
    button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        padding-top: 5%;
        padding-bottom: 5%;
    }
}
}
.dm-list {
    display: flex;
    flex-flow: column;
    flex: 0 0 15%;
    min-width: 150px;
    max-width: 300px;
    position: relative;
    height: 100%;
    background-color: rgb(240, 240, 231);
    overflow-y: auto;
    ol {
        padding: 0;
        width: 100%;
        display: flex;
        flex:content;
        flex-flow: column;
        align-items: flex-start;
        list-style: none;
        text-align: left;
        gap: 0.5%;
       
        li {
            width: 100%;
            
            button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-radius: 8px;
                padding-top: 5%;
                padding-bottom: 5%;
            
            }
        }

    }
}

.dm-display {
    position: relative;
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    background-color:rgb(143, 143, 158);
    overflow-y: scroll;
}

.dm-header {
    display: flex;
    align-items: center;
    min-height: 64px;
    width: 100%;
    margin-right: 1px;
    background-color: azure;
    justify-content: center; 
}

.dm-messages{
    background-color: rgb(212, 248, 236);
    flex: 1;
    flex:content;
    overflow-y: auto;
    ol {
        margin: 0;
        padding: 0;
        display: flex;
        flex:content;
        flex-flow: column;
        list-style: none;
        text-align: left;
        gap: 0.5%;
    }
 
}

.typing-messages {
    position: relative;
    display:flex;
    width: 100%;
    height: 5%;
    border-bottom-right-radius: 4px;
    background-color: rgb(250, 228, 217);
  
    form {
        display: flex;
        width: 100%;
    }
    input {
        width: 100%;
        border: 8px solid transparent;
    }
    button {
        border-radius: 1px;
        background-color: rgb(149, 195, 247);
        border: 1px solid transparent;
        span {
            margin-top: 2px;
            margin-left: 2px;
        }
    }
}

.message{
    display:flex;
    justify-content: end;
    padding: 0;
    margin: 0;
    p{
        display: flex;
        margin: 5px;
        justify-content: flex-end;
        max-width: 50%;
        line-break: anywhere;
        background-color: rgb(159, 241, 177);
        padding: 10px;
        border-radius: 10px;
    }
}
.Autre{
    display:flex;
    justify-content: start;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    max-width: 50%;
    button {
        background-color: rgb(212, 248, 236);
        overflow: hidden;
    }    
    p{
        display: flex;
        justify-content: center;
        margin-left: 5px;
        max-width: 50%;
        line-break: anywhere;
        background-color: rgb(229, 238, 231);
        padding: 10px;
        border-radius: 10px;
       
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
</style>