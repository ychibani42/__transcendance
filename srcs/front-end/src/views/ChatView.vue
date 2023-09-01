<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref, reactive } from 'vue';
import Axios from '../services';
import {useStore} from 'vuex'

// setup(){
// const store=useStore()// store instead of `$store`


// console.log(store.count);
// }

const socket = io('http://localhost:3000');
const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisplay = ref('');
const createChanClass = ref({
	channelName: '',
	is_private: false,
	password: '',
	dm: false,
	ownerId: 1,
});

const id: number = ref(1)
const chanId : number = ref(0)

const chan = ref([])

const chandisp = ref({
	messages : [],
	idch : 0,
	channame : '',
})

const userId = ref();

function enterchat(chan : any){
	console.log(chan);
	chandisp.value.idch=chan.id
	chandisp.value.messages=chan.messages
	chandisp.value.channame=chan.channelName
	console.log(chandisp.value);
}


const join = () => {
	socket.emit('join', { name: name.value }, () => {
		joined.value = true;
	});
}

const sendMessage = () => {
	name.value = 'Yassine';
	console.log(name.value);
	socket.emit('createMessage', { text: messageText.value, name: name.value }, response => {
		messageText.value = '';
	});

}

let timeout;

const emitTyping = () => {
	socket.emit('typing', { isTyping: true });
	timeout = setTimeout(() => {
		socket.emit('typing', { isTyping: false });
	}, 2000);
}

function setName() {
}

// function createChan () {
//     try {
//         Axios.post("chat/createRooms", {channelName: createChanClass.value.channelName,
// 	is_private: createChanClass.value.is_private,
// 	password: createChanClass.value.password,
// 	dm: createChanClass.value.dm,
// 	ownerId: createChanClass.value.ownerId}).then(res => {
//             console.log(res);
//         } );
//     } catch (error) {
//         console.log(error);
//     }
// }

function createChan () {
	console.log('hel')
			socket.emit('createRoom', {
				channelName: createChanClass.value.channelName,
				is_private: createChanClass.value.is_private,
				password: createChanClass.value.password,
				dm: createChanClass.value.dm,
				ownerId: createChanClass.value.ownerId
			})
}
const checked = ref(true)	

function findChat () {
	console.log(chanId)
	socket.emit('findOneChat', { id: chanId.value }, (response) => {
		console.log('name of the chat ')
		console.log(response);
	});
}
function displayChats () {
	console.log('ici')
	socket.emit('findAllChats', (response) => {
		chan.value = response
		console.log(response)
		return (response)
	});
}

{{count}}

</script>

<template>
	<div class="chat">		
		<div class="create-channel">
			<form class="create" @submit.prevent="createChan()">
				<label>channel name: 
					<input type="string" v-model="createChanClass.channelName" required>
				</label>
				<label>private channel: 
					<input type="checkbox" id="checkbox" v-model="checked">
					<label for="checkbox">{{ checked }}</label>
				</label>
				<button @onclick='createChan'>create channel</button>
			</form>
			<form class="create" @submit.prevent="findChat()">
				<input class="chanId" type="number" v-model="chanId" required>
				<button @onclick="findChat">find channel</button>
			</form>
	
		</div>
		<form @submit.prevent="displayChats()">
			<button @onclick="displayChats">display channels</button>
		</form>
		<div v-if="!joined">
			<form @submit.prevent="join">
				<label>What's your name ? </label>
				<button ref="setName">NAME</button>
				<button @click="createChannButton.createChan2()"></button>
			</form>
		</div>

	
		<div class="chat-container" v-else>
			<div class="messages-container">
				<div v-for="message in messages">
					[{{ message.name }}]: {{ message.text }}
				</div>
			</div>
		</div>

		<div v-if="typingDisplay">{{ typingDisplay }}</div>


		<div class="message-input">
			<form @submit.prevent="sendMessage">
				<label>write something: </label>
				<input v-model="messageText" @input="emitTyping" />
				<button type="submit">Send</button>
			</form>
		</div>
		<div>
			<ul>
				<li v-for="name in chan">
					<button @click="enterchat(name)">{{ name.channelName }} </button>
				</li>
			</ul>
		</div>
	</div>
</template>


<style lang="scss" scoped>

.chat{
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.chat .create-channel .create{
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: flex-start;
}
</style>
