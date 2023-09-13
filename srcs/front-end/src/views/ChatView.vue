<script setup>
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
})

onBeforeMount(() => {
	socket.emit('findAllMessages', {}, (response) => {
		messages.value = response;
	});

	socket.on('message', (message) => {
		messages.value.push(message);
	});

	socket.on('typing', ({ name, isTyping }) => {
		if (isTyping) {
			typingDisplay.value = `${name} is typing...`;
		} else {
			typingDisplay.value = '';
		}
	});

});

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
			socket.emit('createRoom', {
				channelName: createChanClass.value.channelName,
				is_private: createChanClass.value.is_private,
				password: createChanClass.value.password,
				dm: createChanClass.value.dm,
				ownerId: createChanClass.value.ownerId
			})
}
const checked = ref(true)	

</script>

<template>
	<div class="chat">		
		<div class="create-channel">
			<form @submit.prevent="createChan()">
				<label>channel name: </label><input type="string" v-model="createChanClass.channelName" required>
				<label>private channel: </label>
				<input type="checkbox" id="checkbox" v-model="checked">
				<label for="checkbox">{{ checked }}</label>
				<button @onclick='createChan'>create channel</button>
			</form>
		</div>
		<div v-if="!joined">
			<form @submit.prevent="join">
				<label>What's your name ? </label>
				<button ref="setName">NAME</button>

	<button @click="createChannButton.createChan2()">
	</button>
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

	</div>
</template>


<style>
.chat{
	display: flex;
	flex-direction: column;
}
.create-channel {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
</style>
