<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onBeforeMount, onBeforeUnmount, ref,Ref, defineEmits, reactive, computed } from 'vue';
import Axios from '../services';
import { useStore, mapState } from 'vuex'
import Modal from '../components/Modal.vue';
import Password from '../components/Password.vue';
import DM from '../components/DM.vue';
import Friend from '../components/Friend.vue';
import { toast } from 'vue3-toastify'
import { useRouter, onBeforeRouteLeave } from 'vue-router';
// import { useState, useActions } from 'vuex-composition-helpers/dist'

const store = useStore()
const socket = io('http://localhost:3000/chat');
const addNewRoom = ref(false)
const chan = ref([])
const chandisp = ref({
	messages : [],
	idch : 0,
	channame : '',
    isprivate: false,
    user: [],
    ownerId: 0,
    admin: [],
    banned: [],
    muted: [],
    oldChatId: 0,
    locked: false
})

const User = store.getters.getuser;

const createChan = ref({
	channelName: '',
	is_private: false,
	password: '',
	dm: false,
	ownerId: 0,
})
const messageText = ref('');
const onChan = ref(false);
const router = useRouter()

const setting = ref(false);
const inAll = ref(true);
const inJoined = ref(false)
const inDM = ref(false)
const clicking = ref(false)
const checked = ref(false)
const newstatus = ref(false)
const isFocused = ref(false)
const password = ref('')
const newpass = ref('')
const isModalAdmin = ref(false)
const isModalBan = ref(false)
const isModalKick = ref(false)
const isModalMute = ref(false)
const isModalunAdmin = ref(false)
const isModalunBan = ref(false)
const isPassword = ref(false)




onBeforeMount(() => {
    getBlocked()
   
    inDM.value = store.getters.getDM;
    if (inDM.value == true)
        displayDM()
    else
        displayChats()
    socket.on('message',(arg1 : string) => {
        chandisp.value.messages.push(arg1);
    })
    socket.on('unadmin', (arg1:any) => {
        
        chandisp.value.admin.forEach(element => {
                if(arg1 && element.id == arg1.id){
                    chandisp.value.admin.splice(chandisp.value.admin.indexOf(element), 1)
                    setting.value = false
                    isModalunAdmin.value = false
                    
                }
        })   
    })
    socket.on('unbanned', (arg1:any) => {
        chandisp.value.banned.forEach(element => {
            if(element.id == arg1.id){
                chandisp.value.banned.splice(chandisp.value.banned.indexOf(element), 1)
            }
        })
    })
    socket.on('unmuted', (arg1:any) => {
        chandisp.value.muted.forEach(element => {
            if(arg1 && element.id == arg1.id){
                chandisp.value.muted.splice(chandisp.value.muted.indexOf(element), 1)
            }
        })
    })
    socket.on('admin', (arg1:any) => {
        chandisp.value.user.forEach(element => {
            if(element.id == arg1.user.id){
                chandisp.value.admin.push(arg1)
            }
        })
    })
    socket.on('muted', (arg1:any) => {
        chandisp.value.user.forEach(element => {
            if(element.id == arg1.user.id){
                chandisp.value.muted.push(arg1)

            }
        }) 
        
    })
    socket.on('banned', (arg1: any) => {
        chandisp.value.user.forEach(element => {
            if(element.id == arg1.user.id){
                chandisp.value.banned.push(arg1)
                setting.value = false
                isModalBan.value = false
            }
            if (User.id == arg1.user.id)
                {
                    onChan.value = false
                    setting.value = false
                    if (inAll.value == true)
                        displayChats()
                    if (inJoined.value == true)
                        displayJoined()
                }
        })
        chandisp.value.user.forEach(element => {
            if(element.id == arg1.user.id){
                chandisp.value.user.splice(chandisp.value.user.indexOf(element), 1)
            }
        })
        
        
    })
    socket.on('deleteChannel', (arg1: any) => {
        if (arg1.id == chandisp.value.idch)
        {
            onChan.value = false
            setting.value = false
            displayJoined()
        }
        else
            displayChats()
    })
    socket.on('leaveChannel', (arg1: any) => {
        chandisp.value.user.forEach(element => {
        if(element.id == arg1.id){
            chandisp.value.user.splice(chandisp.value.user.indexOf(element), 1)
            }
        });
        if (arg1.id == User.id)
        {
            onChan.value = false
            setting.value = false
            isAdmin()
            if (inAll.value == true)
                displayChats()
            if (inJoined.value == true)
                displayJoined()
        }
    })
    socket.on('kicked', (arg1: any) => {
        chandisp.value.user.forEach(element => {
            if(element.id == arg1.id){
                chandisp.value.user.splice(chandisp.value.user.indexOf(element), 1)
                setting.value = false
                isModalKick.value = false
            }
            if (arg1.id == User.id)
            { 
                onChan.value = false
                setting.value = false
                isAdmin()
                if (inAll.value == true)
                    displayChats()
                if (inJoined.value == true)
                    displayJoined()
            }
        })
       
    })
    
    socket.on('joinRoom', (arg1: any) => {
        chandisp.value.user.push(arg1)
        
    })
    socket.on('createRoom', (arg1: any) => {
        if (arg1) {
            if (inAll.value == true && arg1.is_private == false)
                chan.value.push(arg1)
            if (inJoined.value == true && isUserChan(arg1))
                chan.value.push(arg1)
        }
       
    })
    socket.on('error', (arg1: string) => {
        if (arg1 == 'banned')
        {
            toast("You were banned from there", { autoClose: true})    
            onChan.value = false
        }
        if (arg1 == 'muted')
        {
            toast("You were muted", { autoClose: true})  
            
        }
        if (arg1 == 'bad pass')
        {
            toast("Bad password", { autoClose: true})
        }
            
    })
    socket.on('updateStatus', (arg1: any) => {
       
        chan.value.forEach((element : any) => {
        if(element.id == arg1.id){
                element.is_private = arg1.is_private
            }
        });
        
    })
    socket.on('updatePassword', (arg1: any) => {
        chan.value.forEach((element : any) => {
        if(element.id == arg1.id){
                element.locked = arg1.locked
            }
        });
    })
    
    store.commit('setChatsocket', socket)
});

