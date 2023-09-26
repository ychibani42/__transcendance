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
  user1: {},
  blocked: false,

})
async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
      
  })
  Axios.post('friend',{id : ID.value}).then((res) => {
        friend.value = res.data
  })
}

onBeforeMount(() => {
  getFriend()
});

function enterdm(friend: any) {
    DM.value = friend
    onChan.value = true
    console.log('ami', DM.value)

}
function displayChats () {
  emit('all')
}

function createMessage() {
  console.log('ok')
  onChan.value = true
  console.log(DM.value.id, messageText.value)
  console.log(socket)
  socket.emit('test')
  socket.emit('createMessageDM', { id: 4, name: User.username, text: messageText.value , user: User.id, to: 1},
      response => {
          messageText.value = ""
          console.log(response)
  });

}


function createDM () {
  let user1Id: number = User.id
  let user2Id: number = 3
  console.log('ici', User.id, friend.value)
	socket.emit('createDM', { user1Id, user2Id }, response => {
        console.log(response)
    })
    
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
                    {{ friends.user.name }}
                  </button>
                  <button @click="createDM"></button>
				        </li>
			      </ol>
        </div>
        <div class="dm-display">
          <div class="dm-header">
              <div class="dm-name" v-if="onChan == true">
                {{ DM.user.name }}
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
                            <p>
                                {{ name.text }} {{ name.userId }}
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


</style>