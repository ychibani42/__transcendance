<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onBeforeMount, onBeforeUnmount, ref, defineEmits, reactive, computed } from 'vue';
import Axios from '../services';
import { useStore, mapState } from 'vuex'
import Modal from '../components/Modal.vue';
import Password from '../components/Password.vue';
// import { useState, useActions } from 'vuex-composition-helpers/dist'

const store = useStore()
const socket = io('http://localhost:3000');
const addNewRoom = ref(false)
const chan = ref([])
const chandisp = ref({
	messages : [],
	idch : 0,
	channame : '',
    user: [],
    ownerId: 0,
    adminId: [],
    bannedId: [],
    mutedId: [],
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

const checked = ref(false)
const isFocused = ref(false)
const password = ref('')
const togglePrivacy = ref(false)
const isModalAdmin = ref(false)
const isModalBan = ref(false)
const isModalMute = ref(false)
const isPassword = ref(false)


onBeforeMount(() => {
    displayChats()
	Axios.get('auth/Checkjwt')
	.then(function(response)  {
        store.commit('setUserId', response.data.id)
	})
    socket.on('message',(arg1 : string) => {
        chandisp.value.messages.push(arg1);
    })
    socket.on('admin', (arg1:string) => {
        chandisp.value.adminId.push(arg1)
    })
    socket.on('banned', (arg1:string) => {
        chandisp.value.bannedId.push(arg1)
    })
    socket.on('muted', (arg1:string) => {
        chandisp.value.mutedId.push(arg1)
    })
    socket.on('createRoom', (arg1: string) => {
        chan.value.push(arg1)
    })
    socket.on('error', (arg1: string) => {
        if (arg1 == 'banned')
            onChan.value = false
    })
    store.commit('setChatsocket', socket)
    console.log(socket)

});

onBeforeUnmount(() => {
    socket.disconnect()
})



function enterchat(chan : any){
    
    if (chan.locked == true)
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
        console.log(response)
        chandisp.value.messages = response.messages
        chandisp.value.idch=response.id     
        onChan.value = true;
        chandisp.value.channame = response.channelName
        chandisp.value.ownerId = response.ownerId
        chandisp.value.user = response.user
        chandisp.value.adminId = response.adminUsers
        chandisp.value.bannedId = response.bannedUsers
        chandisp.value.mutedId = response.mutedUsers
        setting.value = false
        store.commit("setChandisp", chandisp.value)
    });
    
    
}

const createMessage = () => {
	socket.emit('createMessage',{ id: chandisp.value.idch, name: 'tea', text: messageText.value , user: User.id, to: 1});
}

function displayChats () {
	socket.emit('findAllChats', (response) => {
		chan.value = response
	});
}

function createChat () {
			socket.emit('createRoom', {
				channelName: createChan.value.channelName,
				is_private: checked.value,
				password: password.value,
				dm: createChan.value.dm,
				ownerId: User.id,
			})
}

function settings () {
    if (setting.value == true)
        setting.value = false
    else
        setting.value = true
}

function isAdmin() {
    for (let i = 0; i < chandisp.value.adminId.length; i++)
    {
        if (chandisp.value.adminId[i].id == User.id)
            return true
    }
    if (User.id == chandisp.value.ownerId)
        return true
    return false
    
}

function isMuted() {
    for (let i = 0; i < chandisp.value.mutedId.length; i++)
    {
        if (chandisp.value.mutedId[i].id == User.id)
            return true
    }
    return false
    
}

function isBanned() {
    console.log('ici')
    for (let i = 0; i < chandisp.value.bannedId.length; i++)
    {
        if (chandisp.value.bannedId[i].id == User.id)
        {
            
            onChan.value = false
            return true
        }    
    }
    return false
    
}

</script>

<template>
    <div class="chat-page">
        
        <div class="add-chat">
          <form v-if="addNewRoom" @submit.prevent.clear="createChat">
                <input type="text" placeholder="Add username"  v-model="createChan.channelName" required>
                <button type="submit"> Create Room </button>
                <button class="button-cancel" @click="addNewRoom = false">Cancel</button>
				<input type="checkbox" id="checkbox" v-model="checked" style="display: none;">
				<label for="checkbox" @click="togglePrivacy = checked">{{ checked ? 'private' : 'public' }}</label>
				<label for="password">Mot de passe</label>
				<input type="password" id="password" v-model="password" @focus="isFocused = true" @blur="isFocused = false">
            </form>
        </div>
        <div class="channel-list">
            <button @click="addNewRoom = true">+</button>
			<ol>
				<li v-for="name in chan">
                    <div v-if="name.locked === false" class="unlocked">
                        <button @click="enterchat(name)">
                            {{ name.channelName }} 
                        </button>
                    </div>
                    <div v-else class="locked">
                        <button @click="enterchat(name)">
                            {{ name.channelName }} 
                        </button>
                    </div>
				</li>
			</ol>
        </div>
        <div class="chat-display">
            <Password v-if="isPassword === true"/>
            <div class="formSetting" v-if="setting === true">
                <p>Propriete du chat</p>

                <form>

				    <input type="checkbox" id="checkbox" v-model="checked" style="display: none;">
				    <label for="checkbox" @click="togglePrivacy">Status: {{ checked ? 'private' : 'public' }}</label>
				    <label for="password">
                        Password
                        <input type="password" id="password" v-model="password" @focus="isFocused = true" @blur="isFocused = false">
                    </label>

                    <button type="button" class="btn" @click="isModalAdmin = true">
                        Select admin
                    </button>
                    <Modal emit='admin' header="Admin" v-if="isModalAdmin === true" @close="isModalAdmin = false"/>

                    <button type="button" class="btn" @click="isModalBan = true">
                        Select user to ban
                    </button>
                    <Modal emit='banned' header="Select to ban?" v-if="isModalBan === true" @close="isModalBan = false"/>

                    <button type="button" class="btn" @click="isModalMute = true">
                        Select user to mute
                    </button>
                    <Modal emit='muted'  header="Select to mute?" v-if="isModalMute === true" @close="isModalMute = false"/>
                    
                </form>
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
            </div>
            <div class="chat-messages" >
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
            <div class="typing-messages">
                <form id='test' @submit.prevent="createMessage" v-if="onChan === true && !isMuted()">
                    <input class="text" type="text" placeholder="type your message" v-model="messageText" required>
                    <button><span class="material-icons">send</span></button>
                </form>
               
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
            .locked button{
                 background-color: rgb(235, 81, 81);
            
            }
            .unlocked button{
                 background-color: rgb(188, 226, 126);
            
            }
            
            button {
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

.chat-header {
    // position: absolute;
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

.typing-messages {
    position: relative;
    display:flex;
    width: 100%;
    height: 5%;
    border-bottom-right-radius: 4px;
    z-index: 10;
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