onBeforeUnmount(() => {
    socket.disconnect()
})


function enterchat(chan : any){

    if (chan.locked == true && !isUserChan(chan))
    {
        onChan.value = false
        isPassword.value = true
        store.commit("setChanid", chan.id)
        return
    }
    
    
    isPassword.value = false
    let userid: number = User.id
    let chanid: number = chan.id
    let oldChatId: number = chandisp.value.idch
    
    socket.emit('joinRoom', { chatId: chanid, userId: userid, oldChatId:  oldChatId }, response => {
        chandisp.value.oldChatId = oldChatId
        chandisp.value.messages = response.messages
        chandisp.value.idch=response.id
        chandisp.value.isprivate = checked.value
        onChan.value = true;
        chandisp.value.channame = response.channelName
        chandisp.value.ownerId = response.ownerId
        chandisp.value.user = response.user
        chandisp.value.admin = response.adminUsers
        chandisp.value.banned = response.bannedUsers
        chandisp.value.muted = response.mutedUsers
        chandisp.value.locked = chan.locked
        setting.value = false
        inAll.value = false
        inJoined.value = true
        displayJoined()
        store.commit("setChandisp", chandisp.value)
    });
    
    
}

const createMessage = () => {

    socket.emit('createMessage',{ id: chandisp.value.idch, name: User.username, text: messageText.value , user: User.id, to: 1},
    response => {
        messageText.value = ""
    });

	
}

function displayChats () {
    inAll.value = true
    inJoined.value = false
    inDM.value = false
    let userid: number = User.id
    if (inAll.value == true)
    {
        socket.emit('findAll', { id: userid }, (response) => {
		    chan.value = response
	    });
    }
	
}

function displayJoined() {
    inAll.value = false
    inJoined.value = true
    inDM.value = false
    if (inJoined.value == true)
    {
        let userid: number = User.id
	    socket.emit('findAllChats', { id : userid }, (response) => {
		    chan.value = response
	    });
    }
    
}

