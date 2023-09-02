<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref, reactive, computed } from 'vue';
import Axios from '../services';
import { useStore, mapState } from 'vuex'
import { useState, useActions } from 'vuex-composition-helpers/dist'

const socket = io('http://localhost:3000');
// const addNewRoom = ref(false)
const chanId : number = ref(0)
const chan = ref([])
const chandisp = ref({
	messages : [],
	idch : 0,
	channame : '',
})


const {count, addNewRoom, msg} = useState(["count", false, "msg"])
							//useMutations (changement d'etat de variable)
							//useAction (fonctions sur variable)
							//useGetter (pas compris)


const createChan = ref({
	channelName: '',
	is_private: false,
	password: '',
	dm: false,
	ownerId: 1,
})

const messageText = ref('');



onBeforeMount(() => {

    displayChats()
	Axios.get('auth/Checkjwt')
	.then(function(response)  {
		console.log(response);
	})
});



function enterchat(chan : any){
	chandisp.value.idch=chan.id
	chandisp.value.messages=chan.messages
	chandisp.value.channame=chan.channelName
	console.log(chandisp.value.messages);
}

function findChat () {
	console.log(chanId)
	socket.emit('findOneChat', { id: chanId.value }, (response) => {
		console.log('name of the chat ')
		console.log(response);
	});
}


const createMessage = () => {
	socket.emit('createMessage', { id: 1, name: 'tea', text: messageText.value  }, response => {
        console.log(response);
	});
}

function displayChats () {
	socket.emit('findAllChats', (response) => {
		chan.value = response
	});
}

function createChat () {
			socket.emit('createRoom', {
				channelName: createChan.value.channelName,
				is_private: createChan.value.is_private,
				password: createChan.value.password,
				dm: createChan.value.dm,
				ownerId: createChan.value.ownerId,
				password: createChan.value.password
			})
}

const checked = ref(false)
const isFocused = ref(false)
const password = ref('')
const togglePrivacy = ref(false)

</script>

<template>
{{count + 123}}
    <div class="chat-page">
        <div class="add-chat">
          <form v-if="addNewRoom" @submit.prevent="createChat">
                <input type="text" placeholder="Add username"  v-model="createChan.channelName" required>
                <button type="submit"> Create Room </button>
                <button class="button-cancel" @click="addNewRoom = false">Cancel</button>
				<input type="checkbox" id="checkbox" v-model="checked" style="display: none;">
				<label for="checkbox" @click="togglePrivacy">
  				{{ checked ? 'private' : 'public' }}
				</label>
				<label for="password">Mot de passe</label>
				<input type="password" id="password" v-model="password" required @focus="isFocused = true" @blur="isFocused = false">
            </form>
        </div>
        <div class="channel-list">
            <button @click="addNewRoom = true">+</button>
            <button @click="displayChats">refresh</button>
			<ol>
				<li v-for="name in chan">
					<button @click="enterchat(name)">{{ name.channelName }} </button>
				</li>
			</ol>
        </div>
        <div class="chat-display">
            <div class="chat-header">
            </div>
            <div class="chat-messages">
                <ol>
				    <li v-for="name in chandisp.messages">
                        {{ name.text }}
				</li>
			</ol>
            </div>
            <div class="typing-messages">
                <form @submit.prevent="createMessage">
                    <input type="text" placeholder="type your message" v-model="messageText" required>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-page {
    height: 100%;
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
 
            button {
                width: 100%;
                border-radius: 0;
                padding-top: 5%;
                padding-bottom: 5%;

            }
        }

    }
}

.chat-display {
    position: relative;
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    background-color:rgb(143, 143, 158);
}

.chat-header {
    position: absolute;
    display: flex;
    align-items: center;
    height: 64px;
    width: 100%;
    z-index: 10;
    margin-right: 1px;
    background-color: azure;
}

.chat-messages{
    background-color: rgb(212, 248, 236);
    flex: 1;
    overflow-y: auto;
    margin-right: 1px;
    margin-top: 65px;
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
    }
 
}

.typing-messages {
    display:flex;
    width: 100%;
    height: 10%;
    border-bottom-right-radius: 4px;
    z-index: 10;
    background-color: rgb(250, 228, 217);
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
</style>