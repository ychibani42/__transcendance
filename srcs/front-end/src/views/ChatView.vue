<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onBeforeMount, onBeforeUnmount, ref,Ref, defineEmits, reactive, computed } from 'vue';
import Axios from '../services';
import { useStore, mapState } from 'vuex'
import Modal from '../components/Modal.vue';
import Password from '../components/Password.vue';
import DM from '../components/DM.vue';
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

const setting = ref(false);
const inAll = ref(true);
const inJoined = ref(false)
const inDM = ref(false)

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
   
    displayChats()
    socket.on('message',(arg1 : string) => {
        chandisp.value.messages.push(arg1);
    })
    socket.on('unadmin', (arg1:any) => {
        chandisp.value.admin.forEach(element => {
                if(element.id == arg1.id){
                    chandisp.value.admin.splice(chandisp.value.admin.indexOf(element), 1)
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
            if(element.id == arg1.id){
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
            onChan.value = false
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
    
    socket.emit('joinRoom', { userid, chanid, oldChatId }, response => {
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
    if (inDM.value == true)
    {
        socket.emit('createMessageDM',{ id: DM.value.id, name: User.username, text: messageText.value , user: User.id, to: 1},
        response => {
            messageText.value = ""
        });
    }
    else {
        socket.emit('createMessage',{ id: chandisp.value.idch, name: User.username, text: messageText.value , user: User.id, to: 1},
        response => {
            messageText.value = ""
        });
    }
	
}

function displayChats () {
    inAll.value = true
    inJoined.value = false
    inDM.value = false
    let userid: number = User.id
    if (inAll.value == true)
    {
        socket.emit('findAll', { userid }, (response) => {
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
	    socket.emit('findAllChats', { userid }, (response) => {
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

function updateChan() {
    let pass: string = newpass.value
    let chanid: number = chandisp.value.idch
    socket.emit('updatePassword', { pass, chanid }, response => {
       
    })
        let status: boolean = newstatus.value
        socket.emit('updateStatus', { status, chanid }, response => {
            chandisp.value.isprivate = newstatus.value
        }) 
        newpass.value = ""
}

function leaveChan() {
    let chanid: number = chandisp.value.idch
    let userid: number = User.id
    socket.emit('leaveChannel', { chanid, userid }, response => {
        displayJoined()
    })
}

function deleteChan() {
    let chanid: number = chandisp.value.idch
    socket.emit('deleteChannel', { chanid }, response => {
        displayJoined()
    })
}

</script>

<template>
    <div class="chat-page">
        
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
                <button @click="displayDM">
                    DM  
                </button>
               
            </div> 
            <DM v-if="inDM == true" @open="onChan = true"/>
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
                <p>Propriete du chat</p>

                <form @submit.prevent="updateChan">
                    <div>
                        Status:
				        <input type="checkbox"  v-model="newstatus">  {{ newstatus ? 'private' : 'public' }}     
                    </div>
                    
				    <label for="password">
                        Password
                        <input type="password" id="newpass" v-model="newpass" @focus="isFocused = true" @blur="isFocused = false">  
                    </label>
                    <button type="submit">Submit modification</button>
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
                   
                    <button v-if="User.id != chandisp.ownerId" class="leave" @click="leaveChan">Leave channel</button>
                   
                </form> 
                <button v-if="User.id === chandisp.ownerId" class="leave" @click="leaveChan">Leave channel</button>
                <button v-if="User.id === chandisp.ownerId" class="leave" @click="deleteChan">Delete room</button>
            </div>                  
            <div class="chat-header" >
                <div class="title" v-if="onChan === true">
                    {{ chandisp.channame }}
                </div>
            

                <div class="settings" v-if="onChan === true && isAdmin()">
                    <button @click="settings()">
                        <span class="material-icons">settings</span>
                    </button>

                </div>
                <div v-else-if="!isAdmin() && onChan === true">
                    <button class="leave" @click="leaveChan">Leave channel</button>
                </div>
            </div>
            <div class="chat-messages" >
                <div class="dm" v-if="inDM == true">
                    <DM v-if="inDM == true" emit="messages"/>
                </div>
                <div v-else>
                    <ol v-for="name in chandisp.messages" v-if="onChan === true">
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
            </div>
            <div class="typing-messages">
                <div class="dm" v-if="inDM == true">
                    <DM v-if="inDM == true" emit="type-messages"/>
                </div>
                <div v-else>
                    <form id='test' @submit.prevent="createMessage" v-if="onChan === true">
                        <input class="text" type="text" placeholder="type your message" v-model="messageText" required>
                        <button><span class="material-icons">send</span></button>
                    </form>
                </div>
                
               
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-page {
    height: 100%;
    width: 100%;
    display: flex;
    background-color: aliceblue;
}
.channel-list {
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
                .channel-name{
                    width: 90%;
                }

                width: 100%;
                border-radius: 8px;
                padding-top: 5%;
                padding-bottom: 5%;
            
            }
        }

    }
}
.formSetting {
    background-color: rgb(240, 240, 231);
    form{
        display:flex;
        flex-direction:column;
        align-items: start;
        margin-left: 3px;
        label input {
            width: 70%;
        }
        .buttons {
            display: flex;
            button {
                width: 5rem; 
            }
        }
       
    }
}
.btn {
    display: flex;
    justify-content: center;
    margin: 5px;
    button {
        color: black;
        background-color: rgb(223, 224, 208);
    }
    background-color: rgb(223, 224, 208);
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
    background-color: azure;
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
    background-color: rgb(250, 228, 217);
    .dm {
        width: 100%;
    }
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
    padding: 0;
    margin: 0;
    p{
        display: flex;
        margin: 5px;
        justify-content: flex-end;
        max-width: 50%;
        line-break: anywhere;
        background-color: rgb(229, 238, 231);
        padding: 10px;
        border-radius: 10px;
    }
}
</style>