function displayDM() {
    inDM.value = true
    inJoined.value = false
    inAll.value = false
}

function createChat () {
	socket.emit('createRoom', {
		channelName: createChan.value.channelName,
		is_private: checked.value,
		password: password.value,
		dm: createChan.value.dm,
		ownerId: User.id,
    }, response => {
        password.value = ""
        createChan.value.channelName = ""
        addNewRoom.value = false
        enterchat(response)
    })
    
}

function settings () {
    if (setting.value == true)
        setting.value = false
    else
        setting.value = true
}

function isAdmin() {
    for (let i = 0; i < chandisp.value.admin.length; i++)
    {
        console.log(chandisp.value.admin[i].user.id, User.id)
        if (chandisp.value.admin[i].user.id == User.id)
            return true
    }
    if (User.id == chandisp.value.ownerId)
        return true
    return false
    
}

function isMuted() {
    for (let i = 0; i < chandisp.value.muted.length; i++)
    {
        if (chandisp.value.muted[i].user.id == User.id)
            return true
    }
    return false
    
}

function isUserChan(newchan: any) {
    for (let i = 0; i < newchan.user.length; i++) 
    {
        if (newchan.user[i].id == User.id)
            return true
    }
    return false
}

function updatepPass() {
    let pass: string = newpass.value
    let chanid: number = chandisp.value.idch
    socket.emit('updatePassword', { pass: pass, chatId: chanid }, response => {
       
    })
      
        newpass.value = ""
}

function updateStatus(){
    let status: boolean = newstatus.value
    let chanid: number = chandisp.value.idch
        socket.emit('updateStatus', { status: status, chatId: chanid }, response => {
            chandisp.value.isprivate = newstatus.value
        }) 
}

function leaveChan() {
    let chanid: number = chandisp.value.idch
    let userid: number = User.id
    socket.emit('leaveChannel', { chatId: chanid, userId: userid }, response => {
        displayJoined()
    })
}

function deleteChan() {
    let chanid: number = chandisp.value.idch
    socket.emit('deleteChannel', { id: chanid }, response => {
        displayJoined()
    })
}

function GotoDM(friend: any) {
    store.commit('setFriendDM', friend)
    store.commit('setDM', true)
    inDM.value = true
    clicking.value = false
}

function cancel(){
  clicking.value = false
}

function GAME(id : Number){
  console.log("Invite",id)
  if(store.state.gameInviteID == 0){
    store.dispatch("Inviteoff")
    store.dispatch("SocketGame")
    store.commit('setGameplay',true)
    store.commit("setGamename",store.state.user.username)
    store.commit("setGameID",id)
  }
  else{
      toast("You have already invite someone or invited",
      {
         type : "error"
      })
  }
  clicking.value = !clicking.value
}

const blocked = ref({})
async function getBlocked(){
    Axios.post('friend/blocklist',{id : User.id}).then((res) => {
        blocked.value = res.data;
  })
}

function isBlocked(id: number) {
    for (let i = 0; i < blocked.value.length; i++)
    {
        if (blocked.value[i].userId == id)
            return true
    }
    return false
    
}

function unblockFriend() {
    for (let i = 0; i < blocked.value.length; i++)
    {
        Axios.post('friend/unblock',{id: User.id, blockid: blocked.value[i].userId}).then((res) => {
            getBlocked()
            clicking.value = false
        })
    }
 
}

function blockFriend(id : number){
        Axios.post('friend/blocked',{ id : User.id , blockid : id }).then((res) => {
            getBlocked()
        })
        clicking.value = false
} 

function GotoProfile(id: number){
  router.push("/User/" + id)
}

</script>

<template>
    <div class="dm" v-if="inDM == true">
        <DM @all="(inDM = false) && (inAll = true)" />
    </div>
    <div v-else class="chat-page">
        
        
        <div class="add-chat">
          <form v-if="addNewRoom" @submit.prevent.clear="createChat">
                <input type="text" placeholder="Create or Join room" v-model="createChan.channelName" required>
                <button type="submit"> Submit </button>
                <button class="button-cancel" @click="addNewRoom = false">Cancel</button>
                <div>
                        Status:
				        <input type="checkbox" :value="checked" v-model="checked">  {{ checked ? 'private' : 'public' }}     
                </div>
				<label for="password">Mot de passe</label>
				<input type="password" id="password" v-model="password" @focus="isFocused = true" @blur="isFocused = false">
            </form>
        </div>
        <div class="channel-list">
            <button @click="addNewRoom = true">+</button>
            <div class="chats">
                <button @click="displayChats">All</button>
                <button @click="displayJoined">Joined chats</button>
                <button @click="displayDM">DM</button>
               
            </div> 
			<ol v-if="inAll == true">
				<li v-for="channel in chan">
                    <div v-if="channel.is_private == false" class="unlocked">
                       
                            <div v-if="channel.locked === false">
                            <button @click="enterchat(channel)">
                                <div class="channel-name">
                                    {{ channel.channelName }}
                                </div>
                                <span class="material-icons">lock_open</span>
                            </button>
                        </div>
                        <div v-else class="locked">
                            <button @click="enterchat(channel)">
                                <div class="channel-name">
                                    {{ channel.channelName }} 
                                </div>
                                <span class="material-icons">lock</span>
                            </button>
                            </div>

                    </div>
                    <Password v-if="isPassword === true" @close="isPassword = false" @unlock="channel.locked = false" @enter="enterchat(channel)"/>
				</li>
			</ol>
            <ol v-if="inJoined == true">
				<li v-for="channel in chan">
                    <div v-if="isUserChan(channel)">
                        <button @click="enterchat(channel)">
                            <div class="channel-name">
                                {{ channel.channelName }}
                            </div>
                        </button>
                    </div>
				</li>
			</ol>
        </div>
        <div class="chat-display">
            
            
            <div class="formSetting" v-if="setting === true">
                <h2>Propriete du chat</h2>

                <form>
                    <form @submit.prevent="updateStatus">
                        <div class="status">
                            <h5>Status:</h5>
                            <input type="checkbox"  v-model="newstatus"> 
                            <div class="change-status">{{ newstatus ? 'private' : 'public' }}  </div>   
                            <div class="submit-modif"> <button type="submit">Submit</button></div> 
                        </div>
                    
                    </form>
                    <form @submit.prevent="updatepPass">
                     <!-- <label for="password"> -->
                        <div class="password">
                            <h5>Password:</h5>
                            <input type="password" id="newpass" v-model="newpass" @focus="isFocused = true" @blur="isFocused = false">  
                            <div class="submit-modif"> <button type="submit">Submit</button></div>
                        </div>
                        
                    <!-- </label> -->
                    </form>
				   
                    
                   
                     <div class="buttons">
                        <button type="button" class="btn" @click="isModalKick = true">
                            Kick
                        </button>
                        <Modal emit='kicked' header="Kick" v-if="isModalKick === true" @close="isModalKick = false"/>
                        <button type="button" class="btn" @click="isModalMute = true">
                            Mute
                        </button>
                        <Modal emit='muted' header="Mute" v-if="isModalMute === true" @close="isModalMute = false"/>
                    </div>
                    <div class="buttons" v-if="chandisp.ownerId == User.id">
                        <button type="button" class="btn" @click="isModalAdmin = true">
                            Admin
                        </button>
                        <Modal emit='admin' header="Admin" v-if="isModalAdmin === true" @close="isModalAdmin = false"/>
                        <button type="button" class="btn" @click="isModalunAdmin = true">
                            unAdmin
                        </button>
                        <Modal emit='unadmin' header="unAdmin" v-if="isModalunAdmin === true" @close="isModalunAdmin = false"/>

                    </div>
                   
                    <div class="buttons">
                        <button type="button" class="btn" @click="isModalBan = true">
                            Ban
                        </button>
                        <Modal emit='banned' header="Ban" v-if="isModalBan === true" @close="isModalBan = false"/>
                        <button type="button" class="btn" @click="isModalunBan = true">
                            unBan
                        </button>
                        <Modal emit='unbanned' header="unBan" v-if="isModalunBan === true" @close="isModalunBan = false"/>

                    </div>
                    <div class="leaving-admin"> 
                        <button v-if="User.id != chandisp.ownerId" class="leave" @click="leaveChan">Leave channel</button>
                    </div>
                    
                </form> 
                <div class="leaving"> 
                    <button v-if="User.id === chandisp.ownerId && inDM == false" class="leave" @click="leaveChan">Leave channel</button>
                    <button v-if="User.id === chandisp.ownerId  && inDM == false" class="leave" @click="deleteChan">Delete room</button>
                </div>
              
            </div>                  
            <div class="chat-header" >
              
                <div class="chat-header">
                     <div class="title" v-if="onChan === true">
                        {{ chandisp.channame }}
                    </div>
            

                    <div class="settings" v-if="onChan === true && isAdmin()">
                        <button @click="settings()">
                            <span class="material-icons">settings</span>
                        </button>
                    </div>
                
                    <div v-else-if="!isAdmin() && onChan === true  && inDM == false">
                        <button class="leave" @click="leaveChan">Leave channel</button>
                    </div>
                </div>
            </div>
            <div class="chat-messages" >
            
                    <ol v-for="name in chandisp.messages" v-if="onChan === true">
                        <div class="message" v-if="name.userId === User.id" >
                                    
                                    <p>
                                        
                                        {{ name.text }}
                                    </p>
                               
                        </div>
                        <div class="Autre" v-else>
                            <li v-for="user in chandisp.user">
                                <!-- <button @click="getBlocked(name.userId)">see blocked</button> -->
                                <button v-if="user.id == name.userId" @click="clicking = true"> 
                                    
                                        {{ user.name }}: 
                                        
                                </button>
                                <div class="modal" v-if="clicking == true && user.id == name.userId">
                                    <button class="modal-btn" v-if="isBlocked(user.id) == false" @click="GotoProfile(user.id)">Profile</button>
                                    <button class="modal-btn" v-if="isBlocked(user.id) == false" @click="GotoDM(user)">Send DM</button>
                                    <button class="modal-btn" @click="GAME(user.id)">Invite for Game</button>
                                    <div class="blocked">
                                        <button class="modal-btn" v-if="isBlocked(user.id) == false" v-on:click="blockFriend(user.id)">Block Friend</button>
                                        <button class="modal-btn" v-else v-on:click="unblockFriend(user.id)">Unblock Friend</button>
                                    </div>
                                    <button class="modal-btn" @click="cancel">Cancel</button>
                                </div>
                               
                            </li>
                            <p v-if="isBlocked(name.userId) == false">
                                    {{ name.text }}
                            </p>
                            <p v-else> Blocked User </p>
                        </div>
			        </ol>
               
            </div>
            <div class="typing-messages">
                <form id='test' @submit.prevent="createMessage" v-if="onChan === true">
                    <input class="text" type="text" placeholder="type your message" v-model="messageText" required>
                    <button><span class="material-icons">send</span></button>
                </form>            
            </div>
        </div>
        
    </div>
    
</template>

<style lang="scss" scoped>
.dm{
    height: 100%;
    width: 100%;
    display: flex;
    background-color: rgb(29, 29, 28);
}
.chat-page {
    font-size: 0.7rem;
    height: 100%;
    width: 100%;
    display: flex;
    background-color: rgb(5, 5, 5);
}
.channel-list {
    display: flex;
    flex-flow: column;
    flex: 0 0 25%;
    min-width: 150px;
    max-width: 400px;
    position: relative;
    height: 100%;
    background-color: rgb(5, 5, 5);
    border-color:rgb(255, 255, 255);
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
                .channel-name{
                    width: 90%;
                }

                width: 100%;
                border-radius: 8px;
                padding-top: 5%;
                padding-bottom: 5%;
            
            } li{
        display: flex;
        button {
            background-color: rgb(147, 149, 149);
            font-size: 0.5rem;
        }
    }
        }

    }
}
.formSetting {
    background-color: rgb(8, 8, 8);
    form{
        display:flex;
        flex-direction:column;
        align-items: flex-start;
        margin-left: 3px;
        label input {
            width: 70%;
        }
        .buttons {
            display: flex;
            button {
                width: 6rem;
                background-color: #bfc7cb;
                color: #141d22;
                border: 1px solid #1a4258;
                border-radius: 8px;
                text-align: center;
                padding: 10px 25px;
                transition: 0.1s ease-in-out;

                &:hover {
                    border: 2px solid #131719;
                    background-color: #4ade80;;
                }
        }
        }
        .submit-modif {
            button {
                margin-top: 0;
                font-size: 0.6rem;
                background-color: #bfc7cb;
                color: #141d22;
                border: 1px solid #1a4258;
                border-radius: 8px;
                text-align: center;
                padding: 4px 15px;
                transition: 0.1s ease-in-out;

                &:hover {
                    border: 2px solid #131719;
                    background-color: #4ade80;;
                }
        }
        }
        .leaving-admin {
                display: flex;
                justify-content: flex-start;
                
                button {
                    margin: 5px;
                    padding: 10px;
                    background-color: rgb(236, 89, 89);
                 }
        }
        .status {
            display: flex;
            flex-direction: row;
            margin: 4px;
            h5 {
                margin: 2px;
            }
            input {
                margin-top: 0;
                margin-right: 6px;
            }
            .change-status {
                margin: 2px;
            }
        }
        .password {
            display:flex;
            flex-direction: row;
            margin: 4px;
            h5 {
                margin: 2px;
            }
            input {
                margin-bottom: 4px;
                padding: 0;
            }
        }

        
       
    }
}
.leaving {
            display: flex;
            justify-content: flex-start;
            button {
                margin: 5px;
                padding: 10px;
            }
        }
.btn {
    display: flex;
    justify-content: center;
    margin: 5px;
    button {
        color: black;
        background-color: rgb(68, 69, 66);
    }
    background-color: rgb(129, 129, 128);
    padding: 10px;
    border-radius: 10px;
}
.chat-display {
    position: relative;
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    background-color:rgb(143, 143, 158);
    overflow-y: scroll;
}

.chats {
    display: flex;
    flex-direction: row;
    padding: 0;
    button {
        width: 100%;
    }
}

.chat-header {
    display: flex;
    align-items: center;
    min-height: 64px;
    width: 100%;
    margin-right: 1px;
    background-color: rgb(2, 2, 2);
    justify-content: center; 
    .title {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .settings {
        display: flex;
        justify-content: end;
    }

}

.chat-messages{
    background-color: rgb(57, 57, 57);
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

.leave {
        border-radius: 8px;
        background-color: rgb(236, 89, 89);
        border: 1px solid transparent;
        display: flex;
        align-content: start;
}
.typing-messages {
    position: relative;
    display:flex;
    width: 100%;
    height: 5%;
    border-bottom-right-radius: 4px;
    background-color: rgb(5, 5, 5);
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
.add-chat{
    form{ 
        display: flex;
        flex-direction: column;
    }
    display:flex;
    flex-direction:column;
    align-items: center;
}

.message{
    display:flex;
    justify-content: end;
    padding: 0;
    margin: 0;
    li{
        display: flex;
        button {
            background-color: rgb(57, 57, 57);
            color: rgb(254, 254, 254);
        }
    }
    p{
        display: flex;
        margin: 5px;
        justify-content: center;
        max-width: 50%;
        line-break: anywhere;
        background-color: rgb(159, 241, 177);
        padding: 10px;
        border-radius: 10px;
        color:  rgb(0, 0, 0);
    }
}

.Autre{
    display:flex;
    justify-content: start;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    max-width: 50%;
    li{

        button {
            background-color: rgb(57, 57, 57);
            overflow: hidden;
            padding: 10px;
            color: rgb(254, 250, 250);
        }
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
        color:  rgb(9, 10, 9);
       
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
    background-color: rgb(245, 245, 245);
    color:  rgb(4, 4, 4);
  }
}

</